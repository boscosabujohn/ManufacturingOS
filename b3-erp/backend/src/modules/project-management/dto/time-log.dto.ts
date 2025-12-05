import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateTimeLogDto {
    @IsString()
    projectId: string;

    @IsString()
    @IsOptional()
    taskId?: string;

    @IsString()
    userId: string;

    @IsDateString()
    date: string;

    @IsNumber()
    hours: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    billable?: boolean;
}

export class UpdateTimeLogDto {
    @IsString()
    @IsOptional()
    taskId?: string;

    @IsDateString()
    @IsOptional()
    date?: string;

    @IsNumber()
    @IsOptional()
    hours?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    billable?: boolean;
}
