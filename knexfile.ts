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
  }

};

module.exports = config;
