'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  FileText,
  Settings,
  Users,
  Calendar,
  Factory,
  Wrench,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Zap,
  ShoppingCart,
  User,
  MapPin,
  IndianRupee,
  Hash,
  FileCheck,
  Download,
  Printer,
  Share2,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  StopCircle,
  ListChecks,
  Layers,
  Timer,
  Gauge,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Box,
  Truck,
} from 'lucide-react';

// TypeScript Interfaces
interface WorkOrder {
  id: string;
  woNumber: string;
  productCode: string;
  productName: string;
  productDescription: string;
  drawingNumber: string;
  revision: string;
  status: 'draft' | 'released' | 'in_progress' | 'on_hold' | 'completed' | 'closed' | 'cancelled';
  plannedQty: number;
  completedQty: number;
  rejectedQty: number;
  reworkQty: number;
  uom: string;
  completionPercentage: number;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate: string;
  actualEndDate: string;
  plannedDuration: number;
  actualDuration: number;
  salesOrderRef: string;
  customerName: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  workCenter: string;
  secondaryWorkCenters: string[];
  shift: string;
  supervisor: string;
  foreman: string;
  bomRef: string;
  routingRef: string;
  specialInstructions: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
}

interface MaterialRequirement {
  id: string;
  itemCode: string;
  description: string;
  requiredQty: number;
  issuedQty: number;
  consumedQty: number;
  variance: number;
  uom: string;
  stockAvailable: number;
  stockStatus: 'available' | 'shortage' | 'critical';
}

interface Operation {
  id: string;
  sequence: number;
  operationName: string;
  workCenter: string;
  setupTime: number;
  runTime: number;
  plannedStart: string;
  actualStart: string;
  plannedEnd: string;
  actualEnd: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  operator: string;
  completionPercentage: number;
}

interface ProgressTracking {
  id: string;
  date: string;
  shift: string;
  quantityProduced: number;
  quantityRejected: number;
  quantityRework: number;
  operator: string;
  remarks: string;
}

interface DowntimeRecord {
  id: string;
  date: string;
  shift: string;
  reason: 'breakdown' | 'material_shortage' | 'power_cut' | 'change_over' | 'quality_issue' | 'other';
  duration: number;
  description: string;
  actionTaken: string;
}

interface QualityRecord {
  id: string;
  inspectionType: 'in_process' | 'final';
  date: string;
  inspector: string;
  parameter: string;
  specification: string;
  actualValue: string;
  result: 'pass' | 'fail';
  remarks: string;
}

interface RejectionDetail {
  id: string;
  date: string;
  quantity: number;
  reason: string;
  disposition: 'rework' | 'scrap' | 'use_as_is';
  approvedBy: string;
}

interface ActivityLog {
  id: string;
  date: string;
  time: string;
  action: string;
  performedBy: string;
  details: string;
}

// Mock data
const mockWorkOrder: WorkOrder = {
  id: '1',
  woNumber: 'WO-2025-00143',
  productCode: 'MKC-CAB-001',
  productName: 'Premium Modular Kitchen Cabinet - Upper Unit',
  productDescription: '900mm x 600mm x 300mm Wall-mounted Cabinet with Soft-close Hinges',
  drawingNumber: 'DRG-MKC-001-Rev3',
  revision: 'C',
  status: 'in_progress',
  plannedQty: 50,
  completedQty: 32,
  rejectedQty: 2,
  reworkQty: 1,
  uom: 'Pcs',
  completionPercentage: 64,
  plannedStartDate: '2025-10-10',
  plannedEndDate: '2025-10-20',
  actualStartDate: '2025-10-10',
  actualEndDate: '',
  plannedDuration: 10,
  actualDuration: 7,
  salesOrderRef: 'SO-2025-0892',
  customerName: 'Sharma Modular Kitchens Pvt Ltd',
  dueDate: '2025-10-22',
  priority: 'High',
  workCenter: 'Assembly Line 1',
  secondaryWorkCenters: ['Machining Center', 'Paint Shop'],
  shift: 'Morning/Afternoon',
  supervisor: 'Rajesh Kumar',
  foreman: 'Amit Patel',
  bomRef: 'BOM-MKC-CAB-001-Rev2',
  routingRef: 'RTG-MKC-CAB-001',
  specialInstructions: 'Customer requires premium finish. Use German hinges (Blum brand). Ensure edge banding is perfect. Test all soft-close mechanisms before packing.',
  materialCost: 145000,
  laborCost: 35000,
  overheadCost: 22000,
  totalCost: 202000,
};

