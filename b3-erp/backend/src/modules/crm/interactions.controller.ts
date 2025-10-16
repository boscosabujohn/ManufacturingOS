import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

@Controller('crm/interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionsService.create(createInteractionDto);
  }

  @Get()
  findAll() {
    return this.interactionsService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.interactionsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInteractionDto: UpdateInteractionDto,
  ) {
    return this.interactionsService.update(id, updateInteractionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.interactionsService.remove(id);
    return { message: 'Interaction deleted successfully' };
  }

  // Automatic page visit logging endpoint
  @Post('log-visit')
  logPageVisit(
    @Body() body: { userId?: string; pageUrl: string; metadata?: Record<string, any> },
  ) {
    return this.interactionsService.logPageVisit(
      body.userId || 'anonymous',
      body.pageUrl,
      body.metadata,
    );
  }
}
