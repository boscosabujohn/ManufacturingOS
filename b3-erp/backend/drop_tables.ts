
import { AppDataSource } from './src/data-source';

async function dropTables() {
    try {
        await AppDataSource.initialize();
        console.log('Connected to DB');

        // Drop and recreate the entire schema
        console.log('Dropping schema kreupai_fbpa_dev...');
        await AppDataSource.query(`DROP SCHEMA IF EXISTS "kreupai_fbpa_dev" CASCADE`);
        console.log('Recreating schema kreupai_fbpa_dev...');
        await AppDataSource.query(`CREATE SCHEMA "kreupai_fbpa_dev"`);

        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error:', error);
    }
}

dropTables();
