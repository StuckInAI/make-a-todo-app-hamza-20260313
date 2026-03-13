import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '@/entities/Todo';
import path from 'path';
import fs from 'fs';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH || './data/todos.db';
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  const dbDir = path.dirname(resolvedPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedPath,
    synchronize: true,
    logging: false,
    entities: [Todo],
  });

  await dataSource.initialize();
  return dataSource;
}
