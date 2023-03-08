import { Knex } from 'knex';
import { connection } from '../db';
import { Product } from '../representations';
import { ProductTable } from '../scheme';

interface ProductQueary extends Omit<ProductTable, 'created_at' | 'updated_at'> {
  images: string[];
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
    const allProducts = await this.getProductsQuary();
    return allProducts.map(ProductService.parseProduct);
  }

  async getOne(productId: string) {
    const [product] = await this.getProductsQuary<ProductQueary[]>()
      .where('products.product_id', productId)
      .limit(1);
    return ProductService.parseProduct(product);
  }

  async createOne({ name, price, amount, images }: CreateProductParams) {
    const productId = await this.db.transaction(async transaction => {
      const [{ product_id }] = await transaction('products').insert(
        {
          name,
          // Price is stored in cents
          price: price * 100,
          amount,
        },
        'product_id',
      );

      await Promise.all(
        images.map(async imageUrl => {
          await transaction('product_images').insert({
            product_id,
            image_url: imageUrl,
          });
        }),
      );

      return product_id;
    });

    return this.getOne(productId);
  }

  private getProductsQuary<T = ProductQueary[]>() {
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
