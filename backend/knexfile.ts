// eslint-disable-next-line prettier/prettier
import type { Knex } from 'knex';
import { appConfig } from './src/config';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: appConfig.dbHost,
      port: appConfig.dbPort,
      user: appConfig.dbUsername,
      password: appConfig.dbPassword,
      database: appConfig.dbName,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  },
};

export const onUpdateTrigger = (table: string) => `
  CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();
`;

export default config;
