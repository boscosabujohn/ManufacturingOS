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

async function fix() {
    await AppDataSource.initialize();
    console.log('Connected');

    const migrations = [
        { name: 'CreateApprovalTables1733320395000', timestamp: 1733320395000 },
        { name: 'InitialSchema1764231873370', timestamp: 1764231873370 }
    ];

    for (const mig of migrations) {
        // Check if it exists
        const exists = await AppDataSource.query(
            `SELECT * FROM migrations_history WHERE name = '${mig.name}'`
        );

        if (exists.length === 0) {
            console.log(`Inserting ${mig.name}...`);
            await AppDataSource.query(
                `INSERT INTO migrations_history (timestamp, name) VALUES (${mig.timestamp}, '${mig.name}')`
            );
            console.log('Done.');
        } else {
            console.log(`${mig.name} already exists.`);
        }
    }

    await AppDataSource.destroy();
}

fix();
