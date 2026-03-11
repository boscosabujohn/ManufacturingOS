import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { testDbConfig } from './utils/test-db.config';

export class TestSetup {
    private static moduleFixture: TestingModule;
    private static dataSource: DataSource;

    static async init(extraModules: any[] = [], providers: any[] = []) {
        this.moduleFixture = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(testDbConfig()),
                ...extraModules,
            ],
            providers,
        }).compile();

        const app = this.moduleFixture.createNestApplication();
        await app.init();

        this.dataSource = this.moduleFixture.get<DataSource>(DataSource);
        return { app, module: this.moduleFixture, dataSource: this.dataSource };
    }

    static async cleanDatabase() {
        if (!this.dataSource) return;

        const entities = this.dataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = this.dataSource.getRepository(entity.name);
            await repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
        }
    }

    static async close(app: any) {
        if (app) {
            await app.close();
        }
        if (this.dataSource && this.dataSource.isInitialized) {
            await this.dataSource.destroy();
        }
    }
}
