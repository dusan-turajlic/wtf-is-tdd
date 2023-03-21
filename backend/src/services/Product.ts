import { Knex } from 'knex';
import * as crypto from 'crypto';
import { z } from 'zod';
import * as process from 'process';
import { connection } from '../db';
import { Product } from '../representations';
import { CreateProduct, UpdateProduct } from '../validators';
import { ProductTable } from '../scheme';
import { uploadToS3 } from '../file';

interface ProductQueary extends Omit<ProductTable, 'created_at' | 'updated_at'> {
  images?: string[];
}

export default new (class ProductService {
  db: Knex;

  defaultQuery: (string | Knex.Raw)[];

  constructor() {
    this.db = connection();
    this.defaultQuery = [
      'products.product_id',
      'products.name',
      'products.description',
      'products.price',
      'products.amount',
      this.db.raw(
        'COALESCE(ARRAY_AGG(product_images.image_url) FILTER (WHERE product_images.image_url IS NOT NULL)) as images',
      ),
    ];
  }

  async getAll() {
    const allProducts = await this.getProductsQuery();
    return allProducts.map(ProductService.parseProduct);
  }

  async getOne(productId: string) {
    const products = await this.getProductsQuery<ProductQueary[]>()
      .where('products.product_id', productId)
      .limit(1);

    if (!products.length) {
      return null;
    }

    const [product] = products;
    return ProductService.parseProduct(product);
  }

  async createOne({ name, price, description, amount, images }: z.infer<typeof CreateProduct>) {
    return this.db.transaction(async transaction => {
      const [product] = await transaction('products').insert(
        {
          name,
          // Price is stored in cents
          price: price * 100,
          description,
          amount,
        },
        ['product_id', 'name', 'description', 'price', 'amount'],
      );

      const productImages = await ProductService.addNewImages(transaction, product.productId, images);

      return ProductService.parseProduct({
        ...product,
        images: productImages,
      });
    });
  }

  async updateOne(productId: string, { name, price, description, amount, images }: z.infer<typeof UpdateProduct>) {
    await this.db.transaction(async transaction => {
      if (name || price || amount || description) {
        await transaction('products')
          .where('product_id', productId)
          .update(
            {
              name,
              price: price && price * 100,
              description,
              amount,
            },
            ['name', 'price', 'description', 'amount'],
          );
      }

      if (images && images.length) {
        await ProductService.addNewImages(transaction, productId, images);
      }
    });

    return this.getOne(productId);
  }

  async deleteOne(productId: string) {
    return this.db.transaction(async transaction => {
      // Product images are deleted by cascade.
      await transaction('products')
        .where('product_id', productId)
        .del();
    });
  }

  private static async addNewImages(transaction: Knex.Transaction, productId: string, images: Blob[] = []) {
    const uploadedImages = await Promise.all(
      images.map(async blob => {
        return uploadToS3(blob, productId, crypto.randomUUID());
      }),
    );
    return Promise.all(
      uploadedImages.map(async imageUrl => {
        const [image] = await transaction('product_images').insert(
          {
            product_id: productId,
            image_url: imageUrl,
          },
          ['image_url'],
        );
        return image.image_url;
      }),
    );
  }

  private getProductsQuery<T = ProductQueary[]>() {
    return this.db('products')
      .leftJoin('product_images', 'product_images.product_id', 'products.product_id')
      .select<T>(this.defaultQuery)
      .groupBy('products.product_id');
  }

  private static parseProduct(product: ProductQueary) {
    return Product.parse({
      productId: product.product_id,
      name: product.name,
      description: product.description,
      amount: product.amount,
      price: product.price,
      images: product.images ?? [],
    });
  }
})();
