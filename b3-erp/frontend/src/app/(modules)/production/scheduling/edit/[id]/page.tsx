"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Users,
  Settings,
  Package,
  Plus,
  Minus,
  Search,
  Filter,
  GripVertical,
  Play,
  Pause,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Database,
  Wrench,
  ArrowRight,
  RefreshCw,
  Send,
  Layers,
  Activity,
  Timer,
  TrendingUp,
  AlertCircle,
  Box,
  GitBranch,
} from "lucide-react";

// TypeScript Interfaces
interface WorkOrder {
  id: string;
  product: string;
  productCode: string;
  quantity: number;
  startDate: string;
  endDate: string;
  workCenter: string;
  shift: string;
  priority: number;
  status: string;
  dependencies: string[];
  estimatedHours: number;
  operators: number;
  setupTime: number;
  cycleTime: number;
  materialAvailable: boolean;
  toolsAvailable: boolean;
}

interface WorkCenter {
  id: string;
  name: string;
  capacity: number;
  allocated: number;
  utilization: number;
  availableCapacity: number;
  operatorsAvailable: number;
  shifts: string[];
}

interface Constraint {
  id: string;
  type: string;
  enabled: boolean;
  description: string;
}

interface ScheduleData {
  id: string;
  scheduleId: string;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
  schedulingMethod: string;
  workOrders: WorkOrder[];
  workCenters: WorkCenter[];
  constraints: Constraint[];
}

const ProductionSchedulingEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [selectedWOs, setSelectedWOs] = useState<string[]>([]);
  const [availableWOs, setAvailableWOs] = useState<WorkOrder[]>([]);
  const [showWOSelector, setShowWOSelector] = useState(false);
  const [draggedWO, setDraggedWO] = useState<string | null>(null);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<string>("all");
  const [conflictDetected, setConflictDetected] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [schedulingAlgorithm, setSchedulingAlgorithm] = useState("forward");
  const [capacityType, setCapacityType] = useState("finite");
  const [autoScheduling, setAutoScheduling] = useState(false);

  // Simulated data fetch
  useEffect(() => {
    const fetchScheduleData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: ScheduleData = {
        id: scheduleId,
        scheduleId: `SCH-2025-${scheduleId}`,
        period: "Week 42, 2025",
        startDate: "2025-10-13",
        endDate: "2025-10-19",
        status: "draft",
        schedulingMethod: "Priority based with finite capacity",
        workOrders: [
          {
            id: "WO-2025-1001",
            product: "Ball Bearing 6205",
            productCode: "PRD-BB-6205",
            quantity: 1000,
            startDate: "2025-10-13T08:00",
            endDate: "2025-10-13T16:00",
            workCenter: "CNC-01",
            shift: "Morning",
            priority: 1,
            status: "scheduled",
            dependencies: [],
            estimatedHours: 8,
            operators: 2,
            setupTime: 1,
            cycleTime: 0.42,
            materialAvailable: true,
            toolsAvailable: true,
          },
          {
            id: "WO-2025-1002",
            product: "Shaft Assembly SA-450",
            productCode: "PRD-SA-450",
            quantity: 500,
            startDate: "2025-10-13T16:00",
            endDate: "2025-10-14T08:00",
            workCenter: "CNC-01",
            shift: "Night",
            priority: 1,
            status: "scheduled",
            dependencies: ["WO-2025-1001"],
            estimatedHours: 16,
            operators: 3,
            setupTime: 2,
            cycleTime: 1.68,
            materialAvailable: true,
            toolsAvailable: false,
          },
          {
            id: "WO-2025-1003",
            product: "Gear Pinion GP-230",
            productCode: "PRD-GP-230",
            quantity: 750,
            startDate: "2025-10-13T08:00",
            endDate: "2025-10-13T20:00",
            workCenter: "CNC-02",
            shift: "Morning",
            priority: 2,
            status: "scheduled",
            dependencies: [],
            estimatedHours: 12,
            operators: 2,
            setupTime: 1.5,
            cycleTime: 0.84,
            materialAvailable: true,
            toolsAvailable: true,
          },
          {
            id: "WO-2025-1004",
            product: "Housing Unit HU-890",
            productCode: "PRD-HU-890",
            quantity: 300,
            startDate: "2025-10-14T08:00",
            endDate: "2025-10-14T20:00",
            workCenter: "CNC-03",
            shift: "Morning",
            priority: 1,
            status: "scheduled",
            dependencies: ["WO-2025-1002"],
            estimatedHours: 12,
            operators: 2,
            setupTime: 2,
            cycleTime: 2.0,
            materialAvailable: false,
            toolsAvailable: true,
          },
        ],
        workCenters: [
          {
            id: "CNC-01",
            name: "CNC-01",
            capacity: 168,
            allocated: 144,
            utilization: 86,
            availableCapacity: 24,
            operatorsAvailable: 9,
            shifts: ["Morning", "Afternoon", "Night"],
          },
          {
            id: "CNC-02",
            name: "CNC-02",
            capacity: 168,
            allocated: 132,
            utilization: 79,
            availableCapacity: 36,
            operatorsAvailable: 9,
            shifts: ["Morning", "Afternoon", "Night"],
          },
          {
            id: "CNC-03",
            name: "CNC-03",
            capacity: 168,
            allocated: 120,
            utilization: 71,
            availableCapacity: 48,
            operatorsAvailable: 9,
            shifts: ["Morning", "Afternoon", "Night"],
          },
          {
            id: "Assembly-01",
            name: "Assembly-01",
            capacity: 120,
            allocated: 72,
            utilization: 60,
            availableCapacity: 48,
            operatorsAvailable: 6,
            shifts: ["Morning", "Afternoon"],
          },
        ],
        constraints: [
          {
            id: "resource_capacity",
            type: "Resource Capacity",
            enabled: true,
            description: "Must respect work center capacity limits",
          },
          {
            id: "material_availability",
            type: "Material Availability",
            enabled: true,
            description: "Schedule only if materials are available",
          },
          {
            id: "due_date",
            type: "Due Date",
            enabled: true,
            description: "Must meet customer due dates",
          },
          {
            id: "operation_sequence",
            type: "Operation Sequence",
            enabled: true,
            description: "Follow routing operation sequence",
          },
          {
            id: "setup_time",
            type: "Setup Time",
            enabled: true,
            description: "Include setup time between different jobs",
          },
        ],
      };

      const mockAvailableWOs: WorkOrder[] = [
        {
          id: "WO-2025-1005",
          product: "Flange FL-550",
          productCode: "PRD-FL-550",
          quantity: 600,
          startDate: "",
          endDate: "",
          workCenter: "",
          shift: "",
          priority: 3,
          status: "released",
          dependencies: [],
          estimatedHours: 8,
          operators: 2,
          setupTime: 1,
          cycleTime: 0.7,
          materialAvailable: true,
          toolsAvailable: true,
        },
        {
          id: "WO-2025-1006",
          product: "Coupling CG-770",
          productCode: "PRD-CG-770",
          quantity: 400,
          startDate: "",
          endDate: "",
          workCenter: "",
          shift: "",
          priority: 2,
          status: "released",
          dependencies: [],
          estimatedHours: 10,
          operators: 2,
          setupTime: 1.5,
          cycleTime: 1.2,
          materialAvailable: true,
          toolsAvailable: true,
        },
        {
          id: "WO-2025-1007",
          product: "Bushing BS-220",
          productCode: "PRD-BS-220",
          quantity: 800,
          startDate: "",
          endDate: "",
          workCenter: "",
          shift: "",
          priority: 3,
          status: "released",
          dependencies: [],
          estimatedHours: 6,
          operators: 1,
          setupTime: 0.5,
          cycleTime: 0.35,
          materialAvailable: true,
          toolsAvailable: true,
        },
      ];

      setScheduleData(mockData);
      setAvailableWOs(mockAvailableWOs);
      setLoading(false);
    };

    if (scheduleId) {
      fetchScheduleData();
    }
  }, [scheduleId]);

  // Real-time conflict detection
  useEffect(() => {
    if (scheduleData) {
      detectConflicts();
    }
  }, [scheduleData]);

  const detectConflicts = () => {
    const detectedConflicts: string[] = [];

    // Check resource conflicts
    scheduleData?.workCenters.forEach((wc) => {
      if (wc.utilization > 90) {
        detectedConflicts.push(
          `${wc.name} is overloaded at ${wc.utilization}% capacity`
        );
      }
    });

    // Check material availability
    scheduleData?.workOrders.forEach((wo) => {
      if (!wo.materialAvailable) {
        detectedConflicts.push(
          `${wo.id}: Material not available for ${wo.product}`
        );
      }
      if (!wo.toolsAvailable) {
        detectedConflicts.push(
          `${wo.id}: Tools not available for ${wo.product}`
        );
      }
    });

    // Check dependencies
    scheduleData?.workOrders.forEach((wo) => {
      wo.dependencies.forEach((depId) => {
        const depWO = scheduleData.workOrders.find((w) => w.id === depId);
        if (depWO && new Date(wo.startDate) < new Date(depWO.endDate)) {
          detectedConflicts.push(
            `${wo.id}: Starts before dependency ${depId} completes`
          );
        }
      });
    });

    setConflicts(detectedConflicts);
    setConflictDetected(detectedConflicts.length > 0);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    alert("Schedule saved successfully!");
  };

  const handlePublish = async () => {
    if (conflictDetected) {
      alert(
        "Cannot publish schedule with conflicts. Please resolve conflicts first."
      );
      return;
    }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    alert("Schedule published successfully!");
    router.push(`/production/scheduling/view/${scheduleId}`);
  };

  const handleAutoSchedule = async () => {
    setAutoScheduling(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Auto-scheduling completed! Review the optimized schedule.");
    setAutoScheduling(false);
  };

  const handleAddWO = (woId: string) => {
    const wo = availableWOs.find((w) => w.id === woId);
    if (wo && scheduleData) {
      const updatedWO = {
        ...wo,
        workCenter: scheduleData.workCenters[0].name,
        shift: "Morning",
        startDate: scheduleData.startDate + "T08:00",
        endDate: scheduleData.startDate + "T16:00",
        status: "scheduled",
      };
      setScheduleData({
        ...scheduleData,
        workOrders: [...scheduleData.workOrders, updatedWO],
      });
      setAvailableWOs(availableWOs.filter((w) => w.id !== woId));
    }
  };

  const handleRemoveWO = (woId: string) => {
    if (scheduleData) {
      const wo = scheduleData.workOrders.find((w) => w.id === woId);
      if (wo) {
        setScheduleData({
          ...scheduleData,
          workOrders: scheduleData.workOrders.filter((w) => w.id !== woId),
        });
        setAvailableWOs([...availableWOs, { ...wo, status: "released" }]);
      }
    }
  };

  const handleWOUpdate = (woId: string, field: string, value: any) => {
    if (scheduleData) {
      setScheduleData({
        ...scheduleData,
        workOrders: scheduleData.workOrders.map((wo) =>
          wo.id === woId ? { ...wo, [field]: value } : wo
        ),
      });
    }
  };

  const handleDragStart = (woId: string) => {
    setDraggedWO(woId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (workCenter: string) => {
    if (draggedWO && scheduleData) {
      handleWOUpdate(draggedWO, "workCenter", workCenter);
      setDraggedWO(null);
    }
  };

  const handleConstraintToggle = (constraintId: string) => {
    if (scheduleData) {
      setScheduleData({
        ...scheduleData,
        constraints: scheduleData.constraints.map((c) =>
          c.id === constraintId ? { ...c, enabled: !c.enabled } : c
        ),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-800">Schedule not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Edit Schedule - {scheduleData.scheduleId}
            </h1>
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{scheduleData.period}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {scheduleData.startDate} to {scheduleData.endDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
            <button
              onClick={handlePublish}
              disabled={saving || conflictDetected}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              <Send className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>

        {/* Conflict Alert */}
        {conflictDetected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">
                  {conflicts.length} Conflict(s) Detected
                </h3>
                <ul className="space-y-1">
                  {conflicts.map((conflict, idx) => (
                    <li key={idx} className="text-sm text-red-800">
                      • {conflict}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Scheduling Controls */}
        <div className="col-span-3 space-y-6">
          {/* Date Range */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={scheduleData.startDate}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={scheduleData.endDate}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Scheduling Algorithm */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Scheduling Method
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Algorithm
                </label>
                <select
                  value={schedulingAlgorithm}
                  onChange={(e) => setSchedulingAlgorithm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="forward">Forward Scheduling</option>
                  <option value="backward">Backward Scheduling</option>
                  <option value="priority">Priority Based</option>
                  <option value="fifo">FIFO</option>
                  <option value="edd">Earliest Due Date</option>
                  <option value="spt">Shortest Processing Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity Planning
                </label>
                <select
                  value={capacityType}
                  onChange={(e) => setCapacityType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="finite">Finite Capacity</option>
                  <option value="infinite">Infinite Capacity</option>
                </select>
              </div>
              <button
                onClick={handleAutoSchedule}
                disabled={autoScheduling}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
              >
                {autoScheduling ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Auto-Scheduling...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Auto-Schedule
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Constraints
            </h3>
            <div className="space-y-2">
              {scheduleData.constraints.map((constraint) => (
                <label
                  key={constraint.id}
                  className="flex items-start gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={constraint.enabled}
                    onChange={() => handleConstraintToggle(constraint.id)}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {constraint.type}
                    </div>
                    <div className="text-xs text-gray-600">
                      {constraint.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Work Center Capacity */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Work Center Capacity
            </h3>
            <div className="space-y-3">
              {scheduleData.workCenters.map((wc) => (
                <div key={wc.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {wc.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {wc.utilization}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        wc.utilization >= 90
                          ? "bg-red-500"
                          : wc.utilization >= 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${wc.utilization}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {wc.allocated}/{wc.capacity}h ({wc.availableCapacity}h
                    available)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Panel - Work Orders */}
        <div className="col-span-6 space-y-6">
          {/* Add Work Orders */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Scheduled Work Orders ({scheduleData.workOrders.length})
              </h3>
              <button
                onClick={() => setShowWOSelector(!showWOSelector)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Work Orders
              </button>
            </div>

            {/* Available Work Orders Selector */}
            {showWOSelector && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">
                  Available Work Orders
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableWOs.map((wo) => (
                    <div
                      key={wo.id}
                      className="flex justify-between items-center p-3 bg-white rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {wo.id} - {wo.product}
                        </div>
                        <div className="text-xs text-gray-600">
                          Qty: {wo.quantity} | Est: {wo.estimatedHours}h | P
                          {wo.priority}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddWO(wo.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                  {availableWOs.length === 0 && (
                    <p className="text-sm text-gray-600 text-center py-4">
                      No available work orders
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Work Orders Table */}
            <div className="space-y-2">
              {scheduleData.workOrders.map((wo) => (
                <div
                  key={wo.id}
                  draggable
                  onDragStart={() => handleDragStart(wo.id)}
                  className="border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-move"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {wo.id}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              wo.priority === 1
                                ? "bg-red-100 text-red-800"
                                : wo.priority === 2
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            P{wo.priority}
                          </span>
                          {!wo.materialAvailable && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          {!wo.toolsAvailable && (
                            <Wrench className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          {wo.product} ({wo.productCode})
                        </div>
                        <div className="text-xs text-gray-600">
                          Qty: {wo.quantity} | Est: {wo.estimatedHours}h | Setup:{" "}
                          {wo.setupTime}h
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveWO(wo.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Work Center
                      </label>
                      <select
                        value={wo.workCenter}
                        onChange={(e) =>
                          handleWOUpdate(wo.id, "workCenter", e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        {scheduleData.workCenters.map((wc) => (
                          <option key={wc.id} value={wc.name}>
                            {wc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Shift
                      </label>
                      <select
                        value={wo.shift}
                        onChange={(e) =>
                          handleWOUpdate(wo.id, "shift", e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Night">Night</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Operators
                      </label>
                      <input
                        type="number"
                        value={wo.operators}
                        onChange={(e) =>
                          handleWOUpdate(
                            wo.id,
                            "operators",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Start Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={wo.startDate}
                        onChange={(e) =>
                          handleWOUpdate(wo.id, "startDate", e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={wo.endDate}
                        onChange={(e) =>
                          handleWOUpdate(wo.id, "endDate", e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {wo.dependencies.length > 0 && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium text-gray-700">
                        Dependencies:
                      </span>{" "}
                      <span className="text-gray-600">
                        {wo.dependencies.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {scheduleData.workOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No work orders scheduled</p>
                  <p className="text-sm">Click "Add Work Orders" to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Visual Schedule & Material Check */}
        <div className="col-span-3 space-y-6">
          {/* Visual Timeline */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Schedule Timeline
            </h3>
            <div className="space-y-2">
              {scheduleData.workCenters.map((wc) => (
                <div
                  key={wc.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(wc.name)}
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[60px]"
                >
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {wc.name}
                  </div>
                  <div className="space-y-1">
                    {scheduleData.workOrders
                      .filter((wo) => wo.workCenter === wc.name)
                      .map((wo) => (
                        <div
                          key={wo.id}
                          className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                        >
                          {wo.id} - {wo.shift}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Drag and drop work orders to assign work centers
            </p>
          </div>

          {/* Material Availability */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Box className="w-4 h-4" />
              Material Availability
            </h3>
            <div className="space-y-2">
              {scheduleData.workOrders.map((wo) => (
                <div
                  key={wo.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm text-gray-900">{wo.id}</span>
                  <div className="flex items-center gap-2">
                    {wo.materialAvailable ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    {wo.toolsAvailable ? (
                      <Wrench className="w-4 h-4 text-green-600" />
                    ) : (
                      <Wrench className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Material Available</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                <Wrench className="w-3 h-3 text-green-600" />
                <span>Tools Available</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Schedule Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Total WOs:</span>
                <span className="font-semibold text-gray-900">
                  {scheduleData.workOrders.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Total Hours:</span>
                <span className="font-semibold text-gray-900">
                  {scheduleData.workOrders.reduce(
                    (sum, wo) => sum + wo.estimatedHours,
                    0
                  )}
                  h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Avg Utilization:</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(
                    scheduleData.workCenters.reduce(
                      (sum, wc) => sum + wc.utilization,
                      0
                    ) / scheduleData.workCenters.length
                  )}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Material Issues:</span>
                <span className="font-semibold text-red-600">
                  {
                    scheduleData.workOrders.filter((wo) => !wo.materialAvailable)
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Wrench Issues:</span>
                <span className="font-semibold text-orange-600">
                  {
                    scheduleData.workOrders.filter((wo) => !wo.toolsAvailable)
                      .length
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionSchedulingEditPage;
