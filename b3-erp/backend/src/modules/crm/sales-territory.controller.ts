import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { SalesTerritoryService } from './services/sales-territory.service';
import { SalesTerritory } from './entities/sales-territory.entity';

@Controller('crm/territories')
export class SalesTerritoryController {
    constructor(private readonly territoryService: SalesTerritoryService) { }

    @Get()
    findAll() {
        return this.territoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.territoryService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() data: Partial<SalesTerritory>) {
        return this.territoryService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Partial<SalesTerritory>) {
        return this.territoryService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.territoryService.remove(id);
    }
}
