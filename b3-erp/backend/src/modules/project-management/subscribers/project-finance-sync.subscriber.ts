import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
    DataSource,
} from 'typeorm';
import { Invoice } from '../../finance/entities/invoice.entity';
import { PurchaseOrder } from '../../procurement/entities/purchase-order.entity';
import { TimeLog } from '../entities/time-log.entity';
import { ProjectFinancialsService } from '../services/project-financials.service';
import { Project } from '../../project/entities/project.entity';

@EventSubscriber()
export class InvoiceSyncSubscriber implements EntitySubscriberInterface<Invoice> {
    constructor(
        private dataSource: DataSource,
        private financialsService: ProjectFinancialsService,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Invoice;
    }

    async afterInsert(event: InsertEvent<Invoice>) {
        if (event.entity.projectId) {
            await this.financialsService.syncProjectFinancials(event.entity.projectId);
        }
    }

    async afterUpdate(event: UpdateEvent<Invoice>) {
        if (event.entity?.projectId) {
            await this.financialsService.syncProjectFinancials(event.entity.projectId);
        }
    }
}

@EventSubscriber()
export class PurchaseOrderSyncSubscriber implements EntitySubscriberInterface<PurchaseOrder> {
    constructor(
        private dataSource: DataSource,
        private financialsService: ProjectFinancialsService,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return PurchaseOrder;
    }

    async afterInsert(event: InsertEvent<PurchaseOrder>) {
        await this.handlePOSync(event.entity);
    }

    async afterUpdate(event: UpdateEvent<PurchaseOrder>) {
        await this.handlePOSync(event.entity as PurchaseOrder);
    }

    private async handlePOSync(po: PurchaseOrder) {
        if (po?.project) {
            const project = await this.dataSource.getRepository(Project).findOne({
                where: { projectCode: po.project }
            });
            if (project) {
                await this.financialsService.syncProjectFinancials(project.id);
            }
        }
    }
}

@EventSubscriber()
export class TimeLogSyncSubscriber implements EntitySubscriberInterface<TimeLog> {
    constructor(
        private dataSource: DataSource,
        private financialsService: ProjectFinancialsService,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return TimeLog;
    }

    async afterInsert(event: InsertEvent<TimeLog>) {
        if (event.entity.projectId) {
            await this.financialsService.syncProjectFinancials(event.entity.projectId);
        }
    }

    async afterUpdate(event: UpdateEvent<TimeLog>) {
        if (event.entity?.projectId) {
            await this.financialsService.syncProjectFinancials(event.entity.projectId);
        }
    }
}
