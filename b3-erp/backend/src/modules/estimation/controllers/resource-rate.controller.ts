import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  EquipmentRate,
  LaborRateCard,
  MaterialRateCard,
  ResourceRate,
  ResourceRateType,
  SubcontractorRate,
} from '../entities/resource-rate.entity';
import { ResourceRateService } from '../services/resource-rate.service';

@Controller('estimation/resource-rates')
export class ResourceRateController {
  constructor(private readonly resourceRateService: ResourceRateService) {}

  // General Resource Rates
  @Post()
  createResourceRate(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ResourceRate>,
  ): Promise<ResourceRate> {
    return this.resourceRateService.createResourceRate(companyId, data);
  }

  @Get()
  findAllResourceRates(
    @Headers('x-company-id') companyId: string,
    @Query('rateType') rateType?: ResourceRateType,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ): Promise<ResourceRate[]> {
    return this.resourceRateService.findAllResourceRates(companyId, {
      rateType,
      category,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  findResourceRateById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<ResourceRate> {
    return this.resourceRateService.findResourceRateById(companyId, id);
  }

  @Get(':id/effective-rate')
  getEffectiveRate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Query('quantity') quantity: string,
  ): Promise<number> {
    return this.resourceRateService.getEffectiveRate(
      companyId,
      id,
      parseFloat(quantity),
    );
  }

  @Patch(':id')
  updateResourceRate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<ResourceRate>,
  ): Promise<ResourceRate> {
    return this.resourceRateService.updateResourceRate(companyId, id, data);
  }

  @Delete(':id')
  deleteResourceRate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.resourceRateService.deleteResourceRate(companyId, id);
  }

  // Material Rate Cards
  @Post('material-cards')
  createMaterialRateCard(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<MaterialRateCard>,
  ): Promise<MaterialRateCard> {
    return this.resourceRateService.createMaterialRateCard(companyId, data);
  }

  @Get('material-cards/all')
  findAllMaterialRateCards(
    @Headers('x-company-id') companyId: string,
    @Query('activeOnly') activeOnly?: string,
  ): Promise<MaterialRateCard[]> {
    return this.resourceRateService.findAllMaterialRateCards(
      companyId,
      activeOnly === 'true',
    );
  }

  @Get('material-cards/:id')
  findMaterialRateCardById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<MaterialRateCard> {
    return this.resourceRateService.findMaterialRateCardById(companyId, id);
  }

  @Patch('material-cards/:id')
  updateMaterialRateCard(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<MaterialRateCard>,
  ): Promise<MaterialRateCard> {
    return this.resourceRateService.updateMaterialRateCard(companyId, id, data);
  }

  @Delete('material-cards/:id')
  deleteMaterialRateCard(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.resourceRateService.deleteMaterialRateCard(companyId, id);
  }

  // Labor Rate Cards
  @Post('labor-cards')
  createLaborRateCard(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<LaborRateCard>,
  ): Promise<LaborRateCard> {
    return this.resourceRateService.createLaborRateCard(companyId, data);
  }

  @Get('labor-cards/all')
  findAllLaborRateCards(
    @Headers('x-company-id') companyId: string,
    @Query('activeOnly') activeOnly?: string,
  ): Promise<LaborRateCard[]> {
    return this.resourceRateService.findAllLaborRateCards(
      companyId,
      activeOnly === 'true',
    );
  }

  @Get('labor-cards/:id')
  findLaborRateCardById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<LaborRateCard> {
    return this.resourceRateService.findLaborRateCardById(companyId, id);
  }

  @Patch('labor-cards/:id')
  updateLaborRateCard(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<LaborRateCard>,
  ): Promise<LaborRateCard> {
    return this.resourceRateService.updateLaborRateCard(companyId, id, data);
  }

  @Delete('labor-cards/:id')
  deleteLaborRateCard(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.resourceRateService.deleteLaborRateCard(companyId, id);
  }

  // Equipment Rates
  @Post('equipment')
  createEquipmentRate(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<EquipmentRate>,
  ): Promise<EquipmentRate> {
    return this.resourceRateService.createEquipmentRate(companyId, data);
  }

  @Get('equipment/all')
  findAllEquipmentRates(
    @Headers('x-company-id') companyId: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ): Promise<EquipmentRate[]> {
    return this.resourceRateService.findAllEquipmentRates(companyId, {
      category,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('equipment/:id')
  findEquipmentRateById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<EquipmentRate> {
    return this.resourceRateService.findEquipmentRateById(companyId, id);
  }

  @Get('equipment/:id/calculate-cost')
  calculateEquipmentCost(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Query('days') days: string,
    @Query('includeOperator') includeOperator?: string,
  ) {
    return this.resourceRateService.calculateEquipmentCost(
      companyId,
      id,
      parseFloat(days),
      includeOperator === 'true',
    );
  }

  @Patch('equipment/:id')
  updateEquipmentRate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<EquipmentRate>,
  ): Promise<EquipmentRate> {
    return this.resourceRateService.updateEquipmentRate(companyId, id, data);
  }

  @Delete('equipment/:id')
  deleteEquipmentRate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.resourceRateService.deleteEquipmentRate(companyId, id);
  }

  // Subcontractor Rates
  @Post('subcontractors')
  createSubcontractorRate(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<SubcontractorRate>,
  ): Promise<SubcontractorRate> {
    return this.resourceRateService.createSubcontractorRate(companyId, data);
  }

  @Get('subcontractors/all')
  findAllSubcontractorRates(
    @Headers('x-company-id') companyId: string,
    @Query('isActive') isActive?: string,
    @Query('isPreferred') isPreferred?: string,
  ): Promise<SubcontractorRate[]> {
    return this.resourceRateService.findAllSubcontractorRates(companyId, {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isPreferred: isPreferred === 'true' ? true : isPreferred === 'false' ? false : undefined,
    });
  }

  @Get('subcontractors/by-service')
  findSubcontractorsByService(
    @Headers('x-company-id') companyId: string,
    @Query('serviceName') serviceName: string,
  ): Promise<SubcontractorRate[]> {
    return this.resourceRateService.findSubcontractorsByService(
      companyId,
      serviceName,
    );
  }

  @Get('subcontractors/:id')
  findSubcontractorRateById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<SubcontractorRate> {
    return this.resourceRateService.findSubcontractorRateById(companyId, id);
  }

  @Patch('subcontractors/:id')
  updateSubcontractorRate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<SubcontractorRate>,
  ): Promise<SubcontractorRate> {
    return this.resourceRateService.updateSubcontractorRate(companyId, id, data);
  }

  @Delete('subcontractors/:id')
  deleteSubcontractorRate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.resourceRateService.deleteSubcontractorRate(companyId, id);
  }
}
