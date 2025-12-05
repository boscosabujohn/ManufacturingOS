import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

import { ApprovalPriority } from '../entities';

export class CreateApprovalRequestDto {
    @IsString()
    @IsNotEmpty()
    entityType: string; // 'purchase_order', 'expense', etc.

    @IsString()
    @IsNotEmpty()
    entityId: string; // ID of the entity (PO ID, Expense ID, etc.)

    @IsString()
    @IsNotEmpty()
    referenceNumber: string; // PO-2025-001

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    requestedBy: string; // User ID

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsEnum(ApprovalPriority)
    @IsOptional()
    priority?: ApprovalPriority;
}
