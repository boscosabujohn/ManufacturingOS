
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BOQService } from '../services/boq.service';
import { BOQ } from '../../project/entities/boq.entity';
import { BOQItem } from '../../project/entities/boq-item.entity';

@ApiTags('BOQ')
@Controller('api/boq')
export class BOQController {
    constructor(private readonly boqService: BOQService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new BOQ' })
    @ApiResponse({ status: 201, description: 'The BOQ has been successfully created.' })
    async create(@Body() createBOQDto: Partial<BOQ>) {
        return this.boqService.createBOQ(createBOQDto);
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'Get BOQs for a project' })
    @ApiResponse({ status: 200, description: 'Return project BOQs.' })
    async getProjectBOQ(@Param('projectId') projectId: string) {
        return this.boqService.getProjectBOQ(projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a BOQ by id' })
    @ApiResponse({ status: 200, description: 'Return the BOQ.' })
    @ApiResponse({ status: 404, description: 'BOQ not found.' })
    async findOne(@Param('id') id: string) {
        return this.boqService.getBOQ(id);
    }

    @Post(':id/items')
    @ApiOperation({ summary: 'Add item to BOQ' })
    @ApiResponse({ status: 201, description: 'Item added successfully.' })
    async addItem(@Param('id') id: string, @Body() itemData: Partial<BOQItem>) {
        return this.boqService.addItem(id, itemData);
    }

    @Put('items/:itemId')
    @ApiOperation({ summary: 'Update BOQ item' })
    @ApiResponse({ status: 200, description: 'Item updated successfully.' })
    async updateItem(@Param('itemId') itemId: string, @Body() itemData: Partial<BOQItem>) {
        return this.boqService.updateItem(itemId, itemData);
    }

    @Delete('items/:itemId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove BOQ item' })
    @ApiResponse({ status: 204, description: 'Item removed successfully.' })
    async removeItem(@Param('itemId') itemId: string) {
        return this.boqService.removeItem(itemId);
    }
}
