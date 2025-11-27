import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsNumber()
    @IsOptional()
    progress?: number;

    @IsNumber()
    @IsOptional()
    actualCost?: number;

    @IsString()
    @IsOptional()
    phase?: string;
}
