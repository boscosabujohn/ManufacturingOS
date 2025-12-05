import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TimeLogsService } from '../services/time-logs.service';
import { CreateTimeLogDto, UpdateTimeLogDto } from '../dto/time-log.dto';

@Controller('time-logs')
export class TimeLogsController {
    constructor(private readonly timeLogsService: TimeLogsService) { }

    @Post()
    create(@Body() createTimeLogDto: CreateTimeLogDto) {
        return this.timeLogsService.create(createTimeLogDto);
    }

    @Get()
    findAll(@Query('projectId') projectId: string, @Query('userId') userId?: string) {
        return this.timeLogsService.findAll(projectId, userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.timeLogsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTimeLogDto: UpdateTimeLogDto) {
        return this.timeLogsService.update(id, updateTimeLogDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.timeLogsService.remove(id);
    }
}
