import { apiClient } from './api/client';

// ============================================================================
// Interfaces
// ============================================================================

export interface DeliveryNoteItem {
    id: string;
    productId: string;
    productCode: string;
    productName: string;
    orderedQuantity: number;
    deliveredQuantity: number;
    uom: string;
    batchNumber?: string;
    serialNumbers?: string[];
    remarks?: string;
}

export interface DeliveryNote {
    id: string;
    deliveryNoteNumber: string;
    shipmentId: string;
    shipmentNumber: string;
    orderId?: string;
    orderNumber?: string;
    customerId: string;
    customerName: string;
    deliveryAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    deliveryDate: string;
    status: 'Draft' | 'Issued' | 'Acknowledged' | 'Disputed' | 'Cancelled';
    items: DeliveryNoteItem[];
    totalItems: number;
    totalDeliveredQuantity: number;
    receivedBy?: string;
    receivedDate?: string;
    signatureUrl?: string;
    notes?: string;
    internalNotes?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface DeliveryNoteFilters {
    status?: string;
    customerId?: string;
    shipmentId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface CreateDeliveryNoteDto {
    shipmentId: string;
    customerId: string;
    customerName: string;
    deliveryAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    items: Omit<DeliveryNoteItem, 'id'>[];
    notes?: string;
    internalNotes?: string;
}

export interface UpdateDeliveryNoteDto extends Partial<CreateDeliveryNoteDto> {
    status?: DeliveryNote['status'];
    receivedBy?: string;
    receivedDate?: string;
    signatureUrl?: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_DELIVERY_NOTES: DeliveryNote[] = [
    {
        id: 'DN-001',
        deliveryNoteNumber: 'DN-2025-0001',
        shipmentId: 'SHIP-002',
        shipmentNumber: 'SHP-2025-0002',
        orderId: 'ORD-002',
        orderNumber: 'SO-2025-0146',
        customerId: 'CUST-002',
        customerName: 'BigBasket Pvt Ltd',
        deliveryAddress: '456 Koramangala Industrial Area',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560034',
        country: 'India',
        deliveryDate: '2025-01-21',
        status: 'Acknowledged',
        items: [
            {
                id: 'DNI-001',
                productId: 'PRD-003',
                productCode: 'COLD-001',
                productName: 'Walk-in Cooler Panel',
                orderedQuantity: 10,
                deliveredQuantity: 10,
                uom: 'PCS',
                batchNumber: 'BATCH-2025-001'
            },
            {
                id: 'DNI-002',
                productId: 'PRD-004',
                productCode: 'COLD-002',
                productName: 'Refrigeration Compressor',
                orderedQuantity: 2,
                deliveredQuantity: 2,
                uom: 'PCS',
                serialNumbers: ['COMP-001', 'COMP-002']
            },
        ],
        totalItems: 2,
        totalDeliveredQuantity: 12,
        receivedBy: 'Sunil Reddy',
        receivedDate: '2025-01-21',
        signatureUrl: '/signatures/dn-001.png',
        notes: 'All items received in good condition',
        createdBy: 'USR-001',
        createdAt: '2025-01-21T14:00:00Z',
        updatedAt: '2025-01-21T16:30:00Z',
    },
    {
        id: 'DN-002',
        deliveryNoteNumber: 'DN-2025-0002',
        shipmentId: 'SHIP-005',
        shipmentNumber: 'SHP-2025-0005',
        orderId: 'ORD-005',
        orderNumber: 'SO-2025-0149',
        customerId: 'CUST-005',
        customerName: 'Marriott International',
        deliveryAddress: '101 DLF Phase 5',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122002',
        country: 'India',
        deliveryDate: '2025-01-19',
        status: 'Acknowledged',
        items: [
            {
                id: 'DNI-003',
                productId: 'PRD-008',
                productCode: 'KIT-VENT-001',
                productName: 'Exhaust Hood System',
                orderedQuantity: 1,
                deliveredQuantity: 1,
                uom: 'SET',
                serialNumbers: ['EHS-2025-001']
            },
        ],
        totalItems: 1,
        totalDeliveredQuantity: 1,
        receivedBy: 'Pradeep Sharma',
        receivedDate: '2025-01-19',
        signatureUrl: '/signatures/dn-002.png',
        createdBy: 'USR-002',
        createdAt: '2025-01-19T13:00:00Z',
        updatedAt: '2025-01-19T15:00:00Z',
    },
    {
        id: 'DN-003',
        deliveryNoteNumber: 'DN-2025-0003',
        shipmentId: 'SHIP-001',
        shipmentNumber: 'SHP-2025-0001',
        orderId: 'ORD-001',
        orderNumber: 'SO-2025-0145',
        customerId: 'CUST-001',
        customerName: 'Taj Hotels Limited',
        deliveryAddress: '123 Marine Drive, Colaba',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        deliveryDate: '2025-01-25',
        status: 'Issued',
        items: [
            {
                id: 'DNI-004',
                productId: 'PRD-001',
                productCode: 'KIT-COMM-001',
                productName: 'Commercial Range Hood',
                orderedQuantity: 2,
                deliveredQuantity: 2,
                uom: 'PCS',
                serialNumbers: ['RH-2025-001', 'RH-2025-002']
            },
            {
                id: 'DNI-005',
                productId: 'PRD-002',
                productCode: 'KIT-COMM-002',
                productName: 'Industrial Refrigerator',
                orderedQuantity: 1,
                deliveredQuantity: 1,
                uom: 'PCS',
                serialNumbers: ['IR-2025-001']
            },
        ],
        totalItems: 2,
        totalDeliveredQuantity: 3,
        notes: 'Handle with care - fragile equipment',
        internalNotes: 'VIP customer - ensure proper packaging',
        createdBy: 'USR-001',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-20T10:00:00Z',
    },
    {
        id: 'DN-004',
        deliveryNoteNumber: 'DN-2025-0004',
        shipmentId: 'SHIP-004',
        shipmentNumber: 'SHP-2025-0004',
        orderId: 'ORD-004',
        orderNumber: 'SO-2025-0148',
        customerId: 'CUST-004',
        customerName: 'Zomato Kitchens',
        deliveryAddress: '789 Sector 44, Gurugram',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122003',
        country: 'India',
        deliveryDate: '2025-01-23',
        status: 'Issued',
        items: [
            {
                id: 'DNI-006',
                productId: 'PRD-006',
                productCode: 'KIT-PREP-001',
                productName: 'Prep Table Stainless Steel',
                orderedQuantity: 5,
                deliveredQuantity: 5,
                uom: 'PCS',
                batchNumber: 'BATCH-2025-PT01'
            },
            {
                id: 'DNI-007',
                productId: 'PRD-007',
                productCode: 'KIT-PREP-002',
                productName: 'Commercial Blender',
                orderedQuantity: 4,
                deliveredQuantity: 4,
                uom: 'PCS',
                serialNumbers: ['BL-001', 'BL-002', 'BL-003', 'BL-004']
            },
        ],
        totalItems: 2,
        totalDeliveredQuantity: 9,
        createdBy: 'USR-003',
        createdAt: '2025-01-19T08:00:00Z',
        updatedAt: '2025-01-19T08:00:00Z',
    },
    {
        id: 'DN-005',
        deliveryNoteNumber: 'DN-2025-0005',
        shipmentId: 'SHIP-010',
        shipmentNumber: 'SHP-2025-0010',
        orderId: 'ORD-010',
        orderNumber: 'SO-2025-0154',
        customerId: 'CUST-010',
        customerName: 'Reliance Retail',
        deliveryAddress: '654 Jio World Centre, BKC',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400051',
        country: 'India',
        deliveryDate: '2025-01-17',
        status: 'Disputed',
        items: [
            {
                id: 'DNI-008',
                productId: 'PRD-016',
                productCode: 'DISP-001',
                productName: 'Display Freezer',
                orderedQuantity: 2,
                deliveredQuantity: 2,
                uom: 'PCS',
                serialNumbers: ['DF-2025-001', 'DF-2025-002'],
                remarks: 'One unit arrived with damaged compressor'
            },
        ],
        totalItems: 1,
        totalDeliveredQuantity: 2,
        receivedBy: 'Amit Patel',
        receivedDate: '2025-01-17',
        notes: 'Damage noted during delivery - return initiated',
        internalNotes: 'Insurance claim to be filed',
        createdBy: 'USR-001',
        createdAt: '2025-01-17T11:00:00Z',
        updatedAt: '2025-01-18T09:00:00Z',
    },
    {
        id: 'DN-006',
        deliveryNoteNumber: 'DN-2025-0006',
        shipmentId: 'SHIP-008',
        shipmentNumber: 'SHP-2025-0008',
        orderId: 'ORD-008',
        orderNumber: 'SO-2025-0152',
        customerId: 'CUST-008',
        customerName: 'Haldiram Foods',
        deliveryAddress: '890 Mathura Road, Faridabad',
        city: 'Faridabad',
        state: 'Haryana',
        postalCode: '121003',
        country: 'India',
        deliveryDate: '2025-01-26',
        status: 'Draft',
        items: [
            {
                id: 'DNI-009',
                productId: 'PRD-012',
                productCode: 'FOOD-001',
                productName: 'Food Processing Line',
                orderedQuantity: 1,
                deliveredQuantity: 1,
                uom: 'SET',
                serialNumbers: ['FPL-2025-001']
            },
            {
                id: 'DNI-010',
                productId: 'PRD-013',
                productCode: 'FOOD-002',
                productName: 'Packaging Machine',
                orderedQuantity: 2,
                deliveredQuantity: 2,
                uom: 'PCS',
                serialNumbers: ['PM-2025-001', 'PM-2025-002']
            },
        ],
        totalItems: 2,
        totalDeliveredQuantity: 3,
        notes: 'Requires crane for unloading',
        internalNotes: 'Coordinate with site team for installation',
        createdBy: 'USR-002',
        createdAt: '2025-01-21T10:00:00Z',
        updatedAt: '2025-01-21T10:00:00Z',
    },
    {
        id: 'DN-007',
        deliveryNoteNumber: 'DN-2025-0007',
        shipmentId: 'SHIP-007',
        shipmentNumber: 'SHP-2025-0007',
        orderId: 'ORD-007',
        orderNumber: 'SO-2025-0151',
        customerId: 'CUST-007',
        customerName: 'Oberoi Hotels',
        deliveryAddress: '567 Nariman Point',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400021',
        country: 'India',
        deliveryDate: '2025-01-18',
        status: 'Cancelled',
        items: [
            {
                id: 'DNI-011',
                productId: 'PRD-011',
                productCode: 'KIT-COMM-004',
                productName: 'Convection Oven',
                orderedQuantity: 2,
                deliveredQuantity: 0,
                uom: 'PCS',
                remarks: 'Order cancelled by customer'
            },
        ],
        totalItems: 1,
        totalDeliveredQuantity: 0,
        notes: 'Cancelled - order revised by customer',
        createdBy: 'USR-001',
        createdAt: '2025-01-16T09:00:00Z',
        updatedAt: '2025-01-16T10:00:00Z',
    },
];

// ============================================================================
// Service Class
// ============================================================================

class DeliveryNoteService {
    private mockDeliveryNotes: DeliveryNote[] = [...MOCK_DELIVERY_NOTES];

    /**
     * Get all delivery notes with optional filters
     */
    async getAllDeliveryNotes(filters?: DeliveryNoteFilters): Promise<{ data: DeliveryNote[]; total: number }> {
        try {
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.customerId) params.append('customerId', filters.customerId);
            if (filters?.shipmentId) params.append('shipmentId', filters.shipmentId);
            if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
            if (filters?.dateTo) params.append('dateTo', filters.dateTo);
            if (filters?.search) params.append('search', filters.search);

            const response = await apiClient.get<{ data: DeliveryNote[]; total: number }>(
                `/logistics/delivery-notes?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error('API Error fetching delivery notes, using mock data:', error);

            // Filter mock data
            let filteredNotes = [...this.mockDeliveryNotes];

            if (filters?.status) {
                filteredNotes = filteredNotes.filter(n => n.status === filters.status);
            }
            if (filters?.customerId) {
                filteredNotes = filteredNotes.filter(n => n.customerId === filters.customerId);
            }
            if (filters?.shipmentId) {
                filteredNotes = filteredNotes.filter(n => n.shipmentId === filters.shipmentId);
            }
            if (filters?.dateFrom) {
                filteredNotes = filteredNotes.filter(n => n.deliveryDate >= filters.dateFrom!);
            }
            if (filters?.dateTo) {
                filteredNotes = filteredNotes.filter(n => n.deliveryDate <= filters.dateTo!);
            }
            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                filteredNotes = filteredNotes.filter(n =>
                    n.deliveryNoteNumber.toLowerCase().includes(searchLower) ||
                    n.customerName.toLowerCase().includes(searchLower) ||
                    n.shipmentNumber.toLowerCase().includes(searchLower)
                );
            }

            return { data: filteredNotes, total: filteredNotes.length };
        }
    }

    /**
     * Get delivery note by ID
     */
    async getDeliveryNoteById(id: string): Promise<DeliveryNote> {
        try {
            const response = await apiClient.get<DeliveryNote>(`/logistics/delivery-notes/${id}`);
            return response.data;
        } catch (error) {
            console.error(`API Error fetching delivery note ${id}, using mock data:`, error);
            const note = this.mockDeliveryNotes.find(n => n.id === id);
            if (!note) throw new Error('Delivery note not found');
            return note;
        }
    }

    /**
     * Create a new delivery note
     */
    async createDeliveryNote(data: CreateDeliveryNoteDto): Promise<DeliveryNote> {
        try {
            const response = await apiClient.post<DeliveryNote>('/logistics/delivery-notes', data);
            return response.data;
        } catch (error) {
            console.error('API Error creating delivery note, using mock:', error);

            const shipment = this.mockDeliveryNotes.find(n => n.shipmentId === data.shipmentId);

            const newNote: DeliveryNote = {
                id: `DN-${Date.now()}`,
                deliveryNoteNumber: `DN-2025-${String(this.mockDeliveryNotes.length + 1).padStart(4, '0')}`,
                shipmentNumber: shipment?.shipmentNumber || `SHP-${data.shipmentId}`,
                ...data,
                deliveryDate: new Date().toISOString().split('T')[0],
                status: 'Draft',
                items: data.items.map((item, index) => ({
                    ...item,
                    id: `DNI-${Date.now()}-${index}`,
                })),
                totalItems: data.items.length,
                totalDeliveredQuantity: data.items.reduce((sum, item) => sum + item.deliveredQuantity, 0),
                createdBy: 'CURRENT_USER',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            this.mockDeliveryNotes.push(newNote);
            return newNote;
        }
    }

    /**
     * Update an existing delivery note
     */
    async updateDeliveryNote(id: string, data: UpdateDeliveryNoteDto): Promise<DeliveryNote> {
        try {
            const response = await apiClient.put<DeliveryNote>(`/logistics/delivery-notes/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`API Error updating delivery note ${id}, using mock:`, error);

            const index = this.mockDeliveryNotes.findIndex(n => n.id === id);
            if (index === -1) throw new Error('Delivery note not found');

            this.mockDeliveryNotes[index] = {
                ...this.mockDeliveryNotes[index],
                ...data,
                items: data.items
                    ? data.items.map((item, i) => ({ ...item, id: `DNI-${Date.now()}-${i}` }))
                    : this.mockDeliveryNotes[index].items,
                updatedAt: new Date().toISOString(),
            };

            return this.mockDeliveryNotes[index];
        }
    }

    /**
     * Issue a delivery note (change status from Draft to Issued)
     */
    async issueDeliveryNote(id: string): Promise<DeliveryNote> {
        return this.updateDeliveryNote(id, { status: 'Issued' });
    }

    /**
     * Acknowledge a delivery note
     */
    async acknowledgeDeliveryNote(id: string, receivedBy: string, signatureUrl?: string): Promise<DeliveryNote> {
        return this.updateDeliveryNote(id, {
            status: 'Acknowledged',
            receivedBy,
            receivedDate: new Date().toISOString().split('T')[0],
            signatureUrl
        });
    }

    /**
     * Dispute a delivery note
     */
    async disputeDeliveryNote(id: string, notes: string): Promise<DeliveryNote> {
        return this.updateDeliveryNote(id, {
            status: 'Disputed',
            notes
        });
    }
}

export const deliveryNoteService = new DeliveryNoteService();
