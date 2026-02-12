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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BonusService } from '../services/bonus.service';
import {
  CreateBonusTypeDto,
  UpdateBonusTypeDto,
  CreateBonusCalculationDto,
  UpdateBonusCalculationDto,
  BonusTypeResponseDto,
  BonusCalculationResponseDto,
} from '../dto/create-bonus.dto';

@ApiTags('HR - Bonus Management')
@Controller('hr/bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  // ============================================================================
  // BONUS TYPES
  // ============================================================================

  @Get('types')
  @ApiOperation({ summary: 'Get all bonus types' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'frequency', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [BonusTypeResponseDto] })
  async findAllTypes(
    @Query('companyId') companyId: string,
    @Query('isActive') isActive?: boolean,
    @Query('frequency') frequency?: string,
    @Query('search') search?: string,
  ) {
    return this.bonusService.findAllBonusTypes(companyId, { isActive, frequency, search });
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get bonus type by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: BonusTypeResponseDto })
  async findTypeById(@Param('id') id: string) {
    return this.bonusService.findBonusTypeById(id);
  }

  @Post('types')
  @ApiOperation({ summary: 'Create bonus type' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BonusTypeResponseDto })
  async createType(@Body() dto: CreateBonusTypeDto) {
    return this.bonusService.createBonusType(dto);
  }

  @Put('types/:id')
  @ApiOperation({ summary: 'Update bonus type' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: BonusTypeResponseDto })
  async updateType(@Param('id') id: string, @Body() dto: UpdateBonusTypeDto) {
    return this.bonusService.updateBonusType(id, dto);
  }

  @Delete('types/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete bonus type' })
  @ApiParam({ name: 'id' })
  async deleteType(@Param('id') id: string) {
    return this.bonusService.deleteBonusType(id);
  }

  // ============================================================================
  // BONUS CALCULATIONS
  // ============================================================================

  @Get('calculations')
  @ApiOperation({ summary: 'Get all bonus calculations' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'bonusTypeId', required: false })
  @ApiQuery({ name: 'financialYear', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: HttpStatus.OK })
  async findAllCalculations(
    @Query('companyId') companyId: string,
    @Query('employeeId') employeeId?: string,
    @Query('bonusTypeId') bonusTypeId?: string,
    @Query('financialYear') financialYear?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bonusService.findAllBonusCalculations(companyId, {
      employeeId,
      bonusTypeId,
      financialYear,
      status,
      page,
      limit,
    });
  }

  @Get('calculations/:id')
  @ApiOperation({ summary: 'Get bonus calculation by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: BonusCalculationResponseDto })
  async findCalculationById(@Param('id') id: string) {
    return this.bonusService.findBonusCalculationById(id);
  }

  @Post('calculations')
  @ApiOperation({ summary: 'Create bonus calculation' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BonusCalculationResponseDto })
  async createCalculation(@Body() dto: CreateBonusCalculationDto) {
    return this.bonusService.createBonusCalculation(dto);
  }

  @Put('calculations/:id')
  @ApiOperation({ summary: 'Update bonus calculation' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: BonusCalculationResponseDto })
  async updateCalculation(@Param('id') id: string, @Body() dto: UpdateBonusCalculationDto) {
    return this.bonusService.updateBonusCalculation(id, dto);
  }

  @Post('calculations/:id/approve')
  @ApiOperation({ summary: 'Approve bonus calculation' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: BonusCalculationResponseDto })
  async approveCalculation(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.bonusService.approveBonusCalculation(id, body.approvedBy);
  }

  @Post('calculations/:id/mark-paid')
  @ApiOperation({ summary: 'Mark bonus as paid' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: BonusCalculationResponseDto })
  async markPaid(@Param('id') id: string) {
    return this.bonusService.markBonusPaid(id);
  }

  @Delete('calculations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete bonus calculation' })
  @ApiParam({ name: 'id' })
  async deleteCalculation(@Param('id') id: string) {
    return this.bonusService.deleteBonusCalculation(id);
  }

  // ============================================================================
  // BONUS REPORTS
  // ============================================================================

  @Get('summary')
  @ApiOperation({ summary: 'Get bonus summary for financial year' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'financialYear', required: true })
  @ApiResponse({ status: HttpStatus.OK })
  async getBonusSummary(
    @Query('companyId') companyId: string,
    @Query('financialYear') financialYear: string,
  ) {
    return this.bonusService.getBonusSummary(companyId, financialYear);
  }
}
