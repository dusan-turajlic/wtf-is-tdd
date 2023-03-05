import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('products').del();

  // Inserts seed entries
  const productIds = await knex('products')
    .returning('product_id')
    .insert([
      { name: 'Book', price: 1400, amount: 10 },
      { name: 'Phone', price: 29999, amount: 0 },
    ]);

  // eslint-disable-next-line @typescript-eslint/camelcase
  const [{ product_id }] = (productIds as unknown) as { product_id: string }[];
  await knex('product_images').insert([
    { product_id, image_url: 'https://howtodrawforkids.com/wp-content/uploads/2022/07/how-to-draw-an-open-book.jpg' },
  ]);
}
