import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryReservation, ReservationStatus } from '../entities/inventory-reservation.entity';
import { PurchaseRequisition, PRStatus } from '../entities/purchase-requisition.entity';
import { GRN, GRNStatus } from '../entities/grn.entity';
import { BOMHeader, BOMStatus } from '../entities/bom-header.entity';
import { BOMDetail } from '../entities/bom-detail.entity';
import { Item } from '../../core/entities/item.entity';

@Injectable()
export class ProcurementService {
    constructor(
        @InjectRepository(InventoryReservation)
        private reservationRepository: Repository<InventoryReservation>,
        @InjectRepository(PurchaseRequisition)
        private prRepository: Repository<PurchaseRequisition>,
        @InjectRepository(GRN)
        private grnRepository: Repository<GRN>,
        @InjectRepository(BOMHeader)
        private bomHeaderRepository: Repository<BOMHeader>,
        @InjectRepository(BOMDetail)
        private bomDetailRepository: Repository<BOMDetail>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) { }

    // --- Stock Reservation ---

    async reserveBOMItems(projectId: string, bomHeaderId: string): Promise<number> {
        const bomDetails = await this.bomDetailRepository.find({ where: { headerId: bomHeaderId }, relations: ['item'] });
        let reservedCount = 0;

        for (const detail of bomDetails) {
            // Simulated stock check: Reserve if item quantity in stock > requested
            // In a real system, we'd check item.currentStock
            if (detail.item.name.includes('Steel')) { // Mock logic
                const reservation = this.reservationRepository.create({
                    projectId,
                    bomDetailId: detail.id,
                    itemId: detail.itemId,
                    quantityReserved: detail.quantity,
                    status: ReservationStatus.PENDING,
                });
                await this.reservationRepository.save(reservation);
                reservedCount++;
            }
        }
        return reservedCount;
    }

    // --- Purchase Requisition (PR) ---

    async generatePRFromBOM(projectId: string, bomHeaderId: string, requestedBy: string): Promise<PurchaseRequisition> {
        const bomHeader = await this.bomHeaderRepository.findOne({ where: { id: bomHeaderId } });
        if (!bomHeader || bomHeader.status !== BOMStatus.RELEASED) {
            throw new BadRequestException('BOM must be RELEASED before generating PR');
        }

        const pr = this.prRepository.create({
            projectId,
            bomHeaderId,
            requestedBy,
            status: PRStatus.DRAFT,
        });

        return this.prRepository.save(pr);
    }

    async getPRs(projectId: string): Promise<PurchaseRequisition[]> {
        return this.prRepository.find({ where: { projectId }, order: { createdAt: 'DESC' } });
    }

    // --- Goods Receipt (GRN) ---

    async createGRN(purchaseOrderId: string, receivedBy: string, deliveryNoteRef: string): Promise<GRN> {
        const grn = this.grnRepository.create({
            purchaseOrderId,
            receivedBy,
            deliveryNoteRef,
            status: GRNStatus.PENDING_QC,
        });
        return this.grnRepository.save(grn);
    }

    async updateQCStatus(grnId: string, passed: boolean, notes: string): Promise<GRN> {
        const grn = await this.grnRepository.findOne({ where: { id: grnId } });
        if (!grn) throw new NotFoundException('GRN not found');

        grn.qcPassed = passed;
        grn.qcNotes = notes;
        grn.status = passed ? GRNStatus.COMPLETED : GRNStatus.REJECTED;

        return this.grnRepository.save(grn);
    }
}
