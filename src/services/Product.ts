import { Knex } from 'knex';
import { connection } from '../db';
import { Product } from '../representations';
import { ProductTable } from '../scheme';

interface ProductQueary extends Omit<ProductTable, 'created_at' | 'updated_at'> {
  images: string[];
}

type CreateProductParams = Omit<ProductQueary, 'product_id'>;

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
    const products = await this.getProductsQuary();
    return products.map(ProductService.parseProduct);
  }

  async getOne(productId: string) {
    const product = await this.getProductsQuary<ProductQueary>()
      .where('product_id', productId)
      .limit(1);
    return ProductService.parseProduct(product);
  }

  async createOne(params: CreateProductParams) {
    // @TODO: add code here 👍🏻
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
