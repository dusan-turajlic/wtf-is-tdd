import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('products', table => {
      table
        .uuid('product_id')
        .primary()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.text('name').notNullable();
      // Integer for price becuase we store price in cents.
      // Fractinal cents are not really possble in product pricing.
      table.integer('price').notNullable();
      table.integer('amount').notNullable();
      table.timestamps();
    })
    .createTable('product_images', table => {
      table
        .uuid('product_image_id')
        .primary()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('product_id')
        .index()
        .references('product_id')
        .inTable('products')
        .onDelete('cascade');
      table.text('image_url').notNullable();
      table.timestamps();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_images').dropTable('products');
}
