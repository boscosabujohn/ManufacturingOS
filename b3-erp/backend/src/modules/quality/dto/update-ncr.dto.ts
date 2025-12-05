import { PartialType } from '@nestjs/mapped-types';
import { CreateNCRDto } from './create-ncr.dto';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { NCRStatus } from '../entities/ncr.entity';

export class UpdateNCRDto extends PartialType(CreateNCRDto) {
    @IsEnum(NCRStatus)
    @IsOptional()
    status?: NCRStatus;

    @IsString()
    @IsOptional()
    resolution?: string;

    @IsString()
    @IsOptional()
    containmentAction?: string;

    @IsString()
    @IsOptional()
    rootCause?: string;

    @IsString()
    @IsOptional()
    correctiveAction?: string;

    @IsString()
    @IsOptional()
    preventiveAction?: string;

    @IsDateString()
    @IsOptional()
    closedDate?: string;

    @IsString()
    @IsOptional()
    closedBy?: string;
}
