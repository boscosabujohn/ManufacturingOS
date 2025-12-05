#!/usr/bin/env ts-node
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables
config();

// Create DataSource for migrations
const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'manufacturing_erp',
    synchronize: false, // Never use synchronize with migrations
    logging: true,
    entities: [path.join(__dirname, 'src/**/*.entity.{ts,js}')],
    migrations: [path.join(__dirname, 'src/migrations/*.{ts,js}')],
    migrationsTableName: 'migrations_history',
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false,
    } : undefined,
});

// Initialize and run migrations
async function runMigrations() {
    try {
        console.log('🔄 Connecting to database...');
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully!');

        console.log('\n🔄 Running migrations...');
        const migrations = await AppDataSource.runMigrations();

        if (migrations.length === 0) {
            console.log('ℹ️  No pending migrations to run.');
        } else {
            console.log(`\n✅ Successfully ran ${migrations.length} migration(s):`);
            migrations.forEach((migration) => {
                console.log(`   - ${migration.name}`);
            });
        }

        console.log('\n🔍 Checking migration status...');
        const executedMigrations = await AppDataSource.query(
            'SELECT * FROM migrations_history ORDER BY timestamp DESC LIMIT 5'
        );
        console.log('\nLast 5 migrations:');
        executedMigrations.forEach((mig: any) => {
            console.log(`   ✓ ${mig.name} (run at: ${new Date(parseInt(mig.timestamp)).toLocaleString()})`);
        });

        await AppDataSource.destroy();
        console.log('\n✅ Migration process completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Revert last migration
async function revertMigration() {
    try {
        console.log('🔄 Connecting to database...');
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully!');

        console.log('\n⚠️  Reverting last migration...');
        await AppDataSource.undoLastMigration();
        console.log('✅ Last migration reverted successfully!');

        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration revert failed:', error);
        process.exit(1);
    }
}

// Check migration status
async function checkStatus() {
    try {
        console.log('🔄 Connecting to database...');
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully!');

        const pendingMigrations = await AppDataSource.showMigrations();
        const executedMigrations = await AppDataSource.query(
            'SELECT * FROM migrations_history ORDER BY timestamp DESC'
        );

        console.log('\n📊 Migration Status:');
        console.log(`\n✓ Executed Migrations: ${executedMigrations.length}`);
        executedMigrations.forEach((mig: any) => {
            console.log(`   ${mig.name}`);
        });

        console.log(`\n⏳ Pending Migrations: ${pendingMigrations ? 'Yes' : 'None'}`);

        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Status check failed:', error);
        process.exit(1);
    }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
    case 'run':
        runMigrations();
        break;
    case 'revert':
        revertMigration();
        break;
    case 'status':
        checkStatus();
        break;
    default:
        console.log('\n📖 Usage:');
        console.log('  npm run migration:run     - Run pending migrations');
        console.log('  npm run migration:revert  - Revert last migration');
        console.log('  npm run migration:status  - Check migration status');
        process.exit(0);
}