const mockMaterials: MaterialRequirement[] = [
  {
    id: '1',
    itemCode: 'PLY-18MM-BWP',
    description: 'BWP Plywood 18mm - 8ft x 4ft (IS 303)',
    requiredQty: 25,
    issuedQty: 25,
    consumedQty: 23,
    variance: 2,
    uom: 'Sheets',
    stockAvailable: 150,
    stockStatus: 'available',
  },
  {
    id: '2',
    itemCode: 'HNG-BLM-165',
    description: 'Blum Soft-close Hinges 165° - European Standard',
    requiredQty: 200,
    issuedQty: 200,
    consumedQty: 196,
    variance: 4,
    uom: 'Pcs',
    stockAvailable: 850,
    stockStatus: 'available',
  },
  {
    id: '3',
    itemCode: 'HDWR-KNB-SS',
    description: 'Stainless Steel Cabinet Handles - Chrome Finish',
    requiredQty: 100,
    issuedQty: 100,
    consumedQty: 98,
    variance: 2,
    uom: 'Pcs',
    stockAvailable: 450,
    stockStatus: 'available',
  },
  {
    id: '4',
    itemCode: 'LMNT-PVC-2MM',
    description: 'PVC Edge Banding - Oak Finish 2mm x 50m',
    requiredQty: 15,
    issuedQty: 12,
    consumedQty: 11,
    variance: 1,
    uom: 'Rolls',
    stockAvailable: 8,
    stockStatus: 'shortage',
  },
  {
    id: '5',
    itemCode: 'PAINT-PU-WHT',
    description: 'Polyurethane Paint - Pure White Matt Finish',
    requiredQty: 20,
    issuedQty: 18,
    consumedQty: 17,
    variance: 1,
    uom: 'Ltrs',
    stockAvailable: 45,
    stockStatus: 'available',
  },
];

