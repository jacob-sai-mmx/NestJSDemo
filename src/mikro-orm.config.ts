import { defineConfig, MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import 'dotenv/config';

export default defineConfig({
  driverOptions: {
    connection: {
      host: process.env.DATABASE_HOST ?? '127.0.0.1',
      port: process.env.DATABASE_PORT ?? 5432,
      user: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
    },
  },
  tsNode: process.env.NODE_DEV === 'true' ? true : false,
  dbName: process.env.DATABASE_DBNAME ?? 'project_local',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  driver: PostgreSqlDriver,
}) as Parameters<typeof MikroORM.init>[0];
