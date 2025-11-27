import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'b3erp',
    schema: process.env.DB_SCHEMA || 'kreupai_factory_os',
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false,
    } : undefined,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables in dev
    logging: process.env.DB_LOGGING === 'true',
});

