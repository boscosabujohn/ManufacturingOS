"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Search,
  Filter,
  Zap,
  Target,
  Database,
  Box,
  RefreshCw,
  Send,
  Activity,
  Timer,
  TrendingUp,
  AlertCircle,
  FileText,
  BarChart3,
  Layers,
  CheckSquare,
  ArrowRight,
  Gauge,
  Wrench,
  Play,
} from "lucide-react";

// TypeScript Interfaces
interface WorkOrder {
  id: string;
  product: string;
  productCode: string;
  quantity: number;
  dueDate: string;
  status: "released" | "planned";
  priority: number;
  estimatedHours: number;
  setupTime: number;
  operations: number;
  materialAvailable: boolean;
  workCenter: string;
  selected: boolean;
}

interface ScheduleConstraint {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

interface SchedulingRule {
  id: string;
  name: string;
  description: string;
}

interface WorkCenter {
  id: string;
  name: string;
  capacity: number;
  utilization: number;
  operatorsAvailable: number;
}

interface SchedulePreview {
  workCenter: string;
  workOrders: {
    id: string;
    product: string;
    startTime: string;
    endTime: string;
    duration: number;
  }[];
  utilization: number;
}

const ProductionSchedulingAddPage = () => {
  const router = useRouter();

  const [scheduleId, setScheduleId] = useState("");
  const [planningPeriod, setPlanningPeriod] = useState("this_week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [availableWOs, setAvailableWOs] = useState<WorkOrder[]>([]);
  const [selectedWOs, setSelectedWOs] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [constraints, setConstraints] = useState<ScheduleConstraint[]>([]);
  const [schedulingMethod, setSchedulingMethod] = useState("priority");
  const [autoScheduling, setAutoScheduling] = useState(false);
  const [scheduleGenerated, setScheduleGenerated] = useState(false);
  const [schedulePreview, setSchedulePreview] = useState<SchedulePreview[]>([]);
  const [resourceUtilization, setResourceUtilization] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [materialProjection, setMaterialProjection] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Generate Schedule ID on mount
  useEffect(() => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    setScheduleId(`SCH-${year}-${random}`);
  }, []);

  // Load available work orders
  useEffect(() => {
    const mockWorkOrders: WorkOrder[] = [
      {
        id: "WO-2025-1001",
        product: "Ball Bearing 6205",
        productCode: "PRD-BB-6205",
        quantity: 1000,
        dueDate: "2025-10-20",
        status: "released",
        priority: 1,
        estimatedHours: 8,
        setupTime: 1,
        operations: 3,
        materialAvailable: true,
        workCenter: "CNC-01",
        selected: false,
      },
      {
        id: "WO-2025-1002",
        product: "Shaft Assembly SA-450",
        productCode: "PRD-SA-450",
        quantity: 500,
        dueDate: "2025-10-22",
        status: "released",
        priority: 1,
        estimatedHours: 16,
        setupTime: 2,
        operations: 5,
        materialAvailable: true,
        workCenter: "CNC-01",
        selected: false,
      },
      {
        id: "WO-2025-1003",
        product: "Gear Pinion GP-230",
        productCode: "PRD-GP-230",
        quantity: 750,
        dueDate: "2025-10-18",
        status: "released",
        priority: 2,
        estimatedHours: 12,
        setupTime: 1.5,
        operations: 4,
        materialAvailable: true,
        workCenter: "CNC-02",
        selected: false,
      },
      {
        id: "WO-2025-1004",
        product: "Housing Unit HU-890",
        productCode: "PRD-HU-890",
        quantity: 300,
        dueDate: "2025-10-25",
        status: "planned",
        priority: 1,
        estimatedHours: 12,
        setupTime: 2,
        operations: 6,
        materialAvailable: false,
        workCenter: "CNC-03",
        selected: false,
      },
      {
        id: "WO-2025-1005",
        product: "Flange FL-550",
        productCode: "PRD-FL-550",
        quantity: 600,
        dueDate: "2025-10-19",
        status: "released",
        priority: 3,
        estimatedHours: 8,
        setupTime: 1,
        operations: 3,
        materialAvailable: true,
        workCenter: "CNC-02",
        selected: false,
      },
      {
        id: "WO-2025-1006",
        product: "Coupling CG-770",
        productCode: "PRD-CG-770",
        quantity: 400,
        dueDate: "2025-10-21",
        status: "released",
        priority: 2,
        estimatedHours: 10,
        setupTime: 1.5,
        operations: 4,
        materialAvailable: true,
        workCenter: "CNC-01",
        selected: false,
      },
      {
        id: "WO-2025-1007",
        product: "Bushing BS-220",
        productCode: "PRD-BS-220",
        quantity: 800,
        dueDate: "2025-10-23",
        status: "released",
        priority: 3,
        estimatedHours: 6,
        setupTime: 0.5,
        operations: 2,
        materialAvailable: true,
        workCenter: "CNC-03",
        selected: false,
      },
      {
        id: "WO-2025-1008",
        product: "Valve Body VB-340",
        productCode: "PRD-VB-340",
        quantity: 200,
        dueDate: "2025-10-24",
        status: "planned",
        priority: 2,
        estimatedHours: 14,
        setupTime: 2,
        operations: 7,
        materialAvailable: false,
        workCenter: "CNC-02",
        selected: false,
      },
    ];

    const mockConstraints: ScheduleConstraint[] = [
      {
        id: "work_center_capacity",
        name: "Work Center Capacity",
        enabled: true,
        description: "Must respect work center capacity limits",
      },
      {
        id: "material_availability",
        name: "Material Availability",
        enabled: true,
        description: "Schedule only if materials are available",
      },
      {
        id: "due_dates",
        name: "Due Dates",
        enabled: true,
        description: "Must meet customer due dates",
      },
      {
        id: "operation_sequence",
        name: "Operation Sequence",
        enabled: true,
        description: "Follow routing operation sequence",
      },
      {
        id: "setup_time",
        name: "Setup Time",
        enabled: true,
        description: "Include setup time between different jobs",
      },
    ];

    setAvailableWOs(mockWorkOrders);
    setConstraints(mockConstraints);
  }, []);

  const handleWOToggle = (woId: string) => {
    if (selectedWOs.includes(woId)) {
      setSelectedWOs(selectedWOs.filter((id) => id !== woId));
    } else {
      setSelectedWOs([...selectedWOs, woId]);
    }
  };

  const handleSelectAll = () => {
    const filtered = getFilteredWorkOrders();
    if (selectedWOs.length === filtered.length) {
      setSelectedWOs([]);
    } else {
      setSelectedWOs(filtered.map((wo) => wo.id));
    }
  };

  const handleConstraintToggle = (constraintId: string) => {
    setConstraints(
      constraints.map((c) =>
        c.id === constraintId ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  const getFilteredWorkOrders = () => {
    return availableWOs.filter((wo) => {
      const matchesStatus =
        statusFilter === "all" || wo.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" ||
        wo.priority === parseInt(priorityFilter);
      const matchesDueDate =
        dueDateFilter === "all" ||
        (dueDateFilter === "urgent" &&
          new Date(wo.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) ||
        (dueDateFilter === "normal" &&
          new Date(wo.dueDate) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      const matchesSearch =
        searchQuery === "" ||
        wo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.productCode.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesPriority && matchesDueDate && matchesSearch;
    });
  };

  const handleAutoSchedule = async () => {
    if (selectedWOs.length === 0) {
      alert("Please select at least one work order to schedule");
      return;
    }

    setAutoScheduling(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate mock schedule preview
    const mockPreview: SchedulePreview[] = [
      {
        workCenter: "CNC-01",
        workOrders: selectedWOs
          .filter((id) => {
            const wo = availableWOs.find((w) => w.id === id);
            return wo?.workCenter === "CNC-01";
          })
          .slice(0, 3)
          .map((id, idx) => {
            const wo = availableWOs.find((w) => w.id === id)!;
            return {
              id: wo.id,
              product: wo.product,
              startTime: `Oct ${13 + idx}, 08:00`,
              endTime: `Oct ${13 + idx}, ${8 + wo.estimatedHours}:00`,
              duration: wo.estimatedHours,
            };
          }),
        utilization: 78,
      },
      {
        workCenter: "CNC-02",
        workOrders: selectedWOs
          .filter((id) => {
            const wo = availableWOs.find((w) => w.id === id);
            return wo?.workCenter === "CNC-02";
          })
          .slice(0, 3)
          .map((id, idx) => {
            const wo = availableWOs.find((w) => w.id === id)!;
            return {
              id: wo.id,
              product: wo.product,
              startTime: `Oct ${13 + idx}, 08:00`,
              endTime: `Oct ${13 + idx}, ${8 + wo.estimatedHours}:00`,
              duration: wo.estimatedHours,
            };
          }),
        utilization: 85,
      },
      {
        workCenter: "CNC-03",
        workOrders: selectedWOs
          .filter((id) => {
            const wo = availableWOs.find((w) => w.id === id);
            return wo?.workCenter === "CNC-03";
          })
          .slice(0, 2)
          .map((id, idx) => {
            const wo = availableWOs.find((w) => w.id === id)!;
            return {
              id: wo.id,
              product: wo.product,
              startTime: `Oct ${13 + idx}, 08:00`,
              endTime: `Oct ${13 + idx}, ${8 + wo.estimatedHours}:00`,
              duration: wo.estimatedHours,
            };
          }),
        utilization: 65,
      },
    ];

    const mockUtilization = [
      { workCenter: "CNC-01", capacity: 168, allocated: 131, utilization: 78 },
      { workCenter: "CNC-02", capacity: 168, allocated: 143, utilization: 85 },
      { workCenter: "CNC-03", capacity: 168, allocated: 109, utilization: 65 },
      { workCenter: "Assembly-01", capacity: 120, allocated: 72, utilization: 60 },
    ];

    const mockConflicts = [
      "CNC-02 capacity at 85% - approaching limit",
      "WO-2025-1004: Material not available (ETA: Oct 15)",
    ];

    const mockMaterialProjection = [
      {
        material: "Stainless Steel 304",
        code: "RM-ST-304",
        required: 2500,
        available: 2500,
        status: "available",
      },
      {
        material: "Aluminum 6061",
        code: "RM-AL-6061",
        required: 1800,
        available: 1200,
        status: "shortage",
        shortfall: 600,
      },
      {
        material: "Brass C360",
        code: "RM-BR-C360",
        required: 800,
        available: 800,
        status: "available",
      },
      {
        material: "Cast Iron GG25",
        code: "RM-CI-GG25",
        required: 1200,
        available: 1000,
        status: "partial",
        shortfall: 200,
      },
    ];

    setSchedulePreview(mockPreview);
    setResourceUtilization(mockUtilization);
    setConflicts(mockConflicts);
    setMaterialProjection(mockMaterialProjection);
    setScheduleGenerated(true);
    setAutoScheduling(false);
  };

  const handleSaveDraft = async () => {
    if (selectedWOs.length === 0) {
      alert("Please select at least one work order");
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    alert("Schedule saved as draft!");
    router.push("/production/scheduling");
  };

  const handlePublish = async () => {
    if (!scheduleGenerated) {
      alert("Please generate schedule first by clicking Auto-Schedule");
      return;
    }

    if (conflicts.length > 0) {
      const confirm = window.confirm(
        `There are ${conflicts.length} conflict(s). Do you want to publish anyway?`
      );
      if (!confirm) return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    alert("Schedule published successfully!");
    router.push("/production/scheduling");
  };

  const getPeriodDates = () => {
    const today = new Date();
    switch (planningPeriod) {
      case "this_week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return {
          start: weekStart.toISOString().split("T")[0],
          end: weekEnd.toISOString().split("T")[0],
        };
      case "next_week":
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() - today.getDay() + 8);
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        return {
          start: nextWeekStart.toISOString().split("T")[0],
          end: nextWeekEnd.toISOString().split("T")[0],
        };
      case "this_month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          start: monthStart.toISOString().split("T")[0],
          end: monthEnd.toISOString().split("T")[0],
        };
      case "custom":
        return { start: customStartDate, end: customEndDate };
      default:
        return { start: "", end: "" };
    }
  };

  const filteredWOs = getFilteredWorkOrders();
  const periodDates = getPeriodDates();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Production Schedule
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                {scheduleId}
              </span>
              <span className="text-gray-600">Auto-generated</span>
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
              onClick={handleSaveDraft}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save as Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              <Send className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Configuration */}
        <div className="col-span-3 space-y-6">
          {/* Planning Period */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Planning Period
            </h3>
            <div className="space-y-3">
              <select
                value={planningPeriod}
                onChange={(e) => setPlanningPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="this_week">This Week</option>
                <option value="next_week">Next Week</option>
                <option value="this_month">This Month</option>
                <option value="custom">Custom Period</option>
              </select>

              {planningPeriod === "custom" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {periodDates.start && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-900 font-medium mb-1">
                    Schedule Period:
                  </div>
                  <div className="text-sm text-blue-800">
                    {periodDates.start} to {periodDates.end}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scheduling Constraints */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Scheduling Constraints
            </h3>
            <div className="space-y-2">
              {constraints.map((constraint) => (
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
                      {constraint.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {constraint.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Scheduling Method */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Scheduling Method
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="priority"
                  checked={schedulingMethod === "priority"}
                  onChange={(e) => setSchedulingMethod(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Priority Based
                  </div>
                  <div className="text-xs text-gray-600">
                    Critical first scheduling
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="fifo"
                  checked={schedulingMethod === "fifo"}
                  onChange={(e) => setSchedulingMethod(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">FIFO</div>
                  <div className="text-xs text-gray-600">
                    First In First Out
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="edd"
                  checked={schedulingMethod === "edd"}
                  onChange={(e) => setSchedulingMethod(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">EDD</div>
                  <div className="text-xs text-gray-600">
                    Earliest Due Date
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="spt"
                  checked={schedulingMethod === "spt"}
                  onChange={(e) => setSchedulingMethod(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">SPT</div>
                  <div className="text-xs text-gray-600">
                    Shortest Processing Time
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="custom"
                  checked={schedulingMethod === "custom"}
                  onChange={(e) => setSchedulingMethod(e.target.value)}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Custom Rules
                  </div>
                  <div className="text-xs text-gray-600">
                    Define custom logic
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Auto Schedule Button */}
          <button
            onClick={handleAutoSchedule}
            disabled={autoScheduling || selectedWOs.length === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:from-gray-400 disabled:to-gray-400 shadow-lg"
          >
            {autoScheduling ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="font-semibold">Generating Schedule...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Auto-Schedule</span>
              </>
            )}
          </button>
        </div>

        {/* Middle Panel - Work Order Selection */}
        <div className="col-span-6 space-y-6">
          {/* Work Order Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Select Work Orders
              </h3>
              <span className="text-sm text-gray-600">
                {selectedWOs.length} of {availableWOs.length} selected
              </span>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search WO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="released">Released</option>
                <option value="planned">Planned</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Priority</option>
                <option value="1">Priority 1</option>
                <option value="2">Priority 2</option>
                <option value="3">Priority 3</option>
              </select>
              <select
                value={dueDateFilter}
                onChange={(e) => setDueDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Due Dates</option>
                <option value="urgent">Urgent (Within 7 days)</option>
                <option value="normal">Normal (After 7 days)</option>
              </select>
            </div>

            {/* Select All */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedWOs.length === filteredWOs.length && filteredWOs.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All Filtered
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {filteredWOs.length} work orders
              </span>
            </div>

            {/* Work Orders List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredWOs.map((wo) => (
                <label
                  key={wo.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedWOs.includes(wo.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedWOs.includes(wo.id)}
                    onChange={() => handleWOToggle(wo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {wo.id}
                      </span>
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
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          wo.status === "released"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {wo.status}
                      </span>
                      {!wo.materialAvailable && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          Material Issue
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      {wo.product} ({wo.productCode})
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Qty:</span> {wo.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Est:</span>{" "}
                        {wo.estimatedHours}h
                      </div>
                      <div>
                        <span className="font-medium">Due:</span> {wo.dueDate}
                      </div>
                      <div>
                        <span className="font-medium">WC:</span>{" "}
                        {wo.workCenter}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule Preview */}
          {scheduleGenerated && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Schedule Preview (Gantt Chart)
              </h3>

              {/* Gantt Chart Placeholder */}
              <div className="space-y-3">
                {schedulePreview.map((preview) => (
                  <div key={preview.workCenter}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {preview.workCenter}
                      </span>
                      <span className="text-sm text-gray-600">
                        {preview.utilization}% utilized
                      </span>
                    </div>
                    <div className="space-y-1">
                      {preview.workOrders.map((wo) => (
                        <div key={wo.id} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 w-32">
                            {wo.id}
                          </span>
                          <div className="flex-1 relative h-8 bg-gray-100 rounded">
                            <div
                              className="absolute h-full bg-blue-500 rounded flex items-center px-2"
                              style={{ width: `${(wo.duration / 24) * 100}%` }}
                            >
                              <span className="text-xs text-white truncate">
                                {wo.product}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 w-24">
                            {wo.duration}h
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Results & Analysis */}
        <div className="col-span-3 space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Selection Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Work Orders:</span>
                <span className="font-semibold text-gray-900">
                  {selectedWOs.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Total Hours:</span>
                <span className="font-semibold text-gray-900">
                  {selectedWOs
                    .reduce((sum, id) => {
                      const wo = availableWOs.find((w) => w.id === id);
                      return sum + (wo?.estimatedHours || 0);
                    }, 0)
                    .toFixed(1)}
                  h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Total Quantity:</span>
                <span className="font-semibold text-gray-900">
                  {selectedWOs.reduce((sum, id) => {
                    const wo = availableWOs.find((w) => w.id === id);
                    return sum + (wo?.quantity || 0);
                  }, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Priority 1:</span>
                <span className="font-semibold text-red-600">
                  {
                    selectedWOs.filter((id) => {
                      const wo = availableWOs.find((w) => w.id === id);
                      return wo?.priority === 1;
                    }).length
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Resource Utilization */}
          {scheduleGenerated && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Resource Utilization
              </h3>
              <div className="space-y-3">
                {resourceUtilization.map((resource) => (
                  <div key={resource.workCenter}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {resource.workCenter}
                      </span>
                      <span className="text-xs text-gray-600">
                        {resource.utilization}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          resource.utilization >= 90
                            ? "bg-red-500"
                            : resource.utilization >= 80
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${resource.utilization}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conflicts */}
          {scheduleGenerated && conflicts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">
                  Conflicts Detected
                </h3>
              </div>
              <ul className="space-y-2">
                {conflicts.map((conflict, idx) => (
                  <li key={idx} className="text-sm text-red-800">
                    • {conflict}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Material Projection */}
          {scheduleGenerated && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Material Requirements
              </h3>
              <div className="space-y-2">
                {materialProjection.map((material, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      material.status === "available"
                        ? "bg-green-50"
                        : material.status === "partial"
                        ? "bg-yellow-50"
                        : "bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {material.material}
                        </div>
                        <div className="text-xs text-gray-600">
                          {material.code}
                        </div>
                      </div>
                      {material.status === "available" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : material.status === "partial" ? (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="text-xs text-gray-700">
                      Required: {material.required} | Available:{" "}
                      {material.available}
                    </div>
                    {material.shortfall && (
                      <div className="text-xs text-red-700 mt-1">
                        Shortage: {material.shortfall} units
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {scheduleGenerated && conflicts.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">
                  Schedule Optimized
                </h3>
              </div>
              <p className="text-sm text-green-800">
                No conflicts detected. Schedule is ready to publish!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionSchedulingAddPage;
