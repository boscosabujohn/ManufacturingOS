import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstimationService } from './estimation.service';
import { CreateBOQDto } from './dto/create-boq.dto';
import { UpdateBOQDto } from './dto/update-boq.dto';

@Controller('estimation')
export class EstimationController {
  constructor(private readonly estimationService: EstimationService) {}

  @Post('boq')
  create(@Body() createBOQDto: CreateBOQDto) {
    return this.estimationService.create(createBOQDto);
  }

  @Get('boq')
  findAll() {
    return this.estimationService.findAll();
  }

  @Get('boq/:id')
  findOne(@Param('id') id: string) {
    return this.estimationService.findOne(id);
  }

  @Get('boq/:id/items')
  findItems(@Param('id') id: string) {
    return this.estimationService.findItemsByBOQId(id);
  }

  @Patch('boq/:id')
  update(@Param('id') id: string, @Body() updateBOQDto: UpdateBOQDto) {
    return this.estimationService.update(id, updateBOQDto);
  }

  @Delete('boq/:id')
  remove(@Param('id') id: string) {
    return this.estimationService.remove(id);
  }
}
