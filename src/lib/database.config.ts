import { resolve } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
const pathTo = (folder: string) => resolve(process.cwd(), 'libs', 'server', 'database', 'src', 'lib', folder);

export class DatabaseConfig implements PostgresConnectionOptions {
  container = process.env.DB_CONTAINER as string;
  username = process.env.DB_USER as string;
  password = process.env.DB_PW as string;
  host = process.env.DB_HOST as string;
  database = process.env.DB_NAME as string;
  port = Number(process.env.DB_PORT);
  synchronize = false;
  schema = process.env.DATABASE_SCHEMA;
  type = 'postgres' as any;
  cli = {
    migrationsDir: pathTo('migration'),
    subscribersDir: pathTo('subscriber'),
    entitiesDir: pathTo('entity')
  };

  constructor(public readonly entities: any[], public readonly migrations: any[]) { }
}

