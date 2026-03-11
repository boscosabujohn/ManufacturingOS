import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum ValuationMethod {
    FIFO = 'FIFO',
    LIFO = 'LIFO',
    WEIGHTED_AVERAGE = 'Weighted Average',
}

@Injectable()
export class StockValuationService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async calculateNewRate(
        itemId: string,
        warehouseId: string,
        method: string,
        incomingQty: number,
        incomingRate: number,
        currentBalance: any
    ): Promise<{ valuationRate: number; stockValue: number }> {
        const currentQty = Number(currentBalance.availableQuantity);
        const currentRate = Number(currentBalance.valuationRate);

        // For Weighted Average, it's a simple blend
        if (method === ValuationMethod.WEIGHTED_AVERAGE || method === 'Weighted Average') {
            const totalQty = currentQty + incomingQty;
            if (totalQty === 0) return { valuationRate: incomingRate, stockValue: 0 };

            const totalValue = (currentQty * currentRate) + (incomingQty * incomingRate);
            const newRate = totalValue / totalQty;

            return {
                valuationRate: parseFloat(newRate.toFixed(4)),
                stockValue: parseFloat(totalValue.toFixed(2))
            };
        }

        // For FIFO/LIFO, we calculate the total value based on remaining layers
        const layers = await this.getValuationLayers(itemId, warehouseId);
        layers.push({ quantity: incomingQty, rate: incomingRate });

        const totalValue = layers.reduce((sum, layer) => sum + (layer.quantity * layer.rate), 0);
        const totalQty = layers.reduce((sum, layer) => sum + layer.quantity, 0);
        const newRate = totalQty > 0 ? totalValue / totalQty : incomingRate;

        return {
            valuationRate: parseFloat(newRate.toFixed(4)),
            stockValue: parseFloat(totalValue.toFixed(2))
        };
    }

    async calculateIssueValue(
        itemId: string,
        warehouseId: string,
        issueQty: number,
        method: string
    ): Promise<{ totalValue: number; averageRate: number }> {
        if (method === ValuationMethod.WEIGHTED_AVERAGE || method === 'Weighted Average') {
            const balance = await this.prisma.stockBalance.findUnique({
                where: { itemId_warehouseId_locationId: { itemId, warehouseId, locationId: '' } } // This might need adjustment based on unique constraints
            }) || await this.prisma.stockBalance.findFirst({
                where: { itemId, warehouseId }
            });

            const rate = balance ? Number(balance.valuationRate) : 0;
            return {
                totalValue: parseFloat((issueQty * rate).toFixed(2)),
                averageRate: rate
            };
        }

        let layers = await this.getValuationLayers(itemId, warehouseId);

        if (method === ValuationMethod.LIFO || method === 'LIFO') {
            layers = layers.reverse();
        }

        let remainingToIssue = issueQty;
        let totalValue = 0;

        for (const layer of layers) {
            if (remainingToIssue <= 0) break;

            const consumeQty = Math.min(layer.quantity, remainingToIssue);
            totalValue += consumeQty * layer.rate;
            remainingToIssue -= consumeQty;
        }

        if (remainingToIssue > 0) {
            // Fallback for overselling/negative stock
            const balance = await this.prisma.stockBalance.findFirst({
                where: { itemId, warehouseId }
            });
            const rate = balance ? Number(balance.valuationRate) : 0;
            totalValue += remainingToIssue * rate;
        }

        return {
            totalValue: parseFloat(totalValue.toFixed(2)),
            averageRate: issueQty > 0 ? totalValue / issueQty : 0
        };
    }

    private async getValuationLayers(itemId: string, warehouseId: string): Promise<{ quantity: number; rate: number }[]> {
        const inLines = await this.prisma.stockEntryLine.findMany({
            where: {
                itemId,
                toLocationId: { startsWith: warehouseId },
                stockEntry: {
                    status: 'Posted',
                    movementDirection: 'IN'
                }
            },
            include: { stockEntry: true },
            orderBy: [
                { stockEntry: { postingDate: 'asc' } },
                { stockEntry: { postingTime: 'asc' } }
            ]
        });

        const outLines = await this.prisma.stockEntryLine.findMany({
            where: {
                itemId,
                fromLocationId: { startsWith: warehouseId },
                stockEntry: {
                    status: 'Posted',
                    movementDirection: 'OUT'
                }
            }
        });

        let totalOut = outLines.reduce((sum, line) => sum + Number(line.quantity), 0);

        const layers: { quantity: number; rate: number }[] = [];

        for (const line of inLines) {
            let qty = Number(line.quantity);
            if (totalOut > 0) {
                const offset = Math.min(qty, totalOut);
                qty -= offset;
                totalOut -= offset;
            }

            if (qty > 0) {
                layers.push({ quantity: qty, rate: Number(line.rate) });
            }
        }

        return layers;
    }
}
