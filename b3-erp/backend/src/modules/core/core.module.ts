import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Customer } from './entities/customer.entity';
import { Vendor } from './entities/vendor.entity';
import { Item } from './entities/item.entity';
import { UnitOfMeasure } from './entities/uom.entity';
import { Category } from './entities/category.entity';
import { Company } from './entities/company.entity';

// Controllers
import { CustomerController } from './controllers/customer.controller';
import { VendorController } from './controllers/vendor.controller';
import { ItemController } from './controllers/item.controller';
import { UomController } from './controllers/uom.controller';
import { CategoryController } from './controllers/category.controller';
import { CompanyController } from './controllers/company.controller';

// Services
import { CustomerService } from './services/customer.service';
import { VendorService } from './services/vendor.service';
import { ItemService } from './services/item.service';
import { UomService } from './services/uom.service';
import { CategoryService } from './services/category.service';
import { CompanyService } from './services/company.service';

// Seeders
import { UomSeederService } from './services/uom-seeder.service';
import { CategorySeederService } from './services/category-seeder.service';
import { CustomerSeederService } from './services/customer-seeder.service';
import { VendorSeederService } from './services/vendor-seeder.service';
import { ItemSeederService } from './services/item-seeder.service';
import { CompanySeederService } from './services/company-seeder.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Vendor,
      Item,
      UnitOfMeasure,
      Category,
      Company,
    ]),
  ],
  controllers: [
    CustomerController,
    VendorController,
    ItemController,
    UomController,
    CategoryController,
    CompanyController,
  ],
  providers: [
    CustomerService,
    VendorService,
    ItemService,
    UomService,
    CategoryService,
    CompanyService,
    // Seeders
    UomSeederService,
    CategorySeederService,
    CustomerSeederService,
    VendorSeederService,
    ItemSeederService,
    CompanySeederService,
  ],
  exports: [
    CustomerService,
    VendorService,
    ItemService,
    UomService,
    CategoryService,
    CompanyService,
  ],
})
export class CoreModule { }
