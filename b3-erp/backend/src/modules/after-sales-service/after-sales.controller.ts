import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { AfterSalesService } from './services/after-sales.service';
import { KnowledgeCategory } from './entities/knowledge-base.entity';

@Controller('after-sales')
export class AfterSalesController {
    constructor(private readonly afterSalesService: AfterSalesService) { }

    @Get('knowledge')
    async getKnowledge(@Query('category') category?: KnowledgeCategory, @Query('search') search?: string) {
        return this.afterSalesService.findAllKnowledge({ category, search });
    }

    @Get('knowledge/:id')
    async getKnowledgeById(@Param('id') id: string) {
        return this.afterSalesService.findKnowledgeById(id);
    }

    @Get('spare-parts')
    async getSpareParts(@Query('category') category?: string, @Query('search') search?: string) {
        return this.afterSalesService.findAllParts({ category, search });
    }

    @Post('order-part')
    async orderPart(@Body() body: { partId: string; quantity: number; customerId: string }) {
        return this.afterSalesService.orderSparePart(body.partId, body.quantity, body.customerId);
    }
}
