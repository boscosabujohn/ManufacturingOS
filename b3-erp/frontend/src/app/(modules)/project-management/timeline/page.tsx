'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Calendar,
  TrendingUp,
  Clock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Calculator,
} from 'lucide-react';

interface DrawingTimeline {
  id: string;
  timelineNumber: string;
  projectId: string;
  projectName: string;
  drawingType: string;
  quantity: number;
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
  estimatedDays: number;
  startDate: string;
  targetDate: string;
  assignedDesigner: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  progress: number;
}

const mockTimelines: DrawingTimeline[] = [
  {
    id: '1',
    timelineNumber: 'TL-2025-001',
    projectId: 'PRJ-2025-001',
    projectName: 'Taj Hotels - Commercial Kitchen Setup',
    drawingType: 'Technical Fabrication Drawings',
    quantity: 12,
    complexity: 'High',
    estimatedDays: 14,
    startDate: '2025-01-18',
    targetDate: '2025-02-01',
    assignedDesigner: 'Technical Designer Team A',
    status: 'In Progress',
    progress: 60,
  },
  {
    id: '2',
    timelineNumber: 'TL-2025-002',
    projectId: 'PRJ-2025-001',
    projectName: 'Taj Hotels - Commercial Kitchen Setup',
    drawingType: 'Assembly Drawings',
    quantity: 8,
    complexity: 'Medium',
    estimatedDays: 7,
    startDate: '2025-01-25',
    targetDate: '2025-02-01',
    assignedDesigner: 'Technical Designer Team B',
    status: 'Not Started',
    progress: 0,
  },
  {
    id: '3',
    timelineNumber: 'TL-2025-003',
    projectId: 'PRJ-2025-002',
    projectName: 'BigBasket Cold Storage Facility',
    drawingType: 'Cold Room Technical Drawings',
    quantity: 15,
    complexity: 'Very High',
    estimatedDays: 21,
    startDate: '2025-01-22',
    targetDate: '2025-02-12',
    assignedDesigner: 'Senior Technical Designer',
    status: 'Not Started',
    progress: 0,
  },
];

export default function DrawingTimelinePage() {
  const [timelines] = useState<DrawingTimeline[]>(mockTimelines);
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculator state
  const [calcDrawingCount, setCalcDrawingCount] = useState(10);
  const [calcComplexity, setCalcComplexity] = useState<'Low' | 'Medium' | 'High' | 'Very High'>('Medium');
  const [calcDesignerCount, setCalcDesignerCount] = useState(2);
  const [calcEstimatedDays, setCalcEstimatedDays] = useState(0);

  const calculateTimeline = () => {
    const complexityMultiplier = {
      'Low': 0.5,
      'Medium': 1,
      'High': 1.8,
      'Very High': 2.5,
    };

    const baseHoursPerDrawing = 8; // 1 day
    const hours = calcDrawingCount * baseHoursPerDrawing * complexityMultiplier[calcComplexity];
    const hoursPerDesigner = hours / calcDesignerCount;
    const days = Math.ceil(hoursPerDesigner / 8); // 8 hours per day

    setCalcEstimatedDays(days);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Very High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: timelines.length,
    inProgress: timelines.filter((t) => t.status === 'In Progress').length,
    notStarted: timelines.filter((t) => t.status === 'Not Started').length,
    avgDays: Math.round(timelines.reduce((sum, t) => sum + t.estimatedDays, 0) / timelines.length),
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/project-management"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Drawing Timeline Calculator
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Phase 3: Calculate and track technical drawing completion timelines
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              {showCalculator ? 'Hide' : 'Show'} Calculator
            </button>
          </div>
        </div>

        {/* Calculator Panel */}
        {showCalculator && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Drawings
                </label>
                <input
                  type="number"
                  value={calcDrawingCount}
                  onChange={(e) => setCalcDrawingCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complexity Level
                </label>
                <select
                  value={calcComplexity}
                  onChange={(e) => setCalcComplexity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low (0.5x)</option>
                  <option value="Medium">Medium (1x)</option>
                  <option value="High">High (1.8x)</option>
                  <option value="Very High">Very High (2.5x)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Designers
                </label>
                <input
                  type="number"
                  value={calcDesignerCount}
                  onChange={(e) => setCalcDesignerCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={calculateTimeline}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Calculate
                </button>
              </div>
            </div>

            {calcEstimatedDays > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Estimated Timeline</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {calcEstimatedDays} business days
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Based on {calcDrawingCount} drawings at {calcComplexity.toLowerCase()} complexity
                      with {calcDesignerCount} designer(s)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Not Started</p>
                <p className="text-2xl font-bold text-gray-600">{stats.notStarted}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgDays} days</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Timelines List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Active Drawing Timelines</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {timelines.map((timeline) => (
              <div key={timeline.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {timeline.timelineNumber} - {timeline.drawingType}
                      </h3>
                      <p className="text-sm text-gray-600">{timeline.projectName}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-medium text-gray-900">{timeline.quantity} drawings</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Complexity</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(timeline.complexity)}`}>
                          {timeline.complexity}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Estimated Duration</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeline.estimatedDays} days
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Assigned To</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {timeline.assignedDesigner}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {timeline.startDate} → {timeline.targetDate}
                        </span>
                        <span className="font-medium text-gray-900">{timeline.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${timeline.progress === 100
                            ? 'bg-green-600'
                            : timeline.progress > 0
                              ? 'bg-yellow-600'
                              : 'bg-gray-400'
                            }`}
                          style={{ width: `${timeline.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(timeline.status)}`}>
                      {timeline.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">About Drawing Timeline Calculator</h3>
              <p className="text-sm text-blue-700 mt-1">
                Step 3.6: Calculate technical drawing completion dates based on quantity, complexity,
                and available designers. System estimates timeline using: drawings × complexity multiplier
                ÷ designers × 8 hrs/day. Track progress against target dates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
