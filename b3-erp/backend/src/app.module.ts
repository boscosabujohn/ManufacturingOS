import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { BullModule } from '@nestjs/bull';

// Modules
import { CoreModule } from './modules/core/core.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { CrmModule } from './modules/crm/crm.module';
import { SalesModule } from './modules/sales/sales.module';
import { EstimationModule } from './modules/estimation/estimation.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ProductionModule } from './modules/production/production.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { FinanceModule } from './modules/finance/finance.module';
import { HrModule } from './modules/hr/hr.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ReportsModule } from './modules/reports/reports.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { SupportModule } from './modules/support/support.module';
import { ItAdminModule } from './modules/it-admin/it-admin.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database - Temporarily disabled for RFP demo (uses in-memory storage)
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST'),
    //     port: +configService.get('DB_PORT'),
    //     username: configService.get('DB_USERNAME'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_DATABASE'),
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     synchronize: configService.get('NODE_ENV') === 'development',
    //     logging: configService.get('NODE_ENV') === 'development',
    //   }),
    //   inject: [ConfigService],
    // }),

    // Bull Queue - Temporarily disabled for RFP demo
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get('BULL_REDIS_HOST'),
    //       port: +configService.get('BULL_REDIS_PORT'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),

    // Application Modules
    CoreModule,
    AccountsModule,
    CrmModule,
    SalesModule,
    EstimationModule,
    InventoryModule,
    ProductionModule,
    ProcurementModule,
    FinanceModule,
    HrModule,
    WorkflowModule,
    ReportsModule,
    LogisticsModule,
    SupportModule,
    ItAdminModule,
  ],
})
export class AppModule {}
