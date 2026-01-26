import { apiClient } from './api/client';

// ============== Interfaces ==============

export interface QuotationItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
  uom: string;
  leadTime?: number;
  notes?: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  contactPerson?: string;
  rfqId?: string;
  rfqNumber?: string;
  quotationDate: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Under Review' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted';
  revision: number;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  warranty?: string;
  salesPersonId?: string;
  salesPersonName?: string;
  approvedBy?: string;
  approvedAt?: string;
  convertedToOrderId?: string;
  convertedToOrderNumber?: string;
  notes?: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationDto {
  customerId: string;
  rfqId?: string;
  validUntil: string;
  items: Omit<QuotationItem, 'id' | 'totalPrice'>[];
  paymentTerms: string;
  deliveryTerms: string;
  warranty?: string;
  notes?: string;
  termsAndConditions?: string;
  salesPersonId?: string;
}

export interface UpdateQuotationDto extends Partial<CreateQuotationDto> {
  status?: Quotation['status'];
}

export interface QuotationFilters {
  search?: string;
  status?: Quotation['status'];
  customerId?: string;
  salesPersonId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============== Mock Data ==============

const USE_MOCK_DATA = true;

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'qt-001',
    quotationNumber: 'QT-2024-0001',
    customerId: 'cust-001',
    customerName: 'Acme Manufacturing Corp',
    customerEmail: 'procurement@acmemfg.com',
    customerPhone: '+1-555-0101',
    contactPerson: 'Robert Chen',
    rfqId: 'rfq-001',
    rfqNumber: 'RFQ-2024-0001',
    quotationDate: '2024-01-10',
    validUntil: '2024-02-10',
    status: 'Converted',
    revision: 1,
    items: [
      { id: 'item-1', productId: 'prod-001', productCode: 'CNC-PART-001', productName: 'CNC Machined Bracket', description: 'High-precision aluminum bracket', quantity: 500, unitPrice: 25.00, discount: 5, tax: 8, totalPrice: 12000.00, uom: 'pcs', leadTime: 15 },
      { id: 'item-2', productId: 'prod-002', productCode: 'CAST-PART-001', productName: 'Aluminum Casting', description: 'Die-cast aluminum housing', quantity: 200, unitPrice: 75.00, discount: 0, tax: 8, totalPrice: 16200.00, uom: 'pcs', leadTime: 20 },
    ],
    subtotal: 27500.00,
    taxAmount: 2200.00,
    discountAmount: 625.00,
    totalAmount: 29075.00,
    currency: 'USD',
    paymentTerms: 'Net 30',
    deliveryTerms: 'FOB Destination',
    warranty: '12 months standard warranty',
    salesPersonId: 'user-001',
    salesPersonName: 'John Smith',
    approvedBy: 'manager-001',
    approvedAt: '2024-01-12T10:00:00Z',
    convertedToOrderId: 'so-001',
    convertedToOrderNumber: 'SO-2024-0001',
    notes: 'Volume discount applied for quantity over 400 units',
    termsAndConditions: 'Standard terms and conditions apply',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'qt-002',
    quotationNumber: 'QT-2024-0002',
    customerId: 'cust-002',
    customerName: 'Global Auto Parts Inc',
    customerEmail: 'sourcing@globalauto.com',
    customerPhone: '+1-555-0102',
    contactPerson: 'Emily Watson',
    quotationDate: '2024-01-12',
    validUntil: '2024-02-12',
    status: 'Accepted',
    revision: 2,
    items: [
      { id: 'item-3', productId: 'prod-003', productCode: 'STAMP-001', productName: 'Stamped Steel Panel', description: 'Automotive body panel', quantity: 1000, unitPrice: 15.00, discount: 10, tax: 7.5, totalPrice: 14512.50, uom: 'pcs', leadTime: 12 },
      { id: 'item-4', productId: 'prod-004', productCode: 'STAMP-002', productName: 'Stamped Reinforcement', description: 'Structural reinforcement panel', quantity: 1000, unitPrice: 8.50, discount: 10, tax: 7.5, totalPrice: 8226.25, uom: 'pcs', leadTime: 12 },
    ],
    subtotal: 23500.00,
    taxAmount: 1586.25,
    discountAmount: 2350.00,
    totalAmount: 22736.25,
    currency: 'USD',
    paymentTerms: 'Net 45',
    deliveryTerms: 'CIF Customer Warehouse',
    warranty: '6 months manufacturing defect warranty',
    salesPersonId: 'user-002',
    salesPersonName: 'Sarah Johnson',
    approvedBy: 'manager-001',
    approvedAt: '2024-01-14T11:30:00Z',
    notes: 'Revised pricing based on customer feedback',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
  },
  {
    id: 'qt-003',
    quotationNumber: 'QT-2024-0003',
    customerId: 'cust-003',
    customerName: 'Precision Tools Ltd',
    customerEmail: 'purchasing@precisiontools.com',
    customerPhone: '+1-555-0103',
    contactPerson: 'David Miller',
    quotationDate: '2024-01-15',
    validUntil: '2024-02-15',
    status: 'Sent',
    revision: 1,
    items: [
      { id: 'item-5', productId: 'prod-005', productCode: 'TOOL-DIE-001', productName: 'Tool Steel Die', description: 'Precision die for stamping operations', quantity: 10, unitPrice: 2500.00, discount: 0, tax: 8, totalPrice: 27000.00, uom: 'pcs', leadTime: 30 },
    ],
    subtotal: 25000.00,
    taxAmount: 2000.00,
    discountAmount: 0,
    totalAmount: 27000.00,
    currency: 'USD',
    paymentTerms: 'Net 30',
    deliveryTerms: 'Ex Works',
    warranty: '24 months warranty on workmanship',
    salesPersonId: 'user-001',
    salesPersonName: 'John Smith',
    notes: 'Customer requested quality certification documents',
    termsAndConditions: 'Custom tooling terms apply - no returns after production starts',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
  },
  {
    id: 'qt-004',
    quotationNumber: 'QT-2024-0004',
    customerId: 'cust-005',
    customerName: 'Aerospace Components Inc',
    customerEmail: 'procurement@aerospacecomp.com',
    customerPhone: '+1-555-0105',
    contactPerson: 'Jennifer Lee',
    rfqId: 'rfq-003',
    rfqNumber: 'RFQ-2024-0003',
    quotationDate: '2024-01-18',
    validUntil: '2024-03-18',
    status: 'Under Review',
    revision: 1,
    items: [
      { id: 'item-6', productId: 'prod-007', productCode: 'AERO-BRKT-001', productName: 'Aerospace Bracket - Titanium', description: 'AS9100 certified titanium bracket', quantity: 100, unitPrice: 850.00, discount: 3, tax: 5.5, totalPrice: 87017.50, uom: 'pcs', leadTime: 45 },
      { id: 'item-7', productId: 'prod-015', productCode: 'AERO-FAST-001', productName: 'Aerospace Fastener Set', description: 'NAS certified fastener kit', quantity: 200, unitPrice: 125.00, discount: 0, tax: 5.5, totalPrice: 26375.00, uom: 'sets', leadTime: 30 },
    ],
    subtotal: 110500.00,
    taxAmount: 5932.50,
    discountAmount: 2550.00,
    totalAmount: 113882.50,
    currency: 'USD',
    paymentTerms: 'Net 30 - 50% Advance',
    deliveryTerms: 'DDP Customer Facility',
    warranty: '36 months warranty with full traceability',
    salesPersonId: 'user-002',
    salesPersonName: 'Sarah Johnson',
    notes: 'AS9100 and NADCAP certifications required',
    termsAndConditions: 'Aerospace quality requirements per customer spec ACS-001',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-20T09:30:00Z',
  },
  {
    id: 'qt-005',
    quotationNumber: 'QT-2024-0005',
    customerId: 'cust-006',
    customerName: 'Electric Motors Ltd',
    customerEmail: 'supply@electricmotors.com',
    customerPhone: '+1-555-0106',
    contactPerson: 'Michael Brown',
    quotationDate: '2024-01-20',
    validUntil: '2024-02-20',
    status: 'Expired',
    revision: 1,
    items: [
      { id: 'item-8', productId: 'prod-008', productCode: 'ROTOR-001', productName: 'Motor Rotor Assembly', description: 'Balanced rotor assembly for electric motors', quantity: 150, unitPrice: 125.00, discount: 0, tax: 5, totalPrice: 19687.50, uom: 'pcs', leadTime: 18 },
    ],
    subtotal: 18750.00,
    taxAmount: 937.50,
    discountAmount: 0,
    totalAmount: 19687.50,
    currency: 'USD',
    paymentTerms: 'Net 15',
    deliveryTerms: 'FOB Origin',
    warranty: '12 months warranty',
    salesPersonId: 'user-003',
    salesPersonName: 'Mike Davis',
    notes: 'Customer did not respond within validity period',
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-02-21T00:00:00Z',
  },
  {
    id: 'qt-006',
    quotationNumber: 'QT-2024-0006',
    customerId: 'cust-007',
    customerName: 'Marine Equipment Corp',
    customerEmail: 'sourcing@marineequip.com',
    customerPhone: '+1-555-0107',
    contactPerson: 'Lisa Anderson',
    quotationDate: '2024-01-22',
    validUntil: '2024-03-22',
    status: 'Rejected',
    revision: 2,
    items: [
      { id: 'item-9', productId: 'prod-010', productCode: 'MARINE-001', productName: 'Marine Grade Propeller', description: 'Stainless steel marine propeller', quantity: 20, unitPrice: 3800.00, discount: 5, tax: 9.5, totalPrice: 79002.00, uom: 'pcs', leadTime: 35 },
    ],
    subtotal: 76000.00,
    taxAmount: 6802.00,
    discountAmount: 3800.00,
    totalAmount: 79002.00,
    currency: 'USD',
    paymentTerms: 'Net 45',
    deliveryTerms: 'CIF Port',
    warranty: '18 months marine warranty',
    salesPersonId: 'user-003',
    salesPersonName: 'Mike Davis',
    notes: 'Customer found lower price from competitor',
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-28T15:00:00Z',
  },
  {
    id: 'qt-007',
    quotationNumber: 'QT-2024-0007',
    customerId: 'cust-009',
    customerName: 'Rail Systems LLC',
    customerEmail: 'procurement@railsystems.com',
    customerPhone: '+1-555-0109',
    contactPerson: 'Thomas Wilson',
    rfqId: 'rfq-005',
    rfqNumber: 'RFQ-2024-0005',
    quotationDate: '2024-01-25',
    validUntil: '2024-04-25',
    status: 'Sent',
    revision: 1,
    items: [
      { id: 'item-10', productId: 'prod-012', productCode: 'RAIL-WHEEL-001', productName: 'Railway Wheel Set', description: 'Heavy-duty railway wheel assembly', quantity: 40, unitPrice: 8500.00, discount: 5, tax: 6.25, totalPrice: 342937.50, uom: 'sets', leadTime: 60 },
      { id: 'item-11', productId: 'prod-016', productCode: 'RAIL-AXLE-001', productName: 'Railway Axle', description: 'Forged steel axle', quantity: 40, unitPrice: 4200.00, discount: 5, tax: 6.25, totalPrice: 169575.00, uom: 'pcs', leadTime: 45 },
    ],
    subtotal: 508000.00,
    taxAmount: 29881.25,
    discountAmount: 25400.00,
    totalAmount: 512481.25,
    currency: 'USD',
    paymentTerms: 'Net 60 - Progress payments',
    deliveryTerms: 'DDP Rail Yard',
    warranty: '48 months warranty with inspection provisions',
    salesPersonId: 'user-003',
    salesPersonName: 'Mike Davis',
    notes: 'Multi-year contract opportunity - Year 1 pricing',
    termsAndConditions: 'Railway industry standards and certifications apply',
    createdAt: '2024-01-25T08:30:00Z',
    updatedAt: '2024-01-26T10:00:00Z',
  },
  {
    id: 'qt-008',
    quotationNumber: 'QT-2024-0008',
    customerId: 'cust-010',
    customerName: 'Construction Equipment Co',
    customerEmail: 'purchasing@constructequip.com',
    customerPhone: '+1-555-0110',
    contactPerson: 'Kevin Martinez',
    quotationDate: '2024-01-28',
    validUntil: '2024-02-28',
    status: 'Draft',
    revision: 1,
    items: [
      { id: 'item-12', productId: 'prod-013', productCode: 'BUCKET-001', productName: 'Excavator Bucket', description: 'Heavy-duty excavator bucket', quantity: 15, unitPrice: 4200.00, discount: 0, tax: 8.25, totalPrice: 68197.50, uom: 'pcs', leadTime: 25 },
      { id: 'item-13', productId: 'prod-014', productCode: 'TEETH-001', productName: 'Bucket Teeth Set', description: 'Hardened steel bucket teeth', quantity: 30, unitPrice: 850.00, discount: 10, tax: 8.25, totalPrice: 24862.50, uom: 'sets', leadTime: 14 },
    ],
    subtotal: 88500.00,
    taxAmount: 7056.56,
    discountAmount: 2550.00,
    totalAmount: 93006.56,
    currency: 'USD',
    paymentTerms: 'Net 30 - 30% Advance',
    deliveryTerms: 'FOB Destination',
    warranty: '12 months warranty',
    salesPersonId: 'user-001',
    salesPersonName: 'John Smith',
    notes: 'Pending final pricing review',
    createdAt: '2024-01-28T14:00:00Z',
    updatedAt: '2024-01-28T14:00:00Z',
  },
  {
    id: 'qt-009',
    quotationNumber: 'QT-2024-0009',
    customerId: 'cust-004',
    customerName: 'Heavy Machinery Co',
    customerEmail: 'vendor@heavymachinery.com',
    customerPhone: '+1-555-0104',
    contactPerson: 'Richard Taylor',
    quotationDate: '2024-01-30',
    validUntil: '2024-03-01',
    status: 'Sent',
    revision: 1,
    items: [
      { id: 'item-14', productId: 'prod-005', productCode: 'GEAR-001', productName: 'Heavy Duty Gear Assembly', description: 'Industrial gear assembly for heavy machinery', quantity: 100, unitPrice: 450.00, discount: 8, tax: 6, totalPrice: 43884.00, uom: 'sets', leadTime: 28 },
      { id: 'item-15', productId: 'prod-006', productCode: 'SHAFT-001', productName: 'Drive Shaft', description: 'Hardened steel drive shaft', quantity: 100, unitPrice: 320.00, discount: 8, tax: 6, totalPrice: 31203.20, uom: 'pcs', leadTime: 21 },
    ],
    subtotal: 77000.00,
    taxAmount: 4253.28,
    discountAmount: 6160.00,
    totalAmount: 75093.28,
    currency: 'USD',
    paymentTerms: 'Net 60',
    deliveryTerms: 'Ex Works',
    warranty: '24 months warranty',
    salesPersonId: 'user-002',
    salesPersonName: 'Sarah Johnson',
    notes: 'Repeat customer - loyalty discount applied',
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-01-31T11:30:00Z',
  },
  {
    id: 'qt-010',
    quotationNumber: 'QT-2024-0010',
    customerId: 'cust-011',
    customerName: 'Industrial Pumps Inc',
    customerEmail: 'sourcing@industrialpumps.com',
    customerPhone: '+1-555-0111',
    contactPerson: 'Amanda Green',
    quotationDate: '2024-02-01',
    validUntil: '2024-03-01',
    status: 'Under Review',
    revision: 1,
    items: [
      { id: 'item-16', productId: 'prod-017', productCode: 'IMPELLER-001', productName: 'Pump Impeller', description: 'Stainless steel impeller for industrial pumps', quantity: 50, unitPrice: 680.00, discount: 5, tax: 7, totalPrice: 34646.00, uom: 'pcs', leadTime: 20 },
      { id: 'item-17', productId: 'prod-018', productCode: 'CASING-001', productName: 'Pump Casing', description: 'Cast iron pump casing', quantity: 25, unitPrice: 1250.00, discount: 5, tax: 7, totalPrice: 31781.25, uom: 'pcs', leadTime: 25 },
    ],
    subtotal: 65250.00,
    taxAmount: 4282.19,
    discountAmount: 3262.50,
    totalAmount: 66269.69,
    currency: 'USD',
    paymentTerms: 'Net 30',
    deliveryTerms: 'FOB Origin',
    warranty: '18 months warranty',
    salesPersonId: 'user-001',
    salesPersonName: 'John Smith',
    notes: 'New customer - first quotation',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-02T14:00:00Z',
  },
];

