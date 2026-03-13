import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '@/entities/Todo';
import path from 'path';
import fs from 'fs';

declare global {
  // eslint-disable-next-line no-var
  var _dataSource: DataSource | undefined;
}

function getDatabasePath(): string {
  const dbPath = process.env.DATABASE_PATH || './data/todos.db';
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return resolvedPath;
}

export async function getDataSource(): Promise<DataSource> {
  if (global._dataSource && global._dataSource.isInitialized) {
    return global._dataSource;
  }

  const dbPath = getDatabasePath();

  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    synchronize: true,
    logging: false,
    entities: [Todo],
  });

  await dataSource.initialize();
  global._dataSource = dataSource;
  return dataSource;
}
