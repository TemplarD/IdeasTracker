import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'ideatracker',
  password: process.env.DB_PASSWORD || 'ideatracker123',
  database: process.env.DB_NAME || 'ideatracker',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
