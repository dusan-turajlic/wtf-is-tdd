import { Knex } from 'knex';
import * as fs from 'fs';
import * as path from 'path';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('products').del();
  const file = fs.readFileSync(path.resolve(`${__dirname}/seed-data.json`));
  const data = JSON.parse(file.toString());

  for await (const [table, values] of Object.entries(data)) {
    await knex(table).insert(values);
  }
}
