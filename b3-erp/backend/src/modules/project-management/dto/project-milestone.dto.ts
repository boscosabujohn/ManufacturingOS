import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreateProjectMilestoneDto {
    @IsString()
    projectId: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsObject()
    @IsOptional()
    deliverables?: any;
}

export class UpdateProjectMilestoneDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @IsDateString()
    @IsOptional()
    completedDate?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsObject()
    @IsOptional()
    deliverables?: any;
}
