import { apiClient } from './api/client';

// ==================== TypeScript Interfaces ====================

export type PRStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Converted to PO' | 'Cancelled';
export type PRPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface PurchaseRequisitionItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  requiredDate: string;
  warehouseId?: string;
  warehouseName?: string;
  suggestedVendorId?: string;
  suggestedVendorName?: string;
  notes?: string;
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  title: string;
  description?: string;
  requestedBy: string;
  requestedByName: string;
  department: string;
  priority: PRPriority;
  status: PRStatus;
  requestDate: string;
  requiredDate: string;
  estimatedTotal: number;
  currency: string;
  items: PurchaseRequisitionItem[];
  justification?: string;
  projectId?: string;
  projectName?: string;
  budgetCode?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  convertedToPOId?: string;
  convertedToPONumber?: string;
  convertedAt?: string;
  attachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseRequisitionDto {
  title: string;
  description?: string;
  department: string;
  priority: PRPriority;
  requiredDate: string;
  currency: string;
  justification?: string;
  projectId?: string;
  budgetCode?: string;
  items: {
    itemId: string;
    quantity: number;
    estimatedUnitPrice: number;
    requiredDate: string;
    warehouseId?: string;
    suggestedVendorId?: string;
    notes?: string;
  }[];
}

export interface UpdatePurchaseRequisitionDto extends Partial<CreatePurchaseRequisitionDto> {
  status?: PRStatus;
}