const mockOperations: Operation[] = [
  {
    id: '1',
    sequence: 10,
    operationName: 'Cutting & Sizing',
    workCenter: 'CNC Cutting Center',
    setupTime: 30,
    runTime: 240,
    plannedStart: '2025-10-10 08:00',
    actualStart: '2025-10-10 08:15',
    plannedEnd: '2025-10-10 12:30',
    actualEnd: '2025-10-10 12:45',
    status: 'completed',
    operator: 'Vijay Singh',
    completionPercentage: 100,
  },
  {
    id: '2',
    sequence: 20,
    operationName: 'Edge Banding',
    workCenter: 'Edge Banding Machine',
    setupTime: 20,
    runTime: 180,
    plannedStart: '2025-10-11 08:00',
    actualStart: '2025-10-11 08:10',
    plannedEnd: '2025-10-11 11:20',
    actualEnd: '2025-10-11 11:35',
    status: 'completed',
    operator: 'Suresh Yadav',
    completionPercentage: 100,
  },
  {
    id: '3',
    sequence: 30,
    operationName: 'Drilling & Hardware Mounting',
    workCenter: 'Assembly Line 1',
    setupTime: 15,
    runTime: 360,
    plannedStart: '2025-10-12 08:00',
    actualStart: '2025-10-12 08:05',
    plannedEnd: '2025-10-12 14:15',
    actualEnd: '2025-10-12 14:30',
    status: 'completed',
    operator: 'Ramesh Kumar',
    completionPercentage: 100,
  },
  {
    id: '4',
    sequence: 40,
    operationName: 'Painting & Finishing',
    workCenter: 'Paint Shop',
    setupTime: 45,
    runTime: 420,
    plannedStart: '2025-10-15 08:00',
    actualStart: '2025-10-15 08:30',
    plannedEnd: '2025-10-15 15:45',
    actualEnd: '',
    status: 'in_progress',
    operator: 'Anil Sharma',
    completionPercentage: 65,
  },
  {
    id: '5',
    sequence: 50,
    operationName: 'Quality Inspection',
    workCenter: 'QC Station',
    setupTime: 10,
    runTime: 90,
    plannedStart: '2025-10-18 08:00',
    actualStart: '',
    plannedEnd: '2025-10-18 09:40',
    actualEnd: '',
    status: 'pending',
    operator: 'QC Team',
    completionPercentage: 0,
  },
  {
    id: '6',
    sequence: 60,
    operationName: 'Packing & Dispatch',
    workCenter: 'Packing Station',
    setupTime: 15,
    runTime: 120,
    plannedStart: '2025-10-19 08:00',
    actualStart: '',
    plannedEnd: '2025-10-19 10:15',
    actualEnd: '',
    status: 'pending',
    operator: 'Packing Team',
    completionPercentage: 0,
  },
];

const mockProgressTracking: ProgressTracking[] = [
  {
    id: '1',
    date: '2025-10-15',
    shift: 'Morning',
    quantityProduced: 8,
    quantityRejected: 0,
    quantityRework: 0,
    operator: 'Anil Sharma',
    remarks: 'Smooth operation. Good finish quality.',
  },
  {
    id: '2',
    date: '2025-10-15',
    shift: 'Afternoon',
    quantityProduced: 7,
    quantityRejected: 1,
    quantityRework: 0,
    operator: 'Anil Sharma',
    remarks: '1 pc rejected due to paint runs. To be reworked.',
  },
  {
    id: '3',
    date: '2025-10-16',
    shift: 'Morning',
    quantityProduced: 9,
    quantityRejected: 0,
    quantityRework: 1,
    operator: 'Anil Sharma',
    remarks: 'Completed rework. All good.',
  },
  {
    id: '4',
    date: '2025-10-16',
    shift: 'Afternoon',
    quantityProduced: 8,
    quantityRejected: 1,
    quantityRework: 0,
    operator: 'Anil Sharma',
    remarks: '1 pc rejected - surface scratches. Scrap.',
  },
];

const mockDowntimeRecords: DowntimeRecord[] = [
  {
    id: '1',
    date: '2025-10-14',
    shift: 'Morning',
    reason: 'material_shortage',
    duration: 120,
    description: 'Edge banding material shortage. Production stopped.',
    actionTaken: 'Emergency purchase from local supplier. Material arrived at 11:30 AM.',
  },
  {
    id: '2',
    date: '2025-10-15',
    shift: 'Afternoon',
    reason: 'breakdown',
    duration: 45,
    description: 'Paint spray gun malfunction. Nozzle blocked.',
    actionTaken: 'Maintenance team cleaned and replaced nozzle. Back in operation.',
  },
  {
    id: '3',
    date: '2025-10-16',
    shift: 'Morning',
    reason: 'change_over',
    duration: 30,
    description: 'Change over from white to oak finish paint.',
    actionTaken: 'Cleaned spray booth and changed paint batch. Standard procedure.',
  },
];

