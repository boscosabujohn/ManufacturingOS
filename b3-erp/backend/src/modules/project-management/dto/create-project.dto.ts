import { IsString, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ProjectStatus, ProjectPriority } from '../../project/entities/project.entity';

export class CreateProjectDto {
    @IsString()
    projectName: string;

    @IsString()
    projectType: string;

    @IsString()
    customer: string;

    @IsString()
    location: string;

    @IsString()
    @IsOptional()
    salesOrderNumber?: string;

    @IsString()
    @IsOptional()
    projectManager?: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @IsNumber()
    @IsOptional()
    budget?: number;

    @IsEnum(ProjectPriority)
    @IsOptional()
    priority?: ProjectPriority;
}
