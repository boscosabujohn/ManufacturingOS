
import { AppDataSource } from './src/data-source';

async function inspect() {
    try {
        await AppDataSource.initialize();
        console.log('Connected to DB');

        const result = await AppDataSource.query(`
      SELECT table_schema, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'migrations';
    `);
        console.log('Migrations table columns:', result);

        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error:', error);
    }
}

inspect();
