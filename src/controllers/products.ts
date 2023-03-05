import Router from 'koa-router';
import { Product } from '../representations';
import { ProductTable } from '../scheme';
import { connection } from '../db';
import HttpStatusCode from '../enum/http';

interface ProductQueary extends Omit<ProductTable, 'created_at' | 'updated_at'> {
  images: string[];
}

const register = (router: Router) => {
  router.get('/products', async ctx => {
    const db = connection();
    ctx.status = HttpStatusCode.OK;
    const products = await db('products')
      .leftJoin('product_images', 'product_images.product_id', 'products.product_id')
      .select<ProductQueary[]>([
        'products.product_id',
        'products.name',
        'products.price',
        'products.amount',
        db.raw(
          'COALESCE(ARRAY_AGG(product_images.image_url) FILTER (WHERE product_images.image_url IS NOT NULL)) as images',
        ),
      ])
      .groupBy('products.product_id');
    ctx.body = products.map(product =>
      Product.parse({
        productId: product.product_id,
        name: product.name,
        amount: product.amount,
        // Price is sotred in cents in the datbase.
        price: product.price,
        images: product.images ?? [],
      }),
    );
  });
};

export default { register };
