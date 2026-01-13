import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContentService, ContentFilters, PaginationParams } from '../services/content.service';
import { CreateContentDto } from '../dto/create-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';
import { Content, ContentType, ContentStatus } from '../entities/content.entity';

@ApiTags('CMS')
@Controller('cms/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all content with filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated content list' })
  async findAll(
    @Query('search') search?: string,
    @Query('type') type?: ContentType,
    @Query('status') status?: ContentStatus,
    @Query('authorId') authorId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters: ContentFilters = { search, type, status, authorId, categoryId };
    const pagination: PaginationParams = { page, limit, sortBy, sortOrder };
    return this.contentService.findAll(filters, pagination);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get published content' })
  async findPublished(
    @Query('type') type?: ContentType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.contentService.findPublished(type, { page, limit });
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get content by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.contentService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  async findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related content' })
  async getRelated(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return this.contentService.getRelated(id, limit);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  async create(@Body() createDto: CreateContentDto) {
    return this.contentService.create(createDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateContentDto) {
    return this.contentService.update(id, updateDto);
  }

  @Patch(':id/publish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish content' })
  async publish(@Param('id') id: string) {
    return this.contentService.publish(id);
  }

  @Patch(':id/unpublish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish content' })
  async unpublish(@Param('id') id: string) {
    return this.contentService.unpublish(id);
  }

  @Patch(':id/archive')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive content' })
  async archive(@Param('id') id: string) {
    return this.contentService.archive(id);
  }

  @Patch(':id/schedule')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule content for publishing' })
  async schedule(
    @Param('id') id: string,
    @Body('scheduledAt') scheduledAt: Date,
  ) {
    return this.contentService.schedule(id, scheduledAt);
  }

  @Patch(':id/share')
  @ApiOperation({ summary: 'Increment share count' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async incrementShare(@Param('id') id: string) {
    await this.contentService.incrementShareCount(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.contentService.remove(id);
  }
}
