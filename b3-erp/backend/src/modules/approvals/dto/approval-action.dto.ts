import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ApproveRequestDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsOptional()
    comment?: string;
}

export class RejectRequestDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    reason: string;
}
