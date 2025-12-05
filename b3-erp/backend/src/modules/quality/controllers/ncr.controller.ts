import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NCRService } from '../services/ncr.service';
import { CreateNCRDto, UpdateNCRDto } from '../dto';
import { NCRStatus } from '../entities/ncr.entity';

@Controller('quality/ncr')
export class NCRController {
    constructor(private readonly ncrService: NCRService) { }

    @Post()
    create(@Body() createNCRDto: CreateNCRDto) {
        return this.ncrService.create(createNCRDto);
    }

    @Get()
    findAll(@Query('status') status?: NCRStatus) {
        return this.ncrService.findAll({ status });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ncrService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateNCRDto: UpdateNCRDto) {
        return this.ncrService.update(id, updateNCRDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.ncrService.remove(id);
    }
}
