import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.db.host,
  port: 3306,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: false,
  logging: false,
  migrationsRun: false,
  entities: [
    `${__dirname}/database/entities/*.ts`,
    `${__dirname}/database/entities/*.js`
  ],
  migrations: [
    `${__dirname}/database/migrations/*.ts`,
    `${__dirname}/database/migrations/*.js`
  ],
  subscribers: [],
  cli: {
    migrationsDir: `${__dirname}/src/database/migrations`
  }
} as DataSourceOptions & { cli: { migrationsDir: string } });