const mockQualityRecords: QualityRecord[] = [
  {
    id: '1',
    inspectionType: 'in_process',
    date: '2025-10-12',
    inspector: 'Priya Desai',
    parameter: 'Edge Banding Adhesion',
    specification: 'No gaps, smooth finish',
    actualValue: 'Perfect adhesion, no gaps',
    result: 'pass',
    remarks: 'All samples passed inspection.',
  },
  {
    id: '2',
    inspectionType: 'in_process',
    date: '2025-10-13',
    inspector: 'Priya Desai',
    parameter: 'Drilling Accuracy',
    specification: '± 0.5mm tolerance',
    actualValue: '± 0.3mm',
    result: 'pass',
    remarks: 'Within tolerance. Good accuracy.',
  },
  {
    id: '3',
    inspectionType: 'in_process',
    date: '2025-10-15',
    inspector: 'Priya Desai',
    parameter: 'Paint Finish Quality',
    specification: 'Smooth, no runs, uniform',
    actualValue: '2 pcs with paint runs',
    result: 'fail',
    remarks: '2 pieces rejected for rework.',
  },
  {
    id: '4',
    inspectionType: 'in_process',
    date: '2025-10-16',
    inspector: 'Priya Desai',
    parameter: 'Soft-close Mechanism',
    specification: 'Smooth closing, no noise',
    actualValue: 'All hinges working perfectly',
    result: 'pass',
    remarks: 'German hinges performing excellently.',
  },
];

const mockRejectionDetails: RejectionDetail[] = [
  {
    id: '1',
    date: '2025-10-15',
    quantity: 1,
    reason: 'Paint runs on surface - unacceptable finish quality',
    disposition: 'rework',
    approvedBy: 'Rajesh Kumar',
  },
  {
    id: '2',
    date: '2025-10-16',
    quantity: 1,
    reason: 'Deep scratches on door panel during handling',
    disposition: 'scrap',
    approvedBy: 'Rajesh Kumar',
  },
];

const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    date: '2025-10-10',
    time: '08:00',
    action: 'Work Order Released',
    performedBy: 'Rajesh Kumar',
    details: 'WO released to production floor for execution',
  },
  {
    id: '2',
    date: '2025-10-10',
    time: '08:15',
    action: 'Production Started',
    performedBy: 'Vijay Singh',
    details: 'Started Cutting & Sizing operation',
  },
  {
    id: '3',
    date: '2025-10-10',
    time: '09:30',
    action: 'Material Issued',
    performedBy: 'Store Keeper',
    details: 'All materials issued from warehouse to production',
  },
  {
    id: '4',
    date: '2025-10-12',
    time: '10:30',
    action: 'Quality Inspection Completed',
    performedBy: 'Priya Desai',
    details: 'In-process inspection for drilling accuracy - Passed',
  },
  {
    id: '5',
    date: '2025-10-14',
    time: '09:15',
    action: 'Downtime Recorded',
    performedBy: 'Rajesh Kumar',
    details: 'Material shortage - Edge banding. 2 hours downtime.',
  },
  {
    id: '6',
    date: '2025-10-15',
    time: '15:30',
    action: 'Rejection Recorded',
    performedBy: 'Anil Sharma',
    details: '1 pc rejected due to paint runs. Sent for rework.',
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  released: 'bg-blue-100 text-blue-700 border-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  on_hold: 'bg-orange-100 text-orange-700 border-orange-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
  closed: 'bg-purple-100 text-purple-700 border-purple-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
};

