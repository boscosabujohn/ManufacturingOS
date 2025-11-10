import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Customer } from './entities/customer.entity';
import { Vendor } from './entities/vendor.entity';
import { Item } from './entities/item.entity';
import { UnitOfMeasure } from './entities/uom.entity';
import { Category } from './entities/category.entity';

// Controllers
import { CustomerController } from './controllers/customer.controller';
import { VendorController } from './controllers/vendor.controller';
import { ItemController } from './controllers/item.controller';
import { UomController } from './controllers/uom.controller';
import { CategoryController } from './controllers/category.controller';

// Services
import { CustomerService } from './services/customer.service';
import { VendorService } from './services/vendor.service';
import { ItemService } from './services/item.service';
import { UomService } from './services/uom.service';
import { CategoryService } from './services/category.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Vendor,
      Item,
      UnitOfMeasure,
      Category,
    ]),
  ],
  controllers: [
    CustomerController,
    VendorController,
    ItemController,
    UomController,
    CategoryController,
  ],
  providers: [
    CustomerService,
    VendorService,
    ItemService,
    UomService,
    CategoryService,
  ],
  exports: [
    CustomerService,
    VendorService,
    ItemService,
    UomService,
    CategoryService,
  ],
})
export class CoreModule {}
