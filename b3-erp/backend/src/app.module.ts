import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

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
import { AfterSalesServiceModule } from './modules/after-sales-service/after-sales-service.module';
import { QualityModule } from './modules/quality/quality.module';
import { ProjectManagementModule } from './modules/project-management/project-management.module';


@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database - Now enabled with comprehensive entities
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'manufacturing_erp'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Bull Queue - For async job processing
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('BULL_REDIS_HOST', 'localhost'),
          port: +configService.get('BULL_REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),

    // Application Modules - Comprehensive Manufacturing ERP
    CoreModule, // Customer, Vendor, Item, UOM, Category masters
    AccountsModule,
    CrmModule, // Lead & Interaction management
    SalesModule, // RFP, Quotes, Orders
    AfterSalesServiceModule, // Service requests, contracts, warranties
    EstimationModule, // Cost estimation & quotations
    InventoryModule, // Stock management, warehousing, transfers
    ProductionModule, // BOM, Work Orders, Shop Floor Control
    ProcurementModule, // Purchase Orders, RFQ, Goods Receipt
    FinanceModule, // GL, Journal Entries, Invoices, Payments
    HrModule, // Employee, Payroll, Leave, Attendance
    QualityModule, // QC, Inspections, NCR, CAPA
    WorkflowModule, // Approval workflows
    ReportsModule, // Comprehensive reporting
    LogisticsModule, // Shipment, Fleet, Route management
    SupportModule, // Customer support
    ItAdminModule, // User, Role, Permission, Audit management
    ProjectManagementModule, // Project tracking, documents, handover
  ],
})
export class AppModule { }
