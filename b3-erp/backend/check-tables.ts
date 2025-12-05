import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'manufacturing_erp',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

async function check() {
    await AppDataSource.initialize();
    console.log('Connected');

    const result = await AppDataSource.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'`
    );
    console.log('Columns:', result.map((r: any) => r.column_name));

    await AppDataSource.destroy();
}

check();
