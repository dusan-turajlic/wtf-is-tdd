import { Knex } from 'knex';
import { connection } from '../db';
import { Product } from '../representations';
import { ProductTable } from '../scheme';

interface ProductQueary extends Omit<ProductTable, 'created_at' | 'updated_at'> {
  images?: string[];
}

export type CreateProductParams = Omit<ProductQueary, 'product_id'>;

export default new (class ProductService {
  db: Knex;

  defaultQuary: (string | Knex.Raw)[];

  constructor() {
    this.db = connection();
    this.defaultQuary = [
      'products.product_id',
      'products.name',
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

  async createOne({ name, price, amount, images }: CreateProductParams) {
    return this.db.transaction(async transaction => {
      const [product] = await transaction('products').insert(
        {
          name,
          // Price is stored in cents
          price: price * 100,
          amount,
        },
        ['product_id', 'name', 'price', 'amount'],
      );

      const productImages = await ProductService.addNewImages(transaction, product.productId, images);

      return ProductService.parseProduct({
        ...product,
        images: productImages,
      });
    });
  }

  async updateOne(productId: string, { name, price, amount, images }: Partial<CreateProductParams>) {
    await this.db.transaction(async transaction => {
      if (name || price || amount) {
        await transaction('products')
          .where('product_id', productId)
          .update(
            {
              name,
              price: price && price * 100,
              amount,
            },
            ['name', 'price', 'amount'],
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

  private static async addNewImages(transaction: Knex.Transaction, productId: string, images: string[] = []) {
    return Promise.all(
      images.map(async imageUrl => {
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
      .select<T>(this.defaultQuary)
      .groupBy('products.product_id');
  }

  private static parseProduct(product: ProductQueary) {
    return Product.parse({
      productId: product.product_id,
      name: product.name,
      amount: product.amount,
      price: product.price,
      images: product.images ?? [],
    });
  }
})();
