import { IsInt, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PhaseTransitionDto {
    @ApiProperty({ description: 'Target phase number (1-8)', example: 2 })
    @IsInt()
    toPhase: number;

    @ApiProperty({ description: 'User ID triggering the transition' })
    @IsString()
    userId: string;

    @ApiPropertyOptional({ description: 'Force transition ignoring conditions', default: false })
    @IsOptional()
    @IsBoolean()
    forced?: boolean;
}

export class PhaseStatusResponseDto {
    @ApiProperty()
    currentPhase: number;

    @ApiProperty({ required: false })
    currentStep?: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    canTransition: boolean;

    @ApiProperty({ required: false })
    nextPhase?: number;

    @ApiProperty({ required: false, type: 'array' })
    blockingReasons?: any[];
}
