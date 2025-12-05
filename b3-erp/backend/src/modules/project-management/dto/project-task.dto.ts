import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean, IsArray, IsEnum } from 'class-validator';

export class CreateProjectTaskDto {
    @IsString()
    projectId: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsNumber()
    @IsOptional()
    plannedDuration?: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    priority?: string;

    @IsArray()
    @IsOptional()
    assignedTo?: string[];

    @IsString()
    @IsOptional()
    parentTaskId?: string;

    @IsNumber()
    @IsOptional()
    estimatedHours?: number;

    @IsBoolean()
    @IsOptional()
    milestone?: boolean;
}

export class UpdateProjectTaskDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsNumber()
    @IsOptional()
    actualDuration?: number;

    @IsNumber()
    @IsOptional()
    progress?: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    priority?: string;

    @IsArray()
    @IsOptional()
    assignedTo?: string[];

    @IsNumber()
    @IsOptional()
    actualHours?: number;
}
