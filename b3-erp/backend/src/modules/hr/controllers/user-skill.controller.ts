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
import { UserSkillService } from '../services/user-skill.service';
import {
  CreateUserSkillDto,
  UpdateUserSkillDto,
  UserSkillResponseDto,
} from '../dto';

@ApiTags('HR - User Skills')
@Controller('hr/user-skills')
export class UserSkillController {
  constructor(private readonly service: UserSkillService) {}

  @Post()
  @ApiOperation({ summary: 'Assign a skill to an employee' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill assigned successfully',
    type: UserSkillResponseDto,
  })
  async create(@Body() createDto: CreateUserSkillDto): Promise<UserSkillResponseDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user skills' })
  @ApiQuery({ name: 'employeeId', required: false, description: 'Filter by employee ID' })
  @ApiQuery({ name: 'skillId', required: false, description: 'Filter by skill ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'isEnabled', required: false, description: 'Filter by enabled status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user skills',
    type: [UserSkillResponseDto],
  })
  async findAll(
    @Query('employeeId') employeeId?: string,
    @Query('skillId') skillId?: string,
    @Query('status') status?: string,
    @Query('isEnabled') isEnabled?: string,
  ): Promise<UserSkillResponseDto[]> {
    return this.service.findAll({
      employeeId,
      skillId,
      status,
      isEnabled: isEnabled !== undefined ? isEnabled === 'true' : undefined,
    });
  }

  @Get('matrix')
  @ApiOperation({ summary: 'Get skill matrix' })
  @ApiQuery({ name: 'departmentId', required: false, description: 'Filter by department ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill matrix data',
  })
  async getSkillMatrix(@Query('departmentId') departmentId?: string): Promise<any[]> {
    return this.service.getSkillMatrix(departmentId);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get all skills for an employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of employee skills',
    type: [UserSkillResponseDto],
  })
  async findByEmployeeId(
    @Param('employeeId') employeeId: string,
  ): Promise<UserSkillResponseDto[]> {
    return this.service.findByEmployeeId(employeeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user skill by ID' })
  @ApiParam({ name: 'id', description: 'User skill ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User skill details',
    type: UserSkillResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User skill not found' })
  async findOne(@Param('id') id: string): Promise<UserSkillResponseDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user skill' })
  @ApiParam({ name: 'id', description: 'User skill ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User skill updated successfully',
    type: UserSkillResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserSkillDto,
  ): Promise<UserSkillResponseDto> {
    return this.service.update(id, updateDto);
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify a user skill' })
  @ApiParam({ name: 'id', description: 'User skill ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User skill verified successfully',
    type: UserSkillResponseDto,
  })
  async verifySkill(
    @Param('id') id: string,
    @Body() body: { verifiedById: string; verifiedByName: string; notes?: string },
  ): Promise<UserSkillResponseDto> {
    return this.service.verifySkill(
      id,
      body.verifiedById,
      body.verifiedByName,
      body.notes,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove user skill' })
  @ApiParam({ name: 'id', description: 'User skill ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User skill removed successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Delete('employee/:employeeId/skill/:skillId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove skill from employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiParam({ name: 'skillId', description: 'Skill ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Skill removed from employee successfully',
  })
  async removeByEmployeeAndSkill(
    @Param('employeeId') employeeId: string,
    @Param('skillId') skillId: string,
  ): Promise<void> {
    return this.service.removeByEmployeeAndSkill(employeeId, skillId);
  }
}