// ============== Service Class ==============

class QuotationService {
  private buildQueryParams(filters?: QuotationFilters): string {
    if (!filters) return '';
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.customerId) params.append('customerId', filters.customerId);
    if (filters.salesPersonId) params.append('salesPersonId', filters.salesPersonId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    return params.toString();
  }

  async getAllQuotations(filters?: QuotationFilters): Promise<{ data: Quotation[]; total: number }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filteredQuotations = [...MOCK_QUOTATIONS];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredQuotations = filteredQuotations.filter(
          (q) =>
            q.quotationNumber.toLowerCase().includes(searchLower) ||
            q.customerName.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.status) {
        filteredQuotations = filteredQuotations.filter((q) => q.status === filters.status);
      }
      if (filters?.customerId) {
        filteredQuotations = filteredQuotations.filter((q) => q.customerId === filters.customerId);
      }
      if (filters?.salesPersonId) {
        filteredQuotations = filteredQuotations.filter((q) => q.salesPersonId === filters.salesPersonId);
      }

      return { data: filteredQuotations, total: filteredQuotations.length };
    }

    const queryString = this.buildQueryParams(filters);
    const response = await apiClient.get<{ data: Quotation[]; total: number }>(
      `/sales/quotations${queryString ? `?${queryString}` : ''}`
    );
    return response.data;
  }

  async getQuotationById(id: string): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const quotation = MOCK_QUOTATIONS.find((q) => q.id === id);
      if (!quotation) throw new Error('Quotation not found');
      return quotation;
    }

    const response = await apiClient.get<Quotation>(`/sales/quotations/${id}`);
    return response.data;
  }

  async createQuotation(data: CreateQuotationDto): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const quotationNumber = `QT-2024-${String(MOCK_QUOTATIONS.length + 1).padStart(4, '0')}`;
      const newQuotation: Quotation = {
        id: `qt-${Date.now()}`,
        quotationNumber,
        customerId: data.customerId,
        customerName: 'New Customer',
        rfqId: data.rfqId,
        quotationDate: new Date().toISOString().split('T')[0],
        validUntil: data.validUntil,
        status: 'Draft',
        revision: 1,
        items: data.items.map((item, index) => ({
          ...item,
          id: `item-${Date.now()}-${index}`,
          totalPrice: item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100) * (1 + (item.tax || 0) / 100),
        })) as QuotationItem[],
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
        currency: 'USD',
        paymentTerms: data.paymentTerms,
        deliveryTerms: data.deliveryTerms,
        warranty: data.warranty,
        salesPersonId: data.salesPersonId,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_QUOTATIONS.push(newQuotation);
      return newQuotation;
    }

    const response = await apiClient.post<Quotation>('/sales/quotations', data);
    return response.data;
  }

  async updateQuotation(id: string, data: UpdateQuotationDto): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = MOCK_QUOTATIONS.findIndex((q) => q.id === id);
      if (index === -1) throw new Error('Quotation not found');

      MOCK_QUOTATIONS[index] = {
        ...MOCK_QUOTATIONS[index],
        ...data,
        revision: MOCK_QUOTATIONS[index].revision + 1,
        updatedAt: new Date().toISOString(),
      } as Quotation;
      return MOCK_QUOTATIONS[index];
    }

    const response = await apiClient.put<Quotation>(`/sales/quotations/${id}`, data);
    return response.data;
  }

  async sendQuotation(id: string): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = MOCK_QUOTATIONS.findIndex((q) => q.id === id);
      if (index === -1) throw new Error('Quotation not found');

      MOCK_QUOTATIONS[index] = {
        ...MOCK_QUOTATIONS[index],
        status: 'Sent',
        updatedAt: new Date().toISOString(),
      };
      return MOCK_QUOTATIONS[index];
    }

    const response = await apiClient.post<Quotation>(`/sales/quotations/${id}/send`, {});
    return response.data;
  }

  async convertToOrder(id: string): Promise<{ quotation: Quotation; orderId: string }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = MOCK_QUOTATIONS.findIndex((q) => q.id === id);
      if (index === -1) throw new Error('Quotation not found');

      const orderId = `so-${Date.now()}`;
      MOCK_QUOTATIONS[index] = {
        ...MOCK_QUOTATIONS[index],
        status: 'Converted',
        convertedToOrderId: orderId,
        convertedToOrderNumber: `SO-2024-${String(Date.now()).slice(-4)}`,
        updatedAt: new Date().toISOString(),
      };
      return { quotation: MOCK_QUOTATIONS[index], orderId };
    }

    const response = await apiClient.post<{ quotation: Quotation; orderId: string }>(
      `/sales/quotations/${id}/convert`,
      {}
    );
    return response.data;
  }

  async duplicateQuotation(id: string): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const original = MOCK_QUOTATIONS.find((q) => q.id === id);
      if (!original) throw new Error('Quotation not found');

      const quotationNumber = `QT-2024-${String(MOCK_QUOTATIONS.length + 1).padStart(4, '0')}`;
      const newQuotation: Quotation = {
        ...original,
        id: `qt-${Date.now()}`,
        quotationNumber,
        quotationDate: new Date().toISOString().split('T')[0],
        status: 'Draft',
        revision: 1,
        convertedToOrderId: undefined,
        convertedToOrderNumber: undefined,
        approvedBy: undefined,
        approvedAt: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_QUOTATIONS.push(newQuotation);
      return newQuotation;
    }

    const response = await apiClient.post<Quotation>(`/sales/quotations/${id}/duplicate`, {});
    return response.data;
  }
}

export const quotationService = new QuotationService();
