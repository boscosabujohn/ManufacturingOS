import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BOQ, BOQItem, BOQStatus } from '../entities/boq.entity';
import { BOQService } from '../services/boq.service';

@Controller('estimation/boq')
export class BOQController {
  constructor(private readonly boqService: BOQService) {}

  @Post()
  create(
    @Body() data: { boq: Partial<BOQ>; items?: Partial<BOQItem>[] },
  ): Promise<BOQ> {
    return this.boqService.create(data.boq, data.items);
  }

  @Post('from-template/:templateId')
  createFromTemplate(
    @Param('templateId') templateId: string,
    @Body() data: Partial<BOQ>,
  ): Promise<BOQ> {
    return this.boqService.createFromTemplate(templateId, data);
  }

  @Post('import-bom')
  importFromBOM(
    @Body()
    data: {
      bomData: {
        itemNo: string;
        description: string;
        unit: string;
        quantity: number;
        category: string;
      }[];
      boqData: Partial<BOQ>;
    },
  ): Promise<BOQ> {
    return this.boqService.importFromBOM(data.bomData, data.boqData);
  }

  @Get()
  findAll(
    @Query('status') status?: BOQStatus,
    @Query('clientName') clientName?: string,
  ): Promise<BOQ[]> {
    return this.boqService.findAll({ status, clientName });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BOQ> {
    return this.boqService.findOne(id);
  }

  @Get(':id/items')
  findItems(@Param('id') id: string): Promise<BOQItem[]> {
    return this.boqService.findItems(id);
  }

  @Get(':id/analysis')
  getAnalysis(@Param('id') id: string) {
    return this.boqService.getAnalysis(id);
  }

  @Get('compare/:boqId1/:boqId2')
  compareBOQs(
    @Param('boqId1') boqId1: string,
    @Param('boqId2') boqId2: string,
  ) {
    return this.boqService.compareBOQs(boqId1, boqId2);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<BOQ>): Promise<BOQ> {
    return this.boqService.update(id, data);
  }

  @Patch(':id/items')
  updateItems(
    @Param('id') id: string,
    @Body() items: Partial<BOQItem>[],
  ): Promise<BOQItem[]> {
    return this.boqService.updateItems(id, items);
  }

  @Post(':id/submit')
  submitForReview(@Param('id') id: string): Promise<BOQ> {
    return this.boqService.submitForReview(id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string): Promise<BOQ> {
    return this.boqService.approve(id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string): Promise<BOQ> {
    return this.boqService.reject(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.boqService.delete(id);
  }
}
