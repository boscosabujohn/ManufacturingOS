import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateProjectResourceDto {
    @IsString()
    projectId: string;

    @IsString()
    userId: string;

    @IsString()
    @IsOptional()
    role?: string;

    @IsNumber()
    @IsOptional()
    allocationPercentage?: number;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsNumber()
    @IsOptional()
    hourlyRate?: number;
}

export class UpdateProjectResourceDto {
    @IsString()
    @IsOptional()
    role?: string;

    @IsNumber()
    @IsOptional()
    allocationPercentage?: number;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsNumber()
    @IsOptional()
    hourlyRate?: number;
}
