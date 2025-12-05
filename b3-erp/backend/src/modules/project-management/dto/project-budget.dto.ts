import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProjectBudgetDto {
    @IsString()
    projectId: string;

    @IsString()
    category: string;

    @IsNumber()
    @IsOptional()
    budgetAllocated?: number;

    @IsNumber()
    @IsOptional()
    forecastCost?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateProjectBudgetDto {
    @IsString()
    @IsOptional()
    category?: string;

    @IsNumber()
    @IsOptional()
    budgetAllocated?: number;

    @IsNumber()
    @IsOptional()
    budgetSpent?: number;

    @IsNumber()
    @IsOptional()
    forecastCost?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}
