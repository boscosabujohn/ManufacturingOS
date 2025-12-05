import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ReorderManagementService, ReorderSuggestion, InventoryItem } from '../services/reorder-management.service';

@ApiTags('Inventory - Reorder Management')
@Controller('inventory/reorder')
export class ReorderManagementController {
    constructor(private readonly reorderService: ReorderManagementService) { }

    @Get('suggestions')
    @ApiOperation({ summary: 'Generate reorder suggestions' })
    @ApiResponse({ status: HttpStatus.OK })
    async generateSuggestions(): Promise<ReorderSuggestion[]> {
        return this.reorderService.generateReorderSuggestions();
    }

    @Post('suggestions/:id/approve')
    @ApiOperation({ summary: 'Approve reorder suggestion' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: HttpStatus.OK })
    async approveSuggestion(
        @Param('id') id: string,
        @Body('approvedBy') approvedBy: string,
        @Body('quantity') quantity?: number,
    ): Promise<ReorderSuggestion> {
        return this.reorderService.approveSuggestion(id, approvedBy, quantity);
    }

    @Post('suggestions/:id/create-pr')
    @ApiOperation({ summary: 'Create Purchase Requisition from suggestion' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async createPurchaseRequisition(@Param('id') id: string): Promise<{ prId: string }> {
        const prId = await this.reorderService.createPurchaseRequisition(id);
        return { prId };
    }

    @Get('analysis')
    @ApiOperation({ summary: 'Get stock analysis' })
    @ApiResponse({ status: HttpStatus.OK })
    async getStockAnalysis(): Promise<any[]> {
        return this.reorderService.getStockAnalysis();
    }

    @Get('report')
    @ApiOperation({ summary: 'Get reorder report' })
    @ApiResponse({ status: HttpStatus.OK })
    async getReorderReport(): Promise<any> {
        return this.reorderService.getReorderReport();
    }

    @Put('items/:id/parameters')
    @ApiOperation({ summary: 'Update reorder parameters' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: HttpStatus.OK })
    async updateParameters(
        @Param('id') id: string,
        @Body() params: any,
    ): Promise<InventoryItem> {
        return this.reorderService.updateReorderParameters(id, params);
    }

    @Get('items/:id/optimize')
    @ApiOperation({ summary: 'Get optimization suggestions' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: HttpStatus.OK })
    async optimizeParameters(@Param('id') id: string): Promise<any> {
        return this.reorderService.optimizeReorderParameters(id);
    }
}