export interface PurchaseRequisitionFilters {
  status?: PRStatus;
  priority?: PRPriority;
  department?: string;
  requestedBy?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ==================== Mock Data ====================

const USE_MOCK_DATA = true;

const MOCK_PURCHASE_REQUISITIONS: PurchaseRequisition[] = [
  {
    id: 'pr-001',
    prNumber: 'PR-2026-001',
    title: 'Production Raw Materials - Steel',
    description: 'Monthly requirement of steel materials for production line A',
    requestedBy: 'user-001',
    requestedByName: 'James Wilson',
    department: 'Production',
    priority: 'High',
    status: 'Approved',
    requestDate: '2026-01-10',
    requiredDate: '2026-02-01',
    estimatedTotal: 125000,
    currency: 'USD',
    items: [
      {
        id: 'pri-001-1',
        itemId: 'item-001',
        itemCode: 'STL-001',
        itemName: 'Steel Plates 10mm',
        description: 'High-grade carbon steel plates',
        quantity: 500,
        unit: 'KG',
        estimatedUnitPrice: 150,
        estimatedTotalPrice: 75000,
        requiredDate: '2026-02-01',
        warehouseId: 'wh-001',
        warehouseName: 'Main Warehouse',
        suggestedVendorId: 'vendor-001',
        suggestedVendorName: 'Steel Dynamics Inc.'
      },
      {
        id: 'pri-001-2',
        itemId: 'item-002',
        itemCode: 'STL-002',
        itemName: 'Steel Rods 20mm',
        quantity: 250,
        unit: 'KG',
        estimatedUnitPrice: 200,
        estimatedTotalPrice: 50000,
        requiredDate: '2026-02-01',
        warehouseId: 'wh-001',
        warehouseName: 'Main Warehouse',
        suggestedVendorId: 'vendor-001',
        suggestedVendorName: 'Steel Dynamics Inc.'
      }
    ],
    justification: 'Required for Q1 production schedule. Current stock will be depleted by end of January.',
    projectId: 'proj-001',
    projectName: 'Production Line A - Q1 2026',
    budgetCode: 'PROD-2026-Q1',
    approvedBy: 'user-005',
    approvedByName: 'Michael Johnson',
    approvedAt: '2026-01-12T10:00:00Z',
    convertedToPOId: 'po-001',
    convertedToPONumber: 'PO-2026-001',
    convertedAt: '2026-01-15T09:00:00Z',
    createdAt: '2026-01-10T08:30:00Z',
    updatedAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'pr-002',
    prNumber: 'PR-2026-002',
    title: 'Maintenance Spare Parts',
    description: 'Quarterly maintenance spare parts for CNC machines',
    requestedBy: 'user-002',
    requestedByName: 'Robert Chen',
    department: 'Maintenance',
    priority: 'Medium',
    status: 'Pending Approval',
    requestDate: '2026-01-15',
    requiredDate: '2026-02-15',
    estimatedTotal: 45000,
    currency: 'USD',
    items: [
      {
        id: 'pri-002-1',
        itemId: 'item-003',
        itemCode: 'BEAR-001',
        itemName: 'Industrial Bearings',
        description: 'Heavy-duty ball bearings for CNC spindles',
        quantity: 100,
        unit: 'PCS',
        estimatedUnitPrice: 250,
        estimatedTotalPrice: 25000,
        requiredDate: '2026-02-15',
        warehouseId: 'wh-002',
        warehouseName: 'Parts Warehouse'
      },
      {
        id: 'pri-002-2',
        itemId: 'item-004',
        itemCode: 'BELT-001',
        itemName: 'Drive Belts',
        quantity: 50,
        unit: 'PCS',
        estimatedUnitPrice: 400,
        estimatedTotalPrice: 20000,
        requiredDate: '2026-02-15',
        warehouseId: 'wh-002',
        warehouseName: 'Parts Warehouse'
      }
    ],
    justification: 'Scheduled maintenance for CNC machines in production hall B',
    budgetCode: 'MAINT-2026-Q1',
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-01-15T11:00:00Z'
  },
  {
    id: 'pr-003',
    prNumber: 'PR-2026-003',
    title: 'Office Supplies - Admin Department',
    description: 'Monthly office supplies for administrative staff',
    requestedBy: 'user-003',
    requestedByName: 'Sarah Davis',
    department: 'Administration',
    priority: 'Low',
    status: 'Approved',
    requestDate: '2026-01-08',
    requiredDate: '2026-01-20',
    estimatedTotal: 3500,
    currency: 'USD',
    items: [
      {
        id: 'pri-003-1',
        itemId: 'item-030',
        itemCode: 'OFF-001',
        itemName: 'Printer Paper A4',
        quantity: 100,
        unit: 'REAM',
        estimatedUnitPrice: 15,
        estimatedTotalPrice: 1500,
        requiredDate: '2026-01-20',
        warehouseId: 'wh-008',
        warehouseName: 'Office Supplies'
      },
      {
        id: 'pri-003-2',
        itemId: 'item-031',
        itemCode: 'OFF-002',
        itemName: 'Printer Toner Cartridge',
        quantity: 20,
        unit: 'PCS',
        estimatedUnitPrice: 100,
        estimatedTotalPrice: 2000,
        requiredDate: '2026-01-20',
        warehouseId: 'wh-008',
        warehouseName: 'Office Supplies'
      }
    ],
    justification: 'Regular monthly office supply replenishment',
    budgetCode: 'ADMIN-2026-Q1',
    approvedBy: 'user-006',
    approvedByName: 'Lisa Anderson',
    approvedAt: '2026-01-09T14:00:00Z',
    createdAt: '2026-01-08T09:00:00Z',
    updatedAt: '2026-01-09T14:00:00Z'
  },
  {
    id: 'pr-004',
    prNumber: 'PR-2026-004',
    title: 'Urgent Repair Parts - Hydraulic System',
    description: 'Emergency parts for hydraulic press breakdown',
    requestedBy: 'user-002',
    requestedByName: 'Robert Chen',
    department: 'Maintenance',
    priority: 'Urgent',
    status: 'Converted to PO',
    requestDate: '2026-01-18',
    requiredDate: '2026-01-22',
    estimatedTotal: 28000,
    currency: 'USD',
    items: [
      {
        id: 'pri-004-1',
        itemId: 'item-021',
        itemCode: 'HYD-001',
        itemName: 'Hydraulic Cylinders',
        description: 'Replacement cylinder for 500-ton press',
        quantity: 2,
        unit: 'PCS',
        estimatedUnitPrice: 8500,
        estimatedTotalPrice: 17000,
        requiredDate: '2026-01-22',
        warehouseId: 'wh-004',
        warehouseName: 'Equipment Warehouse',
        suggestedVendorId: 'vendor-009',
        suggestedVendorName: 'HydraulicPro Systems'
      },
      {
        id: 'pri-004-2',
        itemId: 'item-023',
        itemCode: 'HYD-003',
        itemName: 'Hydraulic Seals Kit',
        quantity: 5,
        unit: 'SET',
        estimatedUnitPrice: 2200,
        estimatedTotalPrice: 11000,
        requiredDate: '2026-01-22',
        warehouseId: 'wh-004',
        warehouseName: 'Equipment Warehouse'
      }
    ],
    justification: 'Emergency repair required - production line stopped due to hydraulic press failure',
    approvedBy: 'user-005',
    approvedByName: 'Michael Johnson',
    approvedAt: '2026-01-18T14:30:00Z',
    convertedToPOId: 'po-011',
    convertedToPONumber: 'PO-2026-011',
    convertedAt: '2026-01-18T15:00:00Z',
    createdAt: '2026-01-18T13:00:00Z',
    updatedAt: '2026-01-18T15:00:00Z'
  },
  {
    id: 'pr-005',
    prNumber: 'PR-2026-005',
    title: 'Chemical Supplies - Production',
    description: 'Monthly chemical supplies for surface treatment process',
    requestedBy: 'user-004',
    requestedByName: 'Emily Watson',
    department: 'Production',
    priority: 'High',
    status: 'Approved',
    requestDate: '2026-01-05',
    requiredDate: '2026-01-25',
    estimatedTotal: 52000,
    currency: 'USD',
    items: [
      {
        id: 'pri-005-1',
        itemId: 'item-005',
        itemCode: 'CHEM-001',
        itemName: 'Industrial Lubricant',
        description: 'High-performance machine lubricant',
        quantity: 200,
        unit: 'LTR',
        estimatedUnitPrice: 130,
        estimatedTotalPrice: 26000,
        requiredDate: '2026-01-25',
        warehouseId: 'wh-003',
        warehouseName: 'Chemical Storage',
        suggestedVendorId: 'vendor-003',
        suggestedVendorName: 'Chemical Solutions Corp.'
      },
      {
        id: 'pri-005-2',
        itemId: 'item-006',
        itemCode: 'CHEM-002',
        itemName: 'Coolant Fluid',
        quantity: 100,
        unit: 'LTR',
        estimatedUnitPrice: 200,
        estimatedTotalPrice: 20000,
        requiredDate: '2026-01-25',
        warehouseId: 'wh-003',
        warehouseName: 'Chemical Storage'
      },
      {
        id: 'pri-005-3',
        itemId: 'item-024',
        itemCode: 'CHEM-003',
        itemName: 'Degreaser Solution',
        quantity: 50,
        unit: 'LTR',
        estimatedUnitPrice: 120,
        estimatedTotalPrice: 6000,
        requiredDate: '2026-01-25',
        warehouseId: 'wh-003',
        warehouseName: 'Chemical Storage'
      }
    ],
    justification: 'Required for surface treatment process in production line C',
    projectId: 'proj-003',
    projectName: 'Surface Treatment Line - 2026',
    budgetCode: 'PROD-2026-CHEM',
    approvedBy: 'user-005',
    approvedByName: 'Michael Johnson',
    approvedAt: '2026-01-07T09:30:00Z',
    convertedToPOId: 'po-003',
    convertedToPONumber: 'PO-2026-003',
    convertedAt: '2026-01-10T15:00:00Z',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-10T15:00:00Z'
  },
  {
    id: 'pr-006',
    prNumber: 'PR-2026-006',
    title: 'Safety Equipment - Annual Replenishment',
    description: 'Annual safety equipment replenishment for all departments',
    requestedBy: 'user-007',
    requestedByName: 'Tom Garcia',
    department: 'Safety',
    priority: 'Medium',
    status: 'Draft',
    requestDate: '2026-01-20',
    requiredDate: '2026-02-28',
    estimatedTotal: 35000,
    currency: 'USD',
    items: [
      {
        id: 'pri-006-1',
        itemId: 'item-018',
        itemCode: 'SAFE-001',
        itemName: 'Safety Helmets',
        quantity: 300,
        unit: 'PCS',
        estimatedUnitPrice: 35,
        estimatedTotalPrice: 10500,
        requiredDate: '2026-02-28',
        warehouseId: 'wh-007',
        warehouseName: 'Safety Stock'
      },
      {
        id: 'pri-006-2',
        itemId: 'item-019',
        itemCode: 'SAFE-002',
        itemName: 'Safety Goggles',
        quantity: 400,
        unit: 'PCS',
        estimatedUnitPrice: 25,
        estimatedTotalPrice: 10000,
        requiredDate: '2026-02-28',
        warehouseId: 'wh-007',
        warehouseName: 'Safety Stock'
      },
      {
        id: 'pri-006-3',
        itemId: 'item-020',
        itemCode: 'SAFE-003',
        itemName: 'Work Gloves',
        quantity: 800,
        unit: 'PAIR',
        estimatedUnitPrice: 18,
        estimatedTotalPrice: 14400,
        requiredDate: '2026-02-28',
        warehouseId: 'wh-007',
        warehouseName: 'Safety Stock'
      }
    ],
    justification: 'Annual replenishment as per safety compliance requirements',
    budgetCode: 'SAFETY-2026',
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-01-20T14:00:00Z'
  },
  {
    id: 'pr-007',
    prNumber: 'PR-2026-007',
    title: 'Tooling - New CNC Project',
    description: 'Specialized tooling for new CNC machining project',
    requestedBy: 'user-001',
    requestedByName: 'James Wilson',
    department: 'Production',
    priority: 'High',
    status: 'Rejected',
    requestDate: '2026-01-12',
    requiredDate: '2026-02-10',
    estimatedTotal: 95000,
    currency: 'USD',
    items: [
      {
        id: 'pri-007-1',
        itemId: 'item-014',
        itemCode: 'TOOL-001',
        itemName: 'CNC End Mills Set',
        description: 'Premium carbide end mills for precision work',
        quantity: 30,
        unit: 'SET',
        estimatedUnitPrice: 1800,
        estimatedTotalPrice: 54000,
        requiredDate: '2026-02-10',
        warehouseId: 'wh-006',
        warehouseName: 'Tool Crib'
      },
      {
        id: 'pri-007-2',
        itemId: 'item-025',
        itemCode: 'TOOL-003',
        itemName: 'Custom Fixture Set',
        quantity: 5,
        unit: 'SET',
        estimatedUnitPrice: 8200,
        estimatedTotalPrice: 41000,
        requiredDate: '2026-02-10',
        warehouseId: 'wh-006',
        warehouseName: 'Tool Crib'
      }
    ],
    justification: 'Required for new aerospace component project starting Q2',
    projectId: 'proj-005',
    projectName: 'Aerospace Components - Phase 1',
    budgetCode: 'PROJ-AERO-2026',
    rejectedBy: 'user-005',
    rejectedByName: 'Michael Johnson',
    rejectedAt: '2026-01-14T11:00:00Z',
    rejectionReason: 'Budget not approved for this project yet. Please resubmit after Q1 budget review.',
    createdAt: '2026-01-12T15:00:00Z',
    updatedAt: '2026-01-14T11:00:00Z'
  },
  {
    id: 'pr-008',
    prNumber: 'PR-2026-008',
    title: 'Packaging Materials - Q1',
    description: 'Packaging materials for Q1 shipments',
    requestedBy: 'user-008',
    requestedByName: 'Kevin Brown',
    department: 'Logistics',
    priority: 'Medium',
    status: 'Approved',
    requestDate: '2026-01-18',
    requiredDate: '2026-02-10',
    estimatedTotal: 32000,
    currency: 'USD',
    items: [
      {
        id: 'pri-008-1',
        itemId: 'item-012',
        itemCode: 'PACK-001',
        itemName: 'Corrugated Boxes Large',
        quantity: 2000,
        unit: 'PCS',
        estimatedUnitPrice: 8,
        estimatedTotalPrice: 16000,
        requiredDate: '2026-02-10',
        warehouseId: 'wh-005',
        warehouseName: 'Packaging Warehouse'
      },
      {
        id: 'pri-008-2',
        itemId: 'item-013',
        itemCode: 'PACK-002',
        itemName: 'Pallet Wrap',
        quantity: 100,
        unit: 'ROLL',
        estimatedUnitPrice: 160,
        estimatedTotalPrice: 16000,
        requiredDate: '2026-02-10',
        warehouseId: 'wh-005',
        warehouseName: 'Packaging Warehouse'
      }
    ],
    justification: 'Standard Q1 packaging material order based on sales forecast',
    budgetCode: 'LOG-2026-Q1',
    approvedBy: 'user-006',
    approvedByName: 'Lisa Anderson',
    approvedAt: '2026-01-19T10:00:00Z',
    convertedToPOId: 'po-006',
    convertedToPONumber: 'PO-2026-006',
    convertedAt: '2026-01-22T09:00:00Z',
    createdAt: '2026-01-18T08:30:00Z',
    updatedAt: '2026-01-22T09:00:00Z'
  },
  {
    id: 'pr-009',
    prNumber: 'PR-2026-009',
    title: 'IT Equipment - Development Team',
    description: 'New workstations and peripherals for expanding development team',
    requestedBy: 'user-009',
    requestedByName: 'Anna Lee',
    department: 'IT',
    priority: 'Medium',
    status: 'Pending Approval',
    requestDate: '2026-01-22',
    requiredDate: '2026-03-01',
    estimatedTotal: 75000,
    currency: 'USD',
    items: [
      {
        id: 'pri-009-1',
        itemId: 'item-026',
        itemCode: 'IT-001',
        itemName: 'Developer Workstation',
        description: 'High-performance workstation with 32GB RAM',
        quantity: 10,
        unit: 'PCS',
        estimatedUnitPrice: 4500,
        estimatedTotalPrice: 45000,
        requiredDate: '2026-03-01',
        warehouseId: 'wh-009',
        warehouseName: 'IT Storage'
      },
      {
        id: 'pri-009-2',
        itemId: 'item-027',
        itemCode: 'IT-002',
        itemName: '27" 4K Monitor',
        quantity: 20,
        unit: 'PCS',
        estimatedUnitPrice: 800,
        estimatedTotalPrice: 16000,
        requiredDate: '2026-03-01',
        warehouseId: 'wh-009',
        warehouseName: 'IT Storage'
      },
      {
        id: 'pri-009-3',
        itemId: 'item-028',
        itemCode: 'IT-003',
        itemName: 'Mechanical Keyboard',
        quantity: 10,
        unit: 'PCS',
        estimatedUnitPrice: 200,
        estimatedTotalPrice: 2000,
        requiredDate: '2026-03-01',
        warehouseId: 'wh-009',
        warehouseName: 'IT Storage'
      },
      {
        id: 'pri-009-4',
        itemId: 'item-029',
        itemCode: 'IT-004',
        itemName: 'Ergonomic Mouse',
        quantity: 10,
        unit: 'PCS',
        estimatedUnitPrice: 120,
        estimatedTotalPrice: 1200,
        requiredDate: '2026-03-01',
        warehouseId: 'wh-009',
        warehouseName: 'IT Storage'
      }
    ],
    justification: 'Expanding development team by 10 members in Q1. Equipment needed before onboarding.',
    projectId: 'proj-006',
    projectName: 'IT Infrastructure Expansion 2026',
    budgetCode: 'IT-2026-CAPEX',
    createdAt: '2026-01-22T11:00:00Z',
    updatedAt: '2026-01-22T11:00:00Z'
  },
  {
    id: 'pr-010',
    prNumber: 'PR-2026-010',
    title: 'Electrical Components - Panel Upgrade',
    description: 'Electrical components for control panel upgrade project',
    requestedBy: 'user-002',
    requestedByName: 'Robert Chen',
    department: 'Maintenance',
    priority: 'High',
    status: 'Cancelled',
    requestDate: '2026-01-08',
    requiredDate: '2026-02-05',
    estimatedTotal: 68000,
    currency: 'USD',
    items: [
      {
        id: 'pri-010-1',
        itemId: 'item-007',
        itemCode: 'ELEC-001',
        itemName: 'Industrial Motors 5HP',
        quantity: 20,
        unit: 'PCS',
        estimatedUnitPrice: 1200,
        estimatedTotalPrice: 24000,
        requiredDate: '2026-02-05',
        warehouseId: 'wh-004',
        warehouseName: 'Equipment Warehouse'
      },
      {
        id: 'pri-010-2',
        itemId: 'item-008',
        itemCode: 'ELEC-002',
        itemName: 'Control Panels',
        quantity: 10,
        unit: 'PCS',
        estimatedUnitPrice: 3200,
        estimatedTotalPrice: 32000,
        requiredDate: '2026-02-05',
        warehouseId: 'wh-004',
        warehouseName: 'Equipment Warehouse'
      },
      {
        id: 'pri-010-3',
        itemId: 'item-032',
        itemCode: 'ELEC-003',
        itemName: 'Circuit Breakers',
        quantity: 50,
        unit: 'PCS',
        estimatedUnitPrice: 240,
        estimatedTotalPrice: 12000,
        requiredDate: '2026-02-05',
        warehouseId: 'wh-004',
        warehouseName: 'Equipment Warehouse'
      }
    ],
    justification: 'Control panel upgrade for production lines A and B',
    projectId: 'proj-004',
    projectName: 'Control Panel Modernization',
    budgetCode: 'MAINT-2026-CAPEX',
    approvedBy: 'user-005',
    approvedByName: 'Michael Johnson',
    approvedAt: '2026-01-10T11:00:00Z',
    createdAt: '2026-01-08T14:00:00Z',
    updatedAt: '2026-01-16T09:00:00Z'
  }
];

// ==================== Service Class ====================

class PurchaseRequisitionService {
  private async simulateDelay(ms: number = 300): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllRequisitions(filters?: PurchaseRequisitionFilters): Promise<{ data: PurchaseRequisition[]; total: number }> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();

