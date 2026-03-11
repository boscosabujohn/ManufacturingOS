import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const testDbConfig = (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE_TEST || 'manufacturing_erp_test',
    entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
    synchronize: true, // Always true for test DB to auto-generate schema
    dropSchema: true,  // Drop schema before each test run for isolation
    logging: false,
});
