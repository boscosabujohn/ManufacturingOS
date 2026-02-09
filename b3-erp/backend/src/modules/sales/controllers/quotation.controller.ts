import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { QuotationService } from '../services/quotation.service';
import { CreateQuotationDto, UpdateQuotationDto } from '../dto/quotation.dto';

@Controller('sales/quotations')
export class QuotationController {
    constructor(private readonly quotationService: QuotationService) { }

    @Get()
    async findAll(@Query() filters: any) {
        return await this.quotationService.findAll(filters);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.quotationService.findOne(id);
    }

    @Post()
    async create(@Body() createQuotationDto: CreateQuotationDto) {
        return await this.quotationService.create(createQuotationDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateQuotationDto: UpdateQuotationDto) {
        return await this.quotationService.update(id, updateQuotationDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.quotationService.delete(id);
    }
}