      let filteredData = [...MOCK_PURCHASE_REQUISITIONS];

      if (filters) {
        if (filters.status) {
          filteredData = filteredData.filter(pr => pr.status === filters.status);
        }
        if (filters.priority) {
          filteredData = filteredData.filter(pr => pr.priority === filters.priority);
        }
        if (filters.department) {
          filteredData = filteredData.filter(pr => pr.department === filters.department);
        }
        if (filters.requestedBy) {
          filteredData = filteredData.filter(pr => pr.requestedBy === filters.requestedBy);
        }
        if (filters.fromDate) {
          filteredData = filteredData.filter(pr => pr.requestDate >= filters.fromDate!);
        }
        if (filters.toDate) {
          filteredData = filteredData.filter(pr => pr.requestDate <= filters.toDate!);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(pr =>
            pr.prNumber.toLowerCase().includes(searchLower) ||
            pr.title.toLowerCase().includes(searchLower) ||
            pr.requestedByName.toLowerCase().includes(searchLower) ||
            pr.department.toLowerCase().includes(searchLower)
          );
        }
      }

      return { data: filteredData, total: filteredData.length };
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }

    const response = await apiClient.get<{ data: PurchaseRequisition[]; total: number }>(
      `/procurement/purchase-requisitions?${params.toString()}`
    );
    return response.data;
  }

  async getRequisitionById(id: string): Promise<PurchaseRequisition> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const pr = MOCK_PURCHASE_REQUISITIONS.find(p => p.id === id);
      if (!pr) {
        throw new Error('Purchase Requisition not found');
      }
      return pr;
    }

    const response = await apiClient.get<PurchaseRequisition>(`/procurement/purchase-requisitions/${id}`);
    return response.data;
  }

  async createRequisition(data: CreatePurchaseRequisitionDto): Promise<PurchaseRequisition> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const newPR: PurchaseRequisition = {
        id: `pr-${Date.now()}`,
        prNumber: `PR-2026-${String(MOCK_PURCHASE_REQUISITIONS.length + 1).padStart(3, '0')}`,
        title: data.title,
        description: data.description,
        requestedBy: 'user-current',
        requestedByName: 'Current User',
        department: data.department,
        priority: data.priority,
        status: 'Draft',
        requestDate: new Date().toISOString().split('T')[0],
        requiredDate: data.requiredDate,
        estimatedTotal: 0,
        currency: data.currency,
        items: [],
        justification: data.justification,
        projectId: data.projectId,
        budgetCode: data.budgetCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      MOCK_PURCHASE_REQUISITIONS.push(newPR);
      return newPR;
    }

    const response = await apiClient.post<PurchaseRequisition>('/procurement/purchase-requisitions', data);
    return response.data;
  }

  async updateRequisition(id: string, data: UpdatePurchaseRequisitionDto): Promise<PurchaseRequisition> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const index = MOCK_PURCHASE_REQUISITIONS.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Purchase Requisition not found');
      }
      MOCK_PURCHASE_REQUISITIONS[index] = {
        ...MOCK_PURCHASE_REQUISITIONS[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return MOCK_PURCHASE_REQUISITIONS[index];
    }

    const response = await apiClient.put<PurchaseRequisition>(`/procurement/purchase-requisitions/${id}`, data);
    return response.data;
  }

  async submitRequisition(id: string): Promise<PurchaseRequisition> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const index = MOCK_PURCHASE_REQUISITIONS.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Purchase Requisition not found');
      }
      MOCK_PURCHASE_REQUISITIONS[index] = {
        ...MOCK_PURCHASE_REQUISITIONS[index],
        status: 'Pending Approval',
        updatedAt: new Date().toISOString()
      };
      return MOCK_PURCHASE_REQUISITIONS[index];
    }

    const response = await apiClient.post<PurchaseRequisition>(`/procurement/purchase-requisitions/${id}/submit`, {});
    return response.data;
  }

  async approveRequisition(id: string): Promise<PurchaseRequisition> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const index = MOCK_PURCHASE_REQUISITIONS.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Purchase Requisition not found');
      }
      MOCK_PURCHASE_REQUISITIONS[index] = {
        ...MOCK_PURCHASE_REQUISITIONS[index],
        status: 'Approved',
        approvedBy: 'user-current',
        approvedByName: 'Current User',
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return MOCK_PURCHASE_REQUISITIONS[index];
    }

    const response = await apiClient.post<PurchaseRequisition>(`/procurement/purchase-requisitions/${id}/approve`, {});
    return response.data;
  }

  async rejectRequisition(id: string, reason: string): Promise<PurchaseRequisition> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(500);
      const index = MOCK_PURCHASE_REQUISITIONS.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Purchase Requisition not found');
      }
      MOCK_PURCHASE_REQUISITIONS[index] = {
        ...MOCK_PURCHASE_REQUISITIONS[index],
        status: 'Rejected',
        rejectedBy: 'user-current',
        rejectedByName: 'Current User',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
        updatedAt: new Date().toISOString()
      };
      return MOCK_PURCHASE_REQUISITIONS[index];
    }

    const response = await apiClient.post<PurchaseRequisition>(`/procurement/purchase-requisitions/${id}/reject`, { reason });
    return response.data;
  }

  async convertToPO(id: string): Promise<{ requisition: PurchaseRequisition; poId: string; poNumber: string }> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay(800);
      const index = MOCK_PURCHASE_REQUISITIONS.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Purchase Requisition not found');
      }

      const poId = `po-${Date.now()}`;
      const poNumber = `PO-2026-${String(Date.now()).slice(-3)}`;

      MOCK_PURCHASE_REQUISITIONS[index] = {
        ...MOCK_PURCHASE_REQUISITIONS[index],
        status: 'Converted to PO',
        convertedToPOId: poId,
        convertedToPONumber: poNumber,
        convertedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        requisition: MOCK_PURCHASE_REQUISITIONS[index],
        poId,
        poNumber
      };
    }

    const response = await apiClient.post<{ requisition: PurchaseRequisition; poId: string; poNumber: string }>(
      `/procurement/purchase-requisitions/${id}/convert-to-po`,
      {}
    );
    return response.data;
  }

  async getPendingApprovals(): Promise<PurchaseRequisition[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return MOCK_PURCHASE_REQUISITIONS.filter(pr => pr.status === 'Pending Approval');
    }

    const response = await apiClient.get<PurchaseRequisition[]>('/procurement/purchase-requisitions/pending-approvals');
    return response.data;
  }

  async getDepartmentSummary(): Promise<{ department: string; count: number; totalValue: number }[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const summary = MOCK_PURCHASE_REQUISITIONS.reduce((acc, pr) => {
        const existing = acc.find(s => s.department === pr.department);
        if (existing) {
          existing.count++;
          existing.totalValue += pr.estimatedTotal;
        } else {
          acc.push({
            department: pr.department,
            count: 1,
            totalValue: pr.estimatedTotal
          });
        }
        return acc;
      }, [] as { department: string; count: number; totalValue: number }[]);

      return summary;
    }

    const response = await apiClient.get<{ department: string; count: number; totalValue: number }[]>(
      '/procurement/purchase-requisitions/department-summary'
    );
    return response.data;
  }
}

export const purchaseRequisitionService = new PurchaseRequisitionService();
