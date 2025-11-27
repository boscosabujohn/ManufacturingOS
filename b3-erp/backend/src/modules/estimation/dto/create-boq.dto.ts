import { IsString, IsNumber, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BOQStatus } from '../entities/boq.entity';

export class CreateBOQItemDto {
    @IsString()
    itemNo: string;

    @IsString()
    description: string;

    @IsString()
    unit: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    unitRate: number;

    @IsString()
    @IsOptional()
    specifications?: string;

    @IsString()
    category: string;
}

export class CreateBOQDto {
    @IsString()
    projectName: string;

    @IsString()
    clientName: string;

    @IsString()
    projectLocation: string;

    @IsString()
    @IsOptional()
    projectDuration?: string;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateBOQItemDto)
    items: CreateBOQItemDto[];

    @IsEnum(BOQStatus)
    @IsOptional()
    status?: BOQStatus;
}
