import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssetManagementService {
    private readonly logger = new Logger(AssetManagementService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Asset Category
    // ============================================================================

    async createAssetCategory(data: {
        categoryCode: string;
        categoryName: string;
        categoryType: string;
        description?: string;
        parentCategoryId?: string;
        depreciationMethod?: string;
        depreciationRate?: number;
        usefulLifeYears?: number;
        companyId: string;
    }) {
        return this.prisma.assetCategory.create({
            data: {
                ...data,
                depreciationRate: data.depreciationRate ? new Prisma.Decimal(data.depreciationRate) : null,
            },
        });
    }

    async getAssetCategories(companyId: string, categoryType?: string) {
        return this.prisma.assetCategory.findMany({
            where: {
                companyId,
                isActive: true,
                ...(categoryType && { categoryType }),
            },
            include: {
                childCategories: true,
                _count: { select: { assets: true } },
            },
            orderBy: { categoryName: 'asc' },
        });
    }

    // ============================================================================
    // Asset
    // ============================================================================

    async createAsset(data: {
        assetName: string;
        assetTag?: string;
        serialNumber?: string;
        categoryId: string;
        brand?: string;
        model?: string;
        specifications?: any;
        description?: string;
        purchaseDate?: Date;
        purchasePrice?: number;
        vendorId?: string;
        vendorName?: string;
        invoiceNumber?: string;
        warrantyEndDate?: Date;
        location?: string;
        registrationNumber?: string;
        fuelType?: string;
        engineNumber?: string;
        chassisNumber?: string;
        companyId: string;
    }) {
        const count = await this.prisma.asset.count({
            where: { companyId: data.companyId },
        });
        const assetCode = `AST-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.asset.create({
            data: {
                assetCode,
                ...data,
                purchasePrice: data.purchasePrice ? new Prisma.Decimal(data.purchasePrice) : null,
                currentValue: data.purchasePrice ? new Prisma.Decimal(data.purchasePrice) : null,
            },
        });
    }

    async getAssets(companyId: string, options?: {
        categoryId?: string;
        categoryType?: string;
        status?: string;
        location?: string;
        employeeId?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.AssetWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.categoryId) where.categoryId = options.categoryId;
        if (options?.status) where.status = options.status;
        if (options?.location) where.location = options.location;
        if (options?.employeeId) where.currentEmployeeId = options.employeeId;
        if (options?.categoryType) {
            where.category = { categoryType: options.categoryType };
        }

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                include: {
                    category: true,
                    allocations: { where: { status: 'active' }, take: 1 },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.asset.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getAssetById(id: string) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                category: true,
                allocations: { orderBy: { allocatedDate: 'desc' }, take: 10 },
                maintenanceRecords: { orderBy: { reportedDate: 'desc' }, take: 10 },
                transfers: { orderBy: { transferDate: 'desc' }, take: 10 },
            },
        });
        if (!asset) {
            throw new NotFoundException(`Asset ${id} not found`);
        }
        return asset;
    }

    async updateAsset(id: string, data: Partial<{
        assetName: string;
        assetTag: string;
        serialNumber: string;
        status: string;
        condition: string;
        location: string;
        currentValue: number;
    }>) {
        const updateData: Prisma.AssetUpdateInput = { ...data };
        if (data.currentValue !== undefined) {
            updateData.currentValue = new Prisma.Decimal(data.currentValue);
        }
        return this.prisma.asset.update({
            where: { id },
            data: updateData,
        });
    }

    // ============================================================================
    // Asset Allocation
    // ============================================================================

    async allocateAsset(data: {
        assetId: string;
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        department?: string;
        allocationType?: string;
        allocatedDate: Date;
        expectedReturnDate?: Date;
        requestedBy?: string;
        approvedBy?: string;
        remarks?: string;
        companyId: string;
    }) {
        const count = await this.prisma.assetAllocation.count({
            where: { companyId: data.companyId },
        });
        const allocationNumber = `ALN-${String(count + 1).padStart(6, '0')}`;

        // Update asset status
        await this.prisma.asset.update({
            where: { id: data.assetId },
            data: {
                status: 'allocated',
                currentEmployeeId: data.employeeId,
                currentEmployeeName: data.employeeName,
                currentDepartment: data.department,
                allocatedDate: data.allocatedDate,
            },
        });

        return this.prisma.assetAllocation.create({
            data: {
                allocationNumber,
                ...data,
                approvedAt: data.approvedBy ? new Date() : null,
            },
        });
    }

    async getAssetAllocations(companyId: string, options?: {
        assetId?: string;
        employeeId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.AssetAllocationWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.assetId) where.assetId = options.assetId;
        if (options?.employeeId) where.employeeId = options.employeeId;
        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.assetAllocation.findMany({
                where,
                include: { asset: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { allocatedDate: 'desc' },
            }),
            this.prisma.assetAllocation.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async returnAsset(allocationId: string, data: {
        returnedBy: string;
        condition: string;
        remarks?: string;
    }) {
        const allocation = await this.prisma.assetAllocation.findUnique({
            where: { id: allocationId },
        });
        if (!allocation) {
            throw new NotFoundException(`Allocation ${allocationId} not found`);
        }

        await this.prisma.asset.update({
            where: { id: allocation.assetId },
            data: {
                status: 'available',
                condition: data.condition,
                currentEmployeeId: null,
                currentEmployeeName: null,
                currentDepartment: null,
                allocatedDate: null,
            },
        });

        return this.prisma.assetAllocation.update({
            where: { id: allocationId },
            data: {
                status: 'returned',
                actualReturnDate: new Date(),
                returnedBy: data.returnedBy,
                condition: data.condition,
                remarks: data.remarks,
            },
        });
    }

    // ============================================================================
    // Asset Request
    // ============================================================================

    async createAssetRequest(data: {
        assetId?: string;
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        department?: string;
        requestType?: string;
        assetCategory: string;
        assetType?: string;
        priority?: string;
        justification?: string;
        specifications?: any;
        requiredByDate?: Date;
        companyId: string;
    }) {
        const count = await this.prisma.assetRequest.count({
            where: { companyId: data.companyId },
        });
        const requestNumber = `REQ-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.assetRequest.create({
            data: {
                requestNumber,
                ...data,
            },
        });
    }

    async getAssetRequests(companyId: string, options?: {
        employeeId?: string;
        status?: string;
        assetCategory?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.AssetRequestWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.employeeId) where.employeeId = options.employeeId;
        if (options?.status) where.status = options.status;
        if (options?.assetCategory) where.assetCategory = options.assetCategory;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.assetRequest.findMany({
                where,
                include: { asset: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { requestDate: 'desc' },
            }),
            this.prisma.assetRequest.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async approveAssetRequest(id: string, data: {
        approvedBy: string;
        assetId?: string;
    }) {
        return this.prisma.assetRequest.update({
            where: { id },
            data: {
                status: 'approved',
                currentApprover: data.approvedBy,
                assetId: data.assetId,
                approvalHistory: {
                    push: {
                        approver: data.approvedBy,
                        action: 'approved',
                        date: new Date().toISOString(),
                    },
                },
            },
        });
    }

    async rejectAssetRequest(id: string, data: {
        rejectedBy: string;
        reason: string;
    }) {
        return this.prisma.assetRequest.update({
            where: { id },
            data: {
                status: 'rejected',
                currentApprover: data.rejectedBy,
                rejectionReason: data.reason,
                approvalHistory: {
                    push: {
                        approver: data.rejectedBy,
                        action: 'rejected',
                        reason: data.reason,
                        date: new Date().toISOString(),
                    },
                },
            },
        });
    }

    // ============================================================================
    // Asset Transfer
    // ============================================================================

    async transferAsset(data: {
        assetId: string;
        fromEmployeeId: string;
        fromEmployeeName: string;
        fromDepartment?: string;
        fromLocation?: string;
        toEmployeeId: string;
        toEmployeeName: string;
        toDepartment?: string;
        toLocation?: string;
        transferType?: string;
        transferReason?: string;
        transferDate: Date;
        effectiveDate: Date;
        initiatedBy: string;
        companyId: string;
    }) {
        const count = await this.prisma.assetTransfer.count({
            where: { companyId: data.companyId },
        });
        const transferNumber = `TRF-${String(count + 1).padStart(6, '0')}`;

        const asset = await this.prisma.asset.findUnique({ where: { id: data.assetId } });

        return this.prisma.assetTransfer.create({
            data: {
                transferNumber,
                ...data,
                conditionBefore: asset?.condition,
            },
        });
    }

    async getAssetTransfers(companyId: string, options?: {
        assetId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.AssetTransferWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.assetId) where.assetId = options.assetId;
        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.assetTransfer.findMany({
                where,
                include: { asset: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { transferDate: 'desc' },
            }),
            this.prisma.assetTransfer.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async completeTransfer(id: string, data: {
        completedBy: string;
        conditionAfter?: string;
    }) {
        const transfer = await this.prisma.assetTransfer.findUnique({
            where: { id },
        });
        if (!transfer) {
            throw new NotFoundException(`Transfer ${id} not found`);
        }

        await this.prisma.asset.update({
            where: { id: transfer.assetId },
            data: {
                currentEmployeeId: transfer.toEmployeeId,
                currentEmployeeName: transfer.toEmployeeName,
                currentDepartment: transfer.toDepartment,
                location: transfer.toLocation,
                condition: data.conditionAfter,
            },
        });

        return this.prisma.assetTransfer.update({
            where: { id },
            data: {
                status: 'completed',
                completedBy: data.completedBy,
                completedAt: new Date(),
                conditionAfter: data.conditionAfter,
                receiverAcknowledged: true,
                acknowledgedAt: new Date(),
            },
        });
    }

    // ============================================================================
    // Maintenance Requests
    // ============================================================================

    async createMaintenanceRequest(data: {
        assetId: string;
        requestType: string;
        priority?: string;
        issueDescription: string;
        issueCategory?: string;
        reportedBy: string;
        reportedByName: string;
        expectedCompletionDate?: Date;
        companyId: string;
    }) {
        const count = await this.prisma.maintenanceRequest.count({
            where: { companyId: data.companyId },
        });
        const requestNumber = `MNT-${String(count + 1).padStart(6, '0')}`;

        if (data.requestType === 'breakdown' || data.requestType === 'repair') {
            await this.prisma.asset.update({
                where: { id: data.assetId },
                data: { status: 'maintenance' },
            });
        }

        return this.prisma.maintenanceRequest.create({
            data: {
                requestNumber,
                ...data,
            },
        });
    }

    async getMaintenanceRequests(companyId: string, options?: {
        assetId?: string;
        requestType?: string;
        status?: string;
        priority?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.MaintenanceRequestWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.assetId) where.assetId = options.assetId;
        if (options?.requestType) where.requestType = options.requestType;
        if (options?.status) where.status = options.status;
        if (options?.priority) where.priority = options.priority;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.maintenanceRequest.findMany({
                where,
                include: { asset: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { reportedDate: 'desc' },
            }),
            this.prisma.maintenanceRequest.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async updateMaintenanceRequest(id: string, data: Partial<{
        status: string;
        assignedTo: string;
        assignedToName: string;
        diagnosisNotes: string;
        workPerformed: string;
        partsReplaced: any;
        laborCost: number;
        partsCost: number;
        resolutionNotes: string;
        rootCause: string;
    }>) {
        const updateData: Prisma.MaintenanceRequestUpdateInput = {};

        if (data.status) updateData.status = data.status;
        if (data.assignedTo) {
            updateData.assignedTo = data.assignedTo;
            updateData.assignedToName = data.assignedToName;
            updateData.assignedAt = new Date();
        }
        if (data.diagnosisNotes) updateData.diagnosisNotes = data.diagnosisNotes;
        if (data.workPerformed) updateData.workPerformed = data.workPerformed;
        if (data.partsReplaced) updateData.partsReplaced = data.partsReplaced;
        if (data.laborCost !== undefined) updateData.laborCost = new Prisma.Decimal(data.laborCost);
        if (data.partsCost !== undefined) updateData.partsCost = new Prisma.Decimal(data.partsCost);
        if (data.laborCost !== undefined && data.partsCost !== undefined) {
            updateData.totalCost = new Prisma.Decimal(data.laborCost + data.partsCost);
        }
        if (data.resolutionNotes) updateData.resolutionNotes = data.resolutionNotes;
        if (data.rootCause) updateData.rootCause = data.rootCause;

        if (data.status === 'completed') {
            updateData.actualCompletionDate = new Date();
        }

        return this.prisma.maintenanceRequest.update({
            where: { id },
            data: updateData,
        });
    }

    async completeMaintenanceRequest(id: string, data: {
        workPerformed: string;
        resolutionNotes?: string;
        totalCost?: number;
    }) {
        const request = await this.prisma.maintenanceRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new NotFoundException(`Maintenance request ${id} not found`);
        }

        await this.prisma.asset.update({
            where: { id: request.assetId },
            data: { status: 'available' },
        });

        return this.prisma.maintenanceRequest.update({
            where: { id },
            data: {
                status: 'completed',
                actualCompletionDate: new Date(),
                workPerformed: data.workPerformed,
                resolutionNotes: data.resolutionNotes,
                totalCost: data.totalCost ? new Prisma.Decimal(data.totalCost) : null,
            },
        });
    }

    // ============================================================================
    // Preventive Maintenance
    // ============================================================================

    async createPreventiveMaintenanceSchedule(data: {
        scheduleName: string;
        assetCategoryId?: string;
        assetType?: string;
        frequency: string;
        intervalDays?: number;
        nextMaintenanceDate: Date;
        maintenanceChecklist?: any;
        estimatedDuration?: number;
        estimatedCost?: number;
        defaultAssignee?: string;
        vendorId?: string;
        vendorName?: string;
        reminderDaysBefore?: number;
        notifyEmails?: string[];
        companyId: string;
    }) {
        const count = await this.prisma.preventiveMaintenance.count({
            where: { companyId: data.companyId },
        });
        const scheduleCode = `PM-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.preventiveMaintenance.create({
            data: {
                scheduleCode,
                ...data,
                estimatedCost: data.estimatedCost ? new Prisma.Decimal(data.estimatedCost) : null,
            },
        });
    }

    async getPreventiveMaintenanceSchedules(companyId: string) {
        return this.prisma.preventiveMaintenance.findMany({
            where: { companyId, isActive: true },
            orderBy: { nextMaintenanceDate: 'asc' },
        });
    }

    // ============================================================================
    // AMC Contracts
    // ============================================================================

    async createAMCContract(data: {
        contractName: string;
        vendorId?: string;
        vendorName: string;
        vendorContact?: string;
        vendorEmail?: string;
        vendorPhone?: string;
        contractType: string;
        startDate: Date;
        endDate: Date;
        autoRenewal?: boolean;
        coveredAssets?: any;
        coverageDetails?: string;
        exclusions?: string;
        contractValue: number;
        paymentTerms?: string;
        responseTimeSLA?: number;
        resolutionTimeSLA?: number;
        uptime?: number;
        contractDocument?: string;
        companyId: string;
    }) {
        const count = await this.prisma.aMCContract.count({
            where: { companyId: data.companyId },
        });
        const contractNumber = `AMC-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.aMCContract.create({
            data: {
                contractNumber,
                ...data,
                contractValue: new Prisma.Decimal(data.contractValue),
                uptime: data.uptime ? new Prisma.Decimal(data.uptime) : null,
            },
        });
    }

    async getAMCContracts(companyId: string, options?: {
        status?: string;
        expiringWithinDays?: number;
    }) {
        const where: Prisma.AMCContractWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;
        if (options?.expiringWithinDays) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + options.expiringWithinDays);
            where.endDate = { lte: expiryDate };
            where.status = 'active';
        }

        return this.prisma.aMCContract.findMany({
            where,
            orderBy: { endDate: 'asc' },
        });
    }

    // ============================================================================
    // Asset Stock
    // ============================================================================

    async createAssetStock(data: {
        assetCategoryId: string;
        assetType: string;
        location?: string;
        totalQuantity?: number;
        minStockLevel?: number;
        maxStockLevel?: number;
        reorderLevel?: number;
        reorderQuantity?: number;
        companyId: string;
    }) {
        const count = await this.prisma.assetStock.count({
            where: { companyId: data.companyId },
        });
        const stockCode = `STK-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.assetStock.create({
            data: {
                stockCode,
                ...data,
                availableQuantity: data.totalQuantity || 0,
            },
        });
    }

    async getAssetStock(companyId: string, options?: {
        assetCategoryId?: string;
        location?: string;
        lowStock?: boolean;
    }) {
        const where: Prisma.AssetStockWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.assetCategoryId) where.assetCategoryId = options.assetCategoryId;
        if (options?.location) where.location = options.location;
        if (options?.lowStock) {
            where.availableQuantity = { lte: this.prisma.assetStock.fields.reorderLevel };
        }

        return this.prisma.assetStock.findMany({
            where,
            orderBy: { assetType: 'asc' },
        });
    }

    async updateStockQuantity(stockId: string, data: {
        movementType: string;
        quantity: number;
        reason?: string;
        referenceType?: string;
        referenceId?: string;
        referenceNumber?: string;
        performedBy: string;
        performedByName: string;
        companyId: string;
    }) {
        const stock = await this.prisma.assetStock.findUnique({ where: { id: stockId } });
        if (!stock) {
            throw new NotFoundException(`Stock ${stockId} not found`);
        }

        const count = await this.prisma.assetStockMovement.count({
            where: { companyId: data.companyId },
        });
        const movementNumber = `MOV-${String(count + 1).padStart(6, '0')}`;

        const newQuantity = data.movementType === 'stock_in'
            ? stock.totalQuantity + data.quantity
            : stock.totalQuantity - data.quantity;

        const newAvailable = data.movementType === 'stock_in'
            ? stock.availableQuantity + data.quantity
            : stock.availableQuantity - data.quantity;

        await this.prisma.assetStock.update({
            where: { id: stockId },
            data: {
                totalQuantity: newQuantity,
                availableQuantity: newAvailable,
                lastStockInDate: data.movementType === 'stock_in' ? new Date() : undefined,
                lastStockOutDate: data.movementType === 'stock_out' ? new Date() : undefined,
            },
        });

        return this.prisma.assetStockMovement.create({
            data: {
                movementNumber,
                stockId,
                ...data,
            },
        });
    }

    // ============================================================================
    // Stock Request
    // ============================================================================

    async createStockRequest(data: {
        stockId: string;
        employeeId: string;
        employeeName: string;
        department?: string;
        requestedQuantity: number;
        purpose?: string;
        requiredByDate?: Date;
        companyId: string;
    }) {
        const count = await this.prisma.stockRequest.count({
            where: { companyId: data.companyId },
        });
        const requestNumber = `SREQ-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.stockRequest.create({
            data: {
                requestNumber,
                ...data,
            },
        });
    }

    async getStockRequests(companyId: string, options?: {
        stockId?: string;
        employeeId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.StockRequestWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.stockId) where.stockId = options.stockId;
        if (options?.employeeId) where.employeeId = options.employeeId;
        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.stockRequest.findMany({
                where,
                include: { stock: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.stockRequest.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async fulfillStockRequest(id: string, data: {
        allocatedQuantity: number;
        fulfilledBy: string;
    }) {
        const request = await this.prisma.stockRequest.findUnique({ where: { id } });
        if (!request) {
            throw new NotFoundException(`Stock request ${id} not found`);
        }

        const status = data.allocatedQuantity >= request.requestedQuantity
            ? 'fulfilled'
            : 'partially_fulfilled';

        return this.prisma.stockRequest.update({
            where: { id },
            data: {
                allocatedQuantity: data.allocatedQuantity,
                status,
                fulfilledBy: data.fulfilledBy,
                fulfilledAt: new Date(),
            },
        });
    }

    // ============================================================================
    // Stock Audit
    // ============================================================================

    async createStockAudit(data: {
        auditName: string;
        auditType?: string;
        auditDate: Date;
        startDate: Date;
        endDate?: Date;
        locationsCovered?: string[];
        categoriesCovered?: string[];
        auditLeadId?: string;
        auditLeadName?: string;
        auditTeam?: any;
        companyId: string;
    }) {
        const count = await this.prisma.stockAudit.count({
            where: { companyId: data.companyId },
        });
        const auditNumber = `AUD-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.stockAudit.create({
            data: {
                auditNumber,
                ...data,
            },
        });
    }

    async getStockAudits(companyId: string, options?: {
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.StockAuditWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.stockAudit.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { auditDate: 'desc' },
            }),
            this.prisma.stockAudit.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async updateStockAudit(id: string, data: Partial<{
        status: string;
        totalItems: number;
        itemsAudited: number;
        matchedItems: number;
        discrepancies: number;
        auditFindings: any;
        discrepancyReport: any;
        correctiveActions: string;
        actionsTaken: string;
        completedBy: string;
        approvedBy: string;
    }>) {
        const updateData: Prisma.StockAuditUpdateInput = { ...data };

        if (data.status === 'completed') {
            updateData.completedAt = new Date();
        }
        if (data.approvedBy) {
            updateData.approvedAt = new Date();
        }

        return this.prisma.stockAudit.update({
            where: { id },
            data: updateData,
        });
    }

    // ============================================================================
    // Dashboard & Reports
    // ============================================================================

    async getAssetManagementDashboard(companyId: string) {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const [
            totalAssets,
            assetsByStatus,
            assetsByCategory,
            pendingRequests,
            pendingMaintenance,
            expiringWarranties,
            expiringAMCs,
            recentAllocations,
        ] = await Promise.all([
            this.prisma.asset.count({ where: { companyId, isActive: true } }),
            this.prisma.asset.groupBy({
                by: ['status'],
                where: { companyId, isActive: true },
                _count: { id: true },
            }),
            this.prisma.asset.groupBy({
                by: ['categoryId'],
                where: { companyId, isActive: true },
                _count: { id: true },
            }),
            this.prisma.assetRequest.count({
                where: { companyId, isActive: true, status: 'pending' },
            }),
            this.prisma.maintenanceRequest.count({
                where: { companyId, isActive: true, status: { in: ['open', 'assigned', 'in_progress'] } },
            }),
            this.prisma.asset.count({
                where: {
                    companyId,
                    isActive: true,
                    warrantyEndDate: { lte: thirtyDaysFromNow, gte: today },
                },
            }),
            this.prisma.aMCContract.count({
                where: {
                    companyId,
                    isActive: true,
                    status: 'active',
                    endDate: { lte: thirtyDaysFromNow, gte: today },
                },
            }),
            this.prisma.assetAllocation.findMany({
                where: { companyId, isActive: true },
                include: { asset: true },
                orderBy: { allocatedDate: 'desc' },
                take: 5,
            }),
        ]);

        return {
            totalAssets,
            assetsByStatus: assetsByStatus.reduce((acc, item) => {
                acc[item.status] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
            assetsByCategory,
            pendingRequests,
            pendingMaintenance,
            expiringWarranties,
            expiringAMCs,
            recentAllocations,
        };
    }

    async getAssetRegister(companyId: string, options?: {
        categoryId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        return this.getAssets(companyId, options);
    }

    async getEmployeeAssets(companyId: string, employeeId: string) {
        return this.prisma.assetAllocation.findMany({
            where: {
                companyId,
                employeeId,
                status: 'active',
                isActive: true,
            },
            include: { asset: true },
            orderBy: { allocatedDate: 'desc' },
        });
    }

    async getDepartmentAssets(companyId: string, department: string) {
        return this.prisma.asset.findMany({
            where: {
                companyId,
                currentDepartment: department,
                status: 'allocated',
                isActive: true,
            },
            include: { category: true },
            orderBy: { assetName: 'asc' },
        });
    }

    async getMaintenanceCostReport(companyId: string, options?: {
        fromDate?: Date;
        toDate?: Date;
        categoryId?: string;
    }) {
        const where: Prisma.MaintenanceRequestWhereInput = {
            companyId,
            isActive: true,
            status: 'completed',
        };

        if (options?.fromDate || options?.toDate) {
            where.actualCompletionDate = {};
            if (options.fromDate) where.actualCompletionDate.gte = options.fromDate;
            if (options.toDate) where.actualCompletionDate.lte = options.toDate;
        }
        if (options?.categoryId) {
            where.asset = { categoryId: options.categoryId };
        }

        const maintenanceRecords = await this.prisma.maintenanceRequest.findMany({
            where,
            include: { asset: { include: { category: true } } },
            orderBy: { actualCompletionDate: 'desc' },
        });

        const totalCost = maintenanceRecords.reduce((sum, record) => {
            return sum + (record.totalCost?.toNumber() || 0);
        }, 0);

        const byCategory = maintenanceRecords.reduce((acc, record) => {
            const categoryName = record.asset.category.categoryName;
            if (!acc[categoryName]) acc[categoryName] = 0;
            acc[categoryName] += record.totalCost?.toNumber() || 0;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalCost,
            byCategory,
            records: maintenanceRecords,
        };
    }
}
