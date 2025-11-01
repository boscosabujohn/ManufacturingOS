'use client';

import React, { useState } from 'react';
import { ExportReportModal, RequestResourcesModal, WorkCenterConfigModal } from '@/components/production/CapacityPlanningModals';
import {
  Factory,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Download,
  Plus,
  Edit,
  Eye,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  Target,
  DollarSign,
  RefreshCw,
  Filter,
  ChevronRight,
  ChevronDown,
  Info,
  AlertCircle,
  TrendingDown,
  MinusCircle,
  PlusCircle,
  Clock3,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Package,
  Wrench,
  Save,
  Play,
  ExternalLink,
  FileText,
  Send,
  Truck,
  ShoppingCart,
  Box,
  Layers,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// TypeScript Interfaces
interface WorkCenterCapacity {
  id: string;
  workCenterCode: string;
  workCenterName: string;
  department: string;
  numberOfMachines: number;
  shiftsPerDay: 1 | 2 | 3;
  hoursPerShift: number;
  workingDaysPerWeek: number;
  efficiencyFactor: number;
  availableCapacityHours: number;
  status: 'active' | 'inactive' | 'maintenance';
  costPerHour: number;
}

interface LoadPeriod {
  period: string;
  startDate: string;
  endDate: string;
  availableCapacity: number;
  requiredCapacity: number;
  utilization: number;
  variance: number;
  status: 'ok' | 'tight' | 'moderate-overload' | 'severe-overload';
  overtimeHours: number;
  workOrders: string[];
}

interface BottleneckInfo {
  workCenterCode: string;
  workCenterName: string;
  avgUtilization: number;
  maxUtilization: number;
  overloadedPeriods: number;
  totalOverloadHours: number;
  impactedWOs: string[];
  suggestedActions: string[];
  severity: 'critical' | 'high' | 'medium';
}

interface ResourceLeveling {
  originalLoad: number[];
  leveledLoad: number[];
  movedWOs: Array<{ woId: string; from: string; to: string; hours: number }>;
  optimizationScore: number;
  improvements: string[];
}

interface OvertimePlan {
  workCenter: string;
  period: string;
  regularHours: number;
  overtimeHours: number;
  overtimeCost: number;
  reason: string;
  status: 'planned' | 'approved' | 'rejected';
  approver: string;
}

interface CapacityScenario {
  id: string;
  name: string;
  description: string;
  changes: Array<{
    workCenter: string;
    changeType: 'add-shift' | 'add-machine' | 'efficiency' | 'outsource';
    value: number;
  }>;
  impact: {
    capacityIncrease: number;
    costIncrease: number;
    utilizationChange: number;
    bottlenecksResolved: number;
  };
  feasibility: 'high' | 'medium' | 'low';
}

interface MachineLabor {
  workCenter: string;
  machineCapacityHours: number;
  laborCapacityHours: number;
  machineUtilization: number;
  laborUtilization: number;
  machineEfficiency: number;
  laborEfficiency: number;
  operatorsRequired: number;
  operatorsAvailable: number;
  multiMachineRatio: number;
}

const CapacityPlanningPage = () => {
  // State Management
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'capacity' | 'bottlenecks' | 'leveling' | 'overtime' | 'scenarios' | 'machine-labor'>('capacity');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResourceRequestModalOpen, setIsResourceRequestModalOpen] = useState(false);
  const [isWorkCenterConfigModalOpen, setIsWorkCenterConfigModalOpen] = useState(false);
  const [selectedWorkCenterForConfig, setSelectedWorkCenterForConfig] = useState<any | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [planningStrategy, setPlanningStrategy] = useState<'chase' | 'level' | 'mixed'>('mixed');
  const [scenarioName, setScenarioName] = useState('');

  // Mock Data - Work Center Capacity
  const [workCenters, setWorkCenters] = useState<WorkCenterCapacity[]>([
    {
      id: 'WC001',
      workCenterCode: 'WC-FAB-01',
      workCenterName: 'Fabrication Shop 1',
      department: 'Fabrication',
      numberOfMachines: 4,
      shiftsPerDay: 2,
      hoursPerShift: 8,
      workingDaysPerWeek: 6,
      efficiencyFactor: 0.85,
      availableCapacityHours: 326.4,
      status: 'active',
      costPerHour: 850,
    },
    {
      id: 'WC002',
      workCenterCode: 'WC-WEL-01',
      workCenterName: 'Welding Station A',
      department: 'Welding',
      numberOfMachines: 6,
      shiftsPerDay: 3,
      hoursPerShift: 8,
      workingDaysPerWeek: 6,
      efficiencyFactor: 0.82,
      availableCapacityHours: 708.5,
      status: 'active',
      costPerHour: 950,
    },
    {
      id: 'WC003',
      workCenterCode: 'WC-ASM-01',
      workCenterName: 'Assembly Line 1',
      department: 'Assembly',
      numberOfMachines: 2,
      shiftsPerDay: 2,
      hoursPerShift: 8,
      workingDaysPerWeek: 6,
      efficiencyFactor: 0.90,
      availableCapacityHours: 172.8,
      status: 'active',
      costPerHour: 650,
    },
    {
      id: 'WC004',
      workCenterCode: 'WC-TEST-01',
      workCenterName: 'Testing Bay',
      department: 'Quality',
      numberOfMachines: 3,
      shiftsPerDay: 1,
      hoursPerShift: 8,
      workingDaysPerWeek: 6,
      efficiencyFactor: 0.88,
      availableCapacityHours: 126.7,
      status: 'active',
      costPerHour: 750,
    },
    {
      id: 'WC005',
      workCenterCode: 'WC-PAINT-01',
      workCenterName: 'Paint Shop',
      department: 'Finishing',
      numberOfMachines: 2,
      shiftsPerDay: 2,
      hoursPerShift: 8,
      workingDaysPerWeek: 5.5,
      efficiencyFactor: 0.80,
      availableCapacityHours: 140.8,
      status: 'active',
      costPerHour: 700,
    },
    {
      id: 'WC006',
      workCenterCode: 'WC-MACH-01',
      workCenterName: 'CNC Machining',
      department: 'Machining',
      numberOfMachines: 5,
      shiftsPerDay: 2,
      hoursPerShift: 8,
      workingDaysPerWeek: 6,
      efficiencyFactor: 0.87,
      availableCapacityHours: 417.6,
      status: 'active',
      costPerHour: 1200,
    },
  ]);

  // Mock Data - Capacity vs Load by Period
  const [capacityLoad, setCapacityLoad] = useState<{ [key: string]: LoadPeriod[] }>({
    'WC-FAB-01': [
      {
        period: 'Week 42',
        startDate: '2025-10-13',
        endDate: '2025-10-19',
        availableCapacity: 326.4,
        requiredCapacity: 298.5,
        utilization: 91.4,
        variance: 27.9,
        status: 'ok',
        overtimeHours: 0,
        workOrders: ['WO-2025-0145', 'WO-2025-0146'],
      },
      {
        period: 'Week 43',
        startDate: '2025-10-20',
        endDate: '2025-10-26',
        availableCapacity: 326.4,
        requiredCapacity: 312.8,
        utilization: 95.8,
        variance: 13.6,
        status: 'tight',
        overtimeHours: 0,
        workOrders: ['WO-2025-0147', 'WO-2025-0148', 'WO-2025-0149'],
      },
      {
        period: 'Week 44',
        startDate: '2025-10-27',
        endDate: '2025-11-02',
        availableCapacity: 326.4,
        requiredCapacity: 285.2,
        utilization: 87.4,
        variance: 41.2,
        status: 'ok',
        overtimeHours: 0,
        workOrders: ['WO-2025-0150'],
      },
      {
        period: 'Week 45',
        startDate: '2025-11-03',
        endDate: '2025-11-09',
        availableCapacity: 326.4,
        requiredCapacity: 295.8,
        utilization: 90.6,
        variance: 30.6,
        status: 'ok',
        overtimeHours: 0,
        workOrders: ['WO-2025-0151', 'WO-2025-0152'],
      },
    ],
    'WC-WEL-01': [
      {
        period: 'Week 42',
        startDate: '2025-10-13',
        endDate: '2025-10-19',
        availableCapacity: 708.5,
        requiredCapacity: 782.4,
        utilization: 110.4,
        variance: -73.9,
        status: 'moderate-overload',
        overtimeHours: 16,
        workOrders: ['WO-2025-0145', 'WO-2025-0147', 'WO-2025-0150'],
      },
      {
        period: 'Week 43',
        startDate: '2025-10-20',
        endDate: '2025-10-26',
        availableCapacity: 708.5,
        requiredCapacity: 845.6,
        utilization: 119.3,
        variance: -137.1,
        status: 'severe-overload',
        overtimeHours: 28,
        workOrders: ['WO-2025-0148', 'WO-2025-0149', 'WO-2025-0151', 'WO-2025-0153'],
      },
      {
        period: 'Week 44',
        startDate: '2025-10-27',
        endDate: '2025-11-02',
        availableCapacity: 708.5,
        requiredCapacity: 698.2,
        utilization: 98.5,
        variance: 10.3,
        status: 'tight',
        overtimeHours: 0,
        workOrders: ['WO-2025-0152', 'WO-2025-0154'],
      },
      {
        period: 'Week 45',
        startDate: '2025-11-03',
        endDate: '2025-11-09',
        availableCapacity: 708.5,
        requiredCapacity: 756.3,
        utilization: 106.7,
        variance: -47.8,
        status: 'moderate-overload',
        overtimeHours: 10,
        workOrders: ['WO-2025-0155', 'WO-2025-0156'],
      },
    ],
    'WC-ASM-01': [
      {
        period: 'Week 42',
        startDate: '2025-10-13',
        endDate: '2025-10-19',
        availableCapacity: 172.8,
        requiredCapacity: 156.4,
        utilization: 90.5,
        variance: 16.4,
        status: 'ok',
        overtimeHours: 0,
        workOrders: ['WO-2025-0146', 'WO-2025-0148'],
      },
      {
        period: 'Week 43',
        startDate: '2025-10-20',
        endDate: '2025-10-26',
        availableCapacity: 172.8,
        requiredCapacity: 168.5,
        utilization: 97.5,
        variance: 4.3,
        status: 'tight',
        overtimeHours: 0,
        workOrders: ['WO-2025-0149', 'WO-2025-0151'],
      },
      {
        period: 'Week 44',
        startDate: '2025-10-27',
        endDate: '2025-11-02',
        availableCapacity: 172.8,
        requiredCapacity: 142.8,
        utilization: 82.6,
        variance: 30.0,
        status: 'ok',
        overtimeHours: 0,
        workOrders: ['WO-2025-0150'],
      },
      {
        period: 'Week 45',
        startDate: '2025-11-03',
        endDate: '2025-11-09',
        availableCapacity: 172.8,
        requiredCapacity: 165.2,
        utilization: 95.6,
        variance: 7.6,
        status: 'tight',
        overtimeHours: 0,
        workOrders: ['WO-2025-0152', 'WO-2025-0154'],
      },
    ],
  });

  // Mock Data - Bottleneck Analysis
  const [bottlenecks, setBottlenecks] = useState<BottleneckInfo[]>([
    {
      workCenterCode: 'WC-WEL-01',
      workCenterName: 'Welding Station A',
      avgUtilization: 108.7,
      maxUtilization: 119.3,
      overloadedPeriods: 3,
      totalOverloadHours: 191.8,
      impactedWOs: ['WO-2025-0148', 'WO-2025-0149', 'WO-2025-0151', 'WO-2025-0153', 'WO-2025-0155'],
      suggestedActions: [
        'Add 54 overtime hours across 3 weeks (Cost: Rs. 51,300)',
        'Add temporary shift (6 machines x 8 hrs x 6 days = 288 hrs)',
        'Outsource non-critical welding operations to vendor',
        'Reschedule WO-2025-0155 to Week 46',
        'Consider acquiring 2 additional welding machines',
      ],
      severity: 'critical',
    },
  ]);

  // Mock Data - Resource Leveling
  const [leveling, setLeveling] = useState<ResourceLeveling>({
    originalLoad: [782, 845, 698, 756],
    leveledLoad: [725, 758, 712, 743],
    movedWOs: [
      { woId: 'WO-2025-0148', from: 'Week 43', to: 'Week 42', hours: 48 },
      { woId: 'WO-2025-0155', from: 'Week 45', to: 'Week 46', hours: 38 },
      { woId: 'WO-2025-0153', from: 'Week 43', to: 'Week 44', hours: 54 },
    ],
    optimizationScore: 87,
    improvements: [
      'Reduced peak utilization from 119% to 107%',
      'Eliminated severe overload periods',
      'Balanced load variance reduced by 42%',
      'No impact on customer delivery dates',
    ],
  });

  // Mock Data - Overtime Planning
  const [overtimePlans, setOvertimePlans] = useState<OvertimePlan[]>([
    {
      workCenter: 'WC-WEL-01',
      period: 'Week 42',
      regularHours: 708.5,
      overtimeHours: 16,
      overtimeCost: 22800,
      reason: 'Bottleneck resolution - 10.4% overload',
      status: 'approved',
      approver: 'Production Manager',
    },
    {
      workCenter: 'WC-WEL-01',
      period: 'Week 43',
      regularHours: 708.5,
      overtimeHours: 28,
      overtimeCost: 39900,
      reason: 'Critical bottleneck - 19.3% overload',
      status: 'planned',
      approver: '',
    },
    {
      workCenter: 'WC-WEL-01',
      period: 'Week 45',
      regularHours: 708.5,
      overtimeHours: 10,
      overtimeCost: 14250,
      reason: 'Bottleneck resolution - 6.7% overload',
      status: 'planned',
      approver: '',
    },
  ]);

  // Mock Data - Capacity Scenarios
  const [scenarios, setScenarios] = useState<CapacityScenario[]>([
    {
      id: 'SC001',
      name: 'Add Third Shift - Welding',
      description: 'Add permanent 3rd shift to welding station (6 operators)',
      changes: [
        { workCenter: 'WC-WEL-01', changeType: 'add-shift', value: 1 },
      ],
      impact: {
        capacityIncrease: 236.2,
        costIncrease: 450000,
        utilizationChange: -25,
        bottlenecksResolved: 1,
      },
      feasibility: 'high',
    },
    {
      id: 'SC002',
      name: 'Acquire 2 Welding Machines',
      description: 'Capital investment in 2 additional welding machines',
      changes: [
        { workCenter: 'WC-WEL-01', changeType: 'add-machine', value: 2 },
      ],
      impact: {
        capacityIncrease: 236.2,
        costIncrease: 2500000,
        utilizationChange: -22,
        bottlenecksResolved: 1,
      },
      feasibility: 'medium',
    },
    {
      id: 'SC003',
      name: 'Improve Welding Efficiency',
      description: 'Training program + process improvements (82% to 90%)',
      changes: [
        { workCenter: 'WC-WEL-01', changeType: 'efficiency', value: 8 },
      ],
      impact: {
        capacityIncrease: 69.2,
        costIncrease: 150000,
        utilizationChange: -8,
        bottlenecksResolved: 0,
      },
      feasibility: 'high',
    },
  ]);

  // Mock Data - Machine/Labor Capacity
  const [machineLabor, setMachineLabor] = useState<MachineLabor[]>([
    {
      workCenter: 'WC-WEL-01',
      machineCapacityHours: 864,
      laborCapacityHours: 864,
      machineUtilization: 98.2,
      laborUtilization: 102.5,
      machineEfficiency: 0.82,
      laborEfficiency: 0.88,
      operatorsRequired: 18,
      operatorsAvailable: 18,
      multiMachineRatio: 1.0,
    },
    {
      workCenter: 'WC-MACH-01',
      machineCapacityHours: 480,
      laborCapacityHours: 768,
      machineUtilization: 92.5,
      laborUtilization: 57.8,
      machineEfficiency: 0.87,
      laborEfficiency: 0.92,
      operatorsRequired: 10,
      operatorsAvailable: 16,
      multiMachineRatio: 1.6,
    },
    {
      workCenter: 'WC-FAB-01',
      machineCapacityHours: 384,
      laborCapacityHours: 384,
      machineUtilization: 89.3,
      laborUtilization: 91.2,
      machineEfficiency: 0.85,
      laborEfficiency: 0.87,
      operatorsRequired: 8,
      operatorsAvailable: 8,
      multiMachineRatio: 1.0,
    },
  ]);

  // Calculate Summary Statistics
  const calculateStats = () => {
    const totalWorkCenters = workCenters.length;
    const totalCapacity = workCenters.reduce((sum, wc) => sum + wc.availableCapacityHours, 0);

    // Calculate average utilization across all work centers and periods
    let totalUtil = 0;
    let count = 0;
    Object.values(capacityLoad).forEach((periods) => {
      periods.forEach((period) => {
        totalUtil += period.utilization;
        count++;
      });
    });
    const avgUtilization = count > 0 ? totalUtil / count : 0;

    const bottleneckCenters = bottlenecks.length;
    const totalOvertimeHours = overtimePlans.reduce((sum, plan) => sum + plan.overtimeHours, 0);

    return { totalWorkCenters, totalCapacity, avgUtilization, bottleneckCenters, totalOvertimeHours };
  };

  const stats = calculateStats();

  // Calculate Capacity for Work Center
  const calculateCapacity = (wc: WorkCenterCapacity): number => {
    // Capacity = Machines × Shifts × Hours/Shift × Days/Week × Efficiency
    return wc.numberOfMachines * wc.shiftsPerDay * wc.hoursPerShift * wc.workingDaysPerWeek * wc.efficiencyFactor;
  };

  // Update Work Center
  const updateWorkCenter = (id: string, updates: Partial<WorkCenterCapacity>) => {
    setWorkCenters((prev) =>
      prev.map((wc) => {
        if (wc.id === id) {
          const updated = { ...wc, ...updates };
          updated.availableCapacityHours = calculateCapacity(updated);
          return updated;
        }
        return wc;
      })
    );
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tight':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderate-overload':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'severe-overload':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get utilization color
  const getUtilizationColor = (utilization: number) => {
    if (utilization < 85) return 'text-green-600';
    if (utilization < 100) return 'text-yellow-600';
    if (utilization < 110) return 'text-orange-600';
    return 'text-red-600';
  };

  // Optimize Schedule
  const optimizeSchedule = () => {
    alert('Optimizing production schedule to balance capacity load...\n\nThis will automatically reschedule work orders to minimize bottlenecks.');
  };

  // Plan Overtime
  const planOvertime = () => {
    alert('Planning overtime hours for overloaded work centers...\n\nThis will calculate required overtime and associated costs.');
  };

  // Export Report
  const exportReport = () => {
    setIsExportModalOpen(true);
  };

  // Handler functions
  const handleExport = (format: string, options: any) => {
    console.log('Exporting capacity planning report as:', format, 'with options:', options);
    alert(`Exporting Capacity Planning Report as ${format.toUpperCase()}!\n\nIncluded sections:\n${
      options.includeCapacityLoad ? '✓ Capacity vs Load\n' : ''
    }${options.includeBottlenecks ? '✓ Bottleneck Analysis\n' : ''
    }${options.includeResourceLeveling ? '✓ Resource Leveling\n' : ''
    }${options.includeOvertimePlan ? '✓ Overtime Planning\n' : ''
    }${options.includeScenarios ? '✓ Scenarios\n' : ''
    }${options.includeMachineLabor ? '✓ Machine & Labor Split\n' : ''}`);
  };

  const handleResourceRequest = (request: any) => {
    console.log('Submitting resource request:', request);
    alert(`Resource Request Submitted!\n\nType: ${request.resourceType}\nWork Center: ${request.workCenter}\nQuantity: ${request.quantity}\n\nYour request has been sent for approval.`);
  };

  const handleWorkCenterConfigSave = (config: any) => {
    console.log('Saving work center config:', config);
    alert(`Work Center Configuration Saved!\n\nNew monthly capacity: ${Math.round(config.numberOfMachines * config.shiftsPerDay * config.hoursPerShift * config.workingDaysPerWeek * 4 * (config.efficiencyFactor / 100))} hours`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Factory className="h-8 w-8 text-blue-600" />
              Capacity Planning & Analysis
            </h1>
            <p className="text-gray-600 mt-1">
              Balance production load with available capacity across work centers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
            >
              {editMode ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {editMode ? 'View Mode' : 'Edit Mode'}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Planning Period:</label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'weekly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Planning Strategy:</label>
            <select
              value={planningStrategy}
              onChange={(e) => setPlanningStrategy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="chase">Chase Demand (Vary Capacity)</option>
              <option value="level">Level Production (Constant Capacity)</option>
              <option value="mixed">Mixed Strategy</option>
            </select>
          </div>

          <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Recalculate
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Work Centers</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalWorkCenters}</p>
                <p className="text-xs text-blue-600 mt-1">Active production centers</p>
              </div>
              <Factory className="h-10 w-10 text-blue-400" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Avg Utilization</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.avgUtilization.toFixed(1)}%</p>
                <p className="text-xs text-green-600 mt-1">Across all centers</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-400" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Bottleneck Centers</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.bottleneckCenters}</p>
                <p className="text-xs text-orange-600 mt-1">Require attention</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-orange-400" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Overtime Hours</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalOvertimeHours}</p>
                <p className="text-xs text-purple-600 mt-1">Planned for next 4 weeks</p>
              </div>
              <Clock className="h-10 w-10 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Planning Strategy Info */}
      <div className={`rounded-lg p-4 border ${
        planningStrategy === 'chase' ? 'bg-blue-50 border-blue-200' :
        planningStrategy === 'level' ? 'bg-green-50 border-green-200' :
        'bg-purple-50 border-purple-200'
      }`}>
        <div className="flex items-start gap-3">
          <Info className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
            planningStrategy === 'chase' ? 'text-blue-600' :
            planningStrategy === 'level' ? 'text-green-600' :
            'text-purple-600'
          }`} />
          <div>
            <h3 className={`font-semibold ${
              planningStrategy === 'chase' ? 'text-blue-900' :
              planningStrategy === 'level' ? 'text-green-900' :
              'text-purple-900'
            }`}>
              {planningStrategy === 'chase' ? 'Chase Demand Strategy' :
               planningStrategy === 'level' ? 'Level Production Strategy' :
               'Mixed Strategy'}
            </h3>
            <p className={`text-sm mt-1 ${
              planningStrategy === 'chase' ? 'text-blue-700' :
              planningStrategy === 'level' ? 'text-green-700' :
              'text-purple-700'
            }`}>
              {planningStrategy === 'chase'
                ? 'Vary capacity (overtime, shifts, temporary workers) to match demand fluctuations. Higher flexibility, variable costs.'
                : planningStrategy === 'level'
                ? 'Maintain constant capacity and production rate. Build inventory during low demand, use it during peaks. Stable workforce, carrying costs.'
                : 'Combination of capacity variation and inventory management. Balance flexibility with stability and cost optimization.'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleString()}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportReport}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Export Report
          </button>
          <button
            onClick={() => setIsResourceRequestModalOpen(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            Request Additional Resources
          </button>
        </div>
      </div>

      {/* Modals */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
      <RequestResourcesModal
        isOpen={isResourceRequestModalOpen}
        onClose={() => setIsResourceRequestModalOpen(false)}
        onSubmit={handleResourceRequest}
      />
      <WorkCenterConfigModal
        isOpen={isWorkCenterConfigModalOpen}
        onClose={() => {
          setIsWorkCenterConfigModalOpen(false);
          setSelectedWorkCenterForConfig(null);
        }}
        workCenter={selectedWorkCenterForConfig}
        onSave={handleWorkCenterConfigSave}
      />
    </div>
  );
};

export default CapacityPlanningPage;