const priorityColors = {
  Low: 'bg-gray-100 text-gray-700',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

const stockStatusColors = {
  available: 'bg-green-100 text-green-700',
  shortage: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const operationStatusColors = {
  pending: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  on_hold: 'bg-orange-100 text-orange-700',
};

const downtimeReasonColors = {
  breakdown: 'bg-red-100 text-red-700',
  material_shortage: 'bg-orange-100 text-orange-700',
  power_cut: 'bg-purple-100 text-purple-700',
  change_over: 'bg-blue-100 text-blue-700',
  quality_issue: 'bg-yellow-100 text-yellow-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function ViewWorkOrderPage() {
  const router = useRouter();
  const params = useParams();
  const workOrderId = params.id as string;
  const workOrder = mockWorkOrder;

  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'progress' | 'quality'>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ClipboardList },
    { id: 'materials', name: 'Materials & Operations', icon: Package },
    { id: 'progress', name: 'Progress Tracking', icon: TrendingUp },
    { id: 'quality', name: 'Quality & Inspection', icon: CheckCircle },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate OEE metrics
  const calculateOEE = () => {
    const availability = 0.92; // 92%
    const performance = 0.88; // 88%
    const quality = 0.96; // 96%
    const oee = availability * performance * quality;
    return {
      availability: (availability * 100).toFixed(1),
      performance: (performance * 100).toFixed(1),
      quality: (quality * 100).toFixed(1),
      oee: (oee * 100).toFixed(1),
    };
  };

  const oeeMetrics = calculateOEE();

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/production/work-orders')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Work Orders</span>
        </button>

        {/* Work Order Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Factory className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{workOrder.woNumber}</h1>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[workOrder.status]}`}>
                    {workOrder.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${priorityColors[workOrder.priority]}`}>
                    {workOrder.priority} Priority
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{workOrder.productName}</h2>
                <p className="text-sm text-gray-600">{workOrder.productDescription}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Product Code:</span> {workOrder.productCode}
                  </span>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Drawing:</span> {workOrder.drawingNumber}
                  </span>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Rev:</span> {workOrder.revision}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push(`/production/work-orders/edit/${workOrderId}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <PlayCircle className="h-4 w-4" />
                <span>Record Progress</span>
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <MoreVertical className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">More</span>
              </button>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Production Progress</span>
              <span className="text-sm font-bold text-gray-900">{workOrder.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                style={{ width: `${workOrder.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Status Flow */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-900">Draft</span>
            </div>
            <div className="h-1 flex-1 bg-green-500 mx-2"></div>

            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-900">Released</span>
            </div>
            <div className="h-1 flex-1 bg-green-500 mx-2"></div>

            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-900">Material Issued</span>
            </div>
            <div className="h-1 flex-1 bg-yellow-500 mx-2"></div>

            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-yellow-700">In Progress</span>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-2"></div>

            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs font-medium text-gray-500">QC</span>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-2"></div>

            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs font-medium text-gray-500">Completed</span>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-2"></div>

            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                <StopCircle className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs font-medium text-gray-500">Closed</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-medium text-blue-600 uppercase">Planned Qty</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{workOrder.plannedQty} {workOrder.uom}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-xs font-medium text-green-600 uppercase">Completed Qty</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{workOrder.completedQty} {workOrder.uom}</p>
              <p className="text-xs text-green-600 mt-1">Rejected: {workOrder.rejectedQty}, Rework: {workOrder.reworkQty}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                <p className="text-xs font-medium text-purple-600 uppercase">Completion %</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">{workOrder.completionPercentage}%</p>
              <p className="text-xs text-purple-600 mt-1">{workOrder.plannedQty - workOrder.completedQty} {workOrder.uom} remaining</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <p className="text-xs font-medium text-orange-600 uppercase">Duration</p>
              </div>
              <p className="text-2xl font-bold text-orange-900">{workOrder.actualDuration} days</p>
              <p className="text-xs text-orange-600 mt-1">Planned: {workOrder.plannedDuration} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Order Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-orange-600" />
                  Product Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Product Code</p>
                    <p className="text-sm font-semibold text-gray-900">{workOrder.productCode}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Product Name</p>
                    <p className="text-sm text-gray-900 text-right">{workOrder.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Description</p>
                    <p className="text-sm text-gray-900">{workOrder.productDescription}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Drawing Number</p>
                    <p className="text-sm font-semibold text-gray-900">{workOrder.drawingNumber}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Revision</p>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">{workOrder.revision}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
                  Order Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Sales Order Reference</p>
                    <p className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">{workOrder.salesOrderRef}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Customer Name</p>
                    <p className="text-sm text-gray-900">{workOrder.customerName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Due Date</p>
                    <p className="text-sm font-semibold text-gray-900">{workOrder.dueDate}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Priority</p>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${priorityColors[workOrder.priority]}`}>
                      {workOrder.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Planned Dates */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Planned Dates
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Start Date</p>
                    <p className="text-sm text-gray-900">{workOrder.plannedStartDate}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">End Date</p>
                    <p className="text-sm text-gray-900">{workOrder.plannedEndDate}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">{workOrder.plannedDuration} days</p>
                  </div>
                </div>
              </div>

              {/* Actual Dates */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Actual Dates
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Actual Start</p>
                    <p className="text-sm text-gray-900">{workOrder.actualStartDate || 'Not started'}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Actual End</p>
                    <p className="text-sm text-gray-900">{workOrder.actualEndDate || 'In progress'}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Actual Duration</p>
                    <p className="text-sm font-semibold text-gray-900">{workOrder.actualDuration} days</p>
                  </div>
                </div>
              </div>

              {/* Work Center */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Factory className="h-5 w-5 mr-2 text-orange-600" />
                  Work Centers
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Primary Work Center</p>
                    <p className="text-sm font-semibold text-gray-900">{workOrder.workCenter}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Secondary Work Centers</p>
                    <div className="flex flex-wrap gap-2">
                      {workOrder.secondaryWorkCenters.map((wc, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                          {wc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shift & Personnel */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-orange-600" />
                  Shift & Personnel
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Shift</p>
                    <p className="text-sm text-gray-900">{workOrder.shift}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Supervisor</p>
                    <p className="text-sm font-semibold text-gray-900">{workOrder.supervisor}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Foreman</p>
                    <p className="text-sm font-semibold text-gray-900">{workOrder.foreman}</p>
                  </div>
                </div>
              </div>

              {/* BOM & Routing */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-orange-600" />
                  BOM & Routing
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">BOM Reference</p>
                    <p className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">{workOrder.bomRef}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Routing Reference</p>
                    <p className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">{workOrder.routingRef}</p>
                  </div>
                </div>
              </div>

              {/* Cost Tracking */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2 text-orange-600" />
                  Cost Tracking
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Material Cost</p>
                    <p className="text-sm text-gray-900">{formatCurrency(workOrder.materialCost)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Labor Cost</p>
                    <p className="text-sm text-gray-900">{formatCurrency(workOrder.laborCost)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-medium text-gray-500 uppercase">Overhead Cost</p>
                    <p className="text-sm text-gray-900">{formatCurrency(workOrder.overheadCost)}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <p className="text-sm font-bold text-gray-900 uppercase">Total Cost</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(workOrder.totalCost)}</p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="lg:col-span-2 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                  Special Instructions
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{workOrder.specialInstructions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Materials & Operations Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Materials & Operations</h2>

            {/* Materials Required */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Materials Required</h3>
                <span className="text-sm text-gray-600">{mockMaterials.length} items</span>
              </div>

              {/* Material Shortage Alert */}
              {mockMaterials.some(m => m.stockStatus === 'shortage' || m.stockStatus === 'critical') && (
                <div className="mb-4 bg-orange-50 border-l-4 border-orange-500 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-orange-800">Material Shortage Alert</p>
                      <p className="text-xs text-orange-700 mt-1">
                        {mockMaterials.filter(m => m.stockStatus === 'shortage' || m.stockStatus === 'critical').length} items have stock shortage. Action required.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Required</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Issued</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Consumed</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Variance</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMaterials.map((material, index) => (
                      <tr key={material.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{material.itemCode}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{material.description}</td>
                        <td className="px-4 py-4 text-sm text-center text-gray-900">
                          {material.requiredQty} {material.uom}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-900">
                          {material.issuedQty} {material.uom}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-900">
                          {material.consumedQty} {material.uom}
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          <span className={material.variance > 0 ? 'text-orange-600 font-semibold' : 'text-gray-900'}>
                            {material.variance > 0 ? '+' : ''}{material.variance} {material.uom}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stockStatusColors[material.stockStatus]}`}>
                              {material.stockStatus.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-600 mt-1">{material.stockAvailable} {material.uom} in stock</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operations */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Operations / Routing</h3>
                <span className="text-sm text-gray-600">{mockOperations.length} operations</span>
              </div>

              <div className="space-y-4">
                {mockOperations.map((operation, index) => (
                  <div key={operation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-700">{operation.sequence}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{operation.operationName}</h4>
                          <p className="text-sm text-gray-600">{operation.workCenter}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${operationStatusColors[operation.status]}`}>
                        {operation.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Setup Time</p>
                        <p className="text-sm font-semibold text-gray-900">{operation.setupTime} min</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Run Time</p>
                        <p className="text-sm font-semibold text-gray-900">{operation.runTime} min</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Planned Start</p>
                        <p className="text-sm text-gray-900">{operation.plannedStart}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Actual Start</p>
                        <p className="text-sm text-gray-900">{operation.actualStart || 'Not started'}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">Operation Progress</span>
                        <span className="text-xs font-bold text-gray-900">{operation.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            operation.status === 'completed' ? 'bg-green-500' :
                            operation.status === 'in_progress' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${operation.completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">Operator: <span className="font-medium">{operation.operator}</span></span>
                      </div>
                      {operation.status === 'completed' && operation.actualEnd && (
                        <span className="text-green-600 font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed on {operation.actualEnd}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Tracking Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress Tracking</h2>

            {/* OEE Metrics */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">OEE (Overall Equipment Effectiveness)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gauge className="h-5 w-5 text-green-600" />
                    <p className="text-xs font-medium text-green-600 uppercase">OEE</p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">{oeeMetrics.oee}%</p>
                  <p className="text-xs text-green-600 mt-1">World Class: 85%+</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <p className="text-xs font-medium text-blue-600 uppercase">Availability</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{oeeMetrics.availability}%</p>
                  <p className="text-xs text-blue-600 mt-1">Operating time / Planned time</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <p className="text-xs font-medium text-purple-600 uppercase">Performance</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-900">{oeeMetrics.performance}%</p>
                  <p className="text-xs text-purple-600 mt-1">Actual output / Planned output</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <p className="text-xs font-medium text-orange-600 uppercase">Quality</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-900">{oeeMetrics.quality}%</p>
                  <p className="text-xs text-orange-600 mt-1">Good units / Total units</p>
                </div>
              </div>
            </div>

            {/* Production Timeline */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quantity Produced per Shift</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Produced</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rejected</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rework</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProgressTracking.map((record, index) => (
                      <tr key={record.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-4 text-sm text-gray-900">{record.date}</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                            {record.shift}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-center font-semibold text-green-600">
                          {record.quantityProduced} Pcs
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          {record.quantityRejected > 0 ? (
                            <span className="font-semibold text-red-600">{record.quantityRejected} Pcs</span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          {record.quantityRework > 0 ? (
                            <span className="font-semibold text-orange-600">{record.quantityRework} Pcs</span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{record.operator}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{record.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Downtime Log */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Downtime Log</h3>
              <div className="space-y-4">
                {mockDowntimeRecords.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${downtimeReasonColors[record.reason]}`}>
                              {record.reason.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">{record.date} - {record.shift}</span>
                          </div>
                          <p className="text-sm text-gray-900 mt-1">{record.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-red-600">{record.duration} min</span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                      <p className="text-xs font-medium text-green-800 uppercase mb-1">Action Taken</p>
                      <p className="text-sm text-gray-700">{record.actionTaken}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Labor & Machine Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-orange-600" />
                  Labor Hours Tracking
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Planned Labor Hours</p>
                    <p className="text-sm font-semibold text-gray-900">280 hrs</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Actual Labor Hours</p>
                    <p className="text-sm font-semibold text-gray-900">252 hrs</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Efficiency</p>
                    <p className="text-sm font-semibold text-green-600">90%</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-orange-600" />
                  Machine Hours Utilization
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Available Hours</p>
                    <p className="text-sm font-semibold text-gray-900">168 hrs</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Operating Hours</p>
                    <p className="text-sm font-semibold text-gray-900">154 hrs</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Utilization</p>
                    <p className="text-sm font-semibold text-green-600">92%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quality & Inspection Tab */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quality & Inspection</h2>

            {/* In-Process Inspection */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">In-Process Inspection Records</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspector</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specification</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual Value</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Result</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockQualityRecords.map((record, index) => (
                      <tr key={record.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700">
                            {record.inspectionType.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{record.date}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{record.inspector}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{record.parameter}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{record.specification}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{record.actualValue}</td>
                        <td className="px-4 py-4 text-center">
                          {record.result === 'pass' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <XCircle className="h-3 w-3 mr-1" />
                              FAIL
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{record.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rejection Details */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rejection Details</h3>
              <div className="space-y-4">
                {mockRejectionDetails.map((rejection) => (
                  <div key={rejection.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <XCircle className="h-6 w-6 text-red-600 mt-1" />
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-bold text-gray-900">{rejection.date}</span>
                            <span className="text-sm font-bold text-red-600">{rejection.quantity} Pcs Rejected</span>
                          </div>
                          <p className="text-sm text-gray-900 mb-2">{rejection.reason}</p>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              rejection.disposition === 'rework' ? 'bg-orange-100 text-orange-700' :
                              rejection.disposition === 'scrap' ? 'bg-red-100 text-red-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              Disposition: {rejection.disposition.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-600">
                              Approved by: <span className="font-medium">{rejection.approvedBy}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-xs font-medium text-green-600 uppercase">Passed Units</p>
                </div>
                <p className="text-3xl font-bold text-green-900">47 Pcs</p>
                <p className="text-xs text-green-600 mt-1">94% Pass Rate</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <p className="text-xs font-medium text-red-600 uppercase">Rejected Units</p>
                </div>
                <p className="text-3xl font-bold text-red-900">2 Pcs</p>
                <p className="text-xs text-red-600 mt-1">4% Rejection Rate</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Wrench className="h-5 w-5 text-orange-600" />
                  <p className="text-xs font-medium text-orange-600 uppercase">Rework Units</p>
                </div>
                <p className="text-3xl font-bold text-orange-900">1 Pcs</p>
                <p className="text-xs text-orange-600 mt-1">2% Rework Rate</p>
              </div>
            </div>

            {/* QC Approval Status */}
            <div className="mt-8 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-orange-600" />
                QC Approval Status
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Final QC Pending</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Final quality inspection scheduled for 2025-10-18. In-process inspections completed and passed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-orange-600" />
          Activity Timeline
        </h2>
        <div className="space-y-4">
          {mockActivityLog.map((activity, index) => {
            const isLast = index === mockActivityLog.length - 1;
            return (
              <div key={activity.id} className="relative">
                {!isLast && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-300"></div>
                )}
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500 flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-bold text-gray-900">{activity.action}</h4>
                      <span className="text-xs text-gray-500">
                        {activity.date} {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">by {activity.performedBy}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Attachments */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-orange-600" />
          Document Attachments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 cursor-pointer">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Product Drawing</p>
              <p className="text-xs text-gray-600">DRG-MKC-001-Rev3.pdf</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 cursor-pointer">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">BOM Document</p>
              <p className="text-xs text-gray-600">BOM-MKC-CAB-001.xlsx</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 cursor-pointer">
            <FileText className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Inspection Report</p>
              <p className="text-xs text-gray-600">QC-Report-2025-143.pdf</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
