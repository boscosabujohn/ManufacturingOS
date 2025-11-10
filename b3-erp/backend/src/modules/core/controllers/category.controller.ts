import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiTags('Categories')
@Controller('api/v1/core/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully',
    type: [CategoryResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryType', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'parentCategoryId', required: false, type: String })
  @ApiQuery({ name: 'level', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryType') categoryType?: string,
    @Query('isActive') isActive?: boolean,
    @Query('parentCategoryId') parentCategoryId?: string,
    @Query('level') level?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters = {
      search,
      categoryType,
      isActive,
      parentCategoryId,
      level: level ? Number(level) : undefined,
    };

    const pagination = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
    };

    return this.categoryService.findAll(filters, pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category code already exists' })
  @ApiResponse({
    status: 400,
    description: 'Cannot set a descendant category as parent',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete category with children',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryService.remove(id);
  }

  @Get('hierarchy/tree')
  @ApiOperation({ summary: 'Get category hierarchy tree' })
  @ApiQuery({ name: 'categoryType', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Category hierarchy retrieved successfully',
    type: [CategoryResponseDto],
  })
  async getHierarchy(
    @Query('categoryType') categoryType?: string,
  ): Promise<CategoryResponseDto[]> {
    return this.categoryService.getHierarchy(categoryType);
  }

  @Get('parent/:parentId/children')
  @ApiOperation({ summary: 'Get child categories by parent ID' })
  @ApiParam({ name: 'parentId', type: String, description: 'Parent Category UUID' })
  @ApiResponse({
    status: 200,
    description: 'Child categories retrieved successfully',
    type: [CategoryResponseDto],
  })
  async getChildren(
    @Param('parentId', ParseUUIDPipe) parentId: string,
  ): Promise<CategoryResponseDto[]> {
    return this.categoryService.getChildren(parentId);
  }

  @Get('filter/root')
  @ApiOperation({ summary: 'Get root categories' })
  @ApiQuery({ name: 'categoryType', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Root categories retrieved successfully',
    type: [CategoryResponseDto],
  })
  async getRootCategories(
    @Query('categoryType') categoryType?: string,
  ): Promise<CategoryResponseDto[]> {
    return this.categoryService.getRootCategories(categoryType);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle category active status' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiResponse({
    status: 200,
    description: 'Category active status toggled successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.toggleActive(id);
  }

  @Patch(':id/sort-order')
  @ApiOperation({ summary: 'Update category sort order' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiResponse({
    status: 200,
    description: 'Category sort order updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async updateSortOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('sortOrder') sortOrder: number,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.updateSortOrder(id, sortOrder);
  }
}
