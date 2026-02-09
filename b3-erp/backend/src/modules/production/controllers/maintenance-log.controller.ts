import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MaintenanceLogService } from '../services/maintenance-log.service';
import { MaintenanceStatus } from '../entities/machine-maintenance-log.entity';

@Controller('production/maintenance-logs')
export class MaintenanceLogController {
    constructor(private readonly maintenanceLogService: MaintenanceLogService) { }

    @Post()
    create(@Body() createDto: any) {
        return this.maintenanceLogService.create(createDto);
    }

    @Get()
    findAll(
        @Query('workCenterId') workCenterId?: string,
        @Query('status') status?: MaintenanceStatus,
    ) {
        return this.maintenanceLogService.findAll({ workCenterId, status });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.maintenanceLogService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.maintenanceLogService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.maintenanceLogService.remove(id);
    }
}
