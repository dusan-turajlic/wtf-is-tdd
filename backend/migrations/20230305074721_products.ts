import { Knex } from 'knex';
import { onUpdateTrigger } from '../knexfile';

const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = 'DROP FUNCTION on_update_timestamp';
export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw(ON_UPDATE_TIMESTAMP_FUNCTION)
    .createTable('products', table => {
      table
        .uuid('product_id')
        .primary()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.text('name').notNullable();
      // Integer for price because we store price in cents.
      // Fractional cents are not really possible in product pricing
      table.text('description').nullable();
      table.integer('price').notNullable();
      table.integer('amount').notNullable();
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('NOW()'));
      table
        .timestamp('updated_at')
        .notNullable()
        .defaultTo(knex.raw('NOW()'));
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
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('NOW()'));
      table
        .timestamp('updated_at')
        .notNullable()
        .defaultTo(knex.raw('NOW()'));
    })
    .then(() => {
      onUpdateTrigger('products');
      onUpdateTrigger('product_images');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('product_images')
    .dropTable('products')
    .raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
}
