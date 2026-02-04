'use client';

import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  FileText,
  Download,
  Calculator,
  Eye,
  Calendar,
  Users,
  Lock,
} from 'lucide-react';

interface ProjectProfitability {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  projectType: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  contractValue: number;
  actualRevenue: number;
  revenueRecognized: number;
  totalBudget: number;
  actualCost: number;
  directCosts: CostBreakdown;
  indirectCosts: CostBreakdown;
  grossProfit: number;
  grossMargin: number;
  netProfit: number;
  netMargin: number;
  budgetVariance: number;
  variancePercent: number;
  billedAmount: number;
  outstandingAmount: number;
  paymentStatus: 'Fully Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface CostBreakdown {
  material: number;
  labor: number;
  subcontractor: number;
  equipment: number;
  overhead: number;
  other: number;
  total: number;
}

// 1. Profitability Details Modal
interface ProfitabilityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectProfitability | null;
}

export function ProfitabilityDetailsModal({ isOpen, onClose, project }: ProfitabilityDetailsModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Profitability Details</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="font-semibold text-blue-900">{project.projectName}</h3>
            <p className="text-sm text-blue-700">{project.projectId} - {project.clientName}</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-600 mb-1">Contract Value</p>
              <p className="text-xl font-bold text-green-900">₹{project.contractValue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600 mb-1">Revenue Recognized</p>
              <p className="text-xl font-bold text-purple-900">₹{project.revenueRecognized.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-600 mb-1">Total Cost</p>
              <p className="text-xl font-bold text-orange-900">₹{project.actualCost.toLocaleString('en-IN')}</p>
            </div>
            <div className={`border rounded-lg p-3 ${project.netProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-xs mb-1 ${project.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>Net Profit</p>
              <p className={`text-xl font-bold ${project.netProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                ₹{project.netProfit.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-3">Direct Costs</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium">₹{project.directCosts.material.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Labor:</span>
                  <span className="font-medium">₹{project.directCosts.labor.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subcontractor:</span>
                  <span className="font-medium">₹{project.directCosts.subcontractor.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Equipment:</span>
                  <span className="font-medium">₹{project.directCosts.equipment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                  <span className="text-gray-900">Total Direct:</span>
                  <span>₹{project.directCosts.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-3">Indirect Costs</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overhead:</span>
                  <span className="font-medium">₹{project.indirectCosts.overhead.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Other:</span>
                  <span className="font-medium">₹{project.indirectCosts.other.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                  <span className="text-gray-900">Total Indirect:</span>
                  <span>₹{project.indirectCosts.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Profitability Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gross Profit:</span>
                  <span className="font-semibold text-gray-900">₹{project.grossProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gross Margin:</span>
                  <span className="font-semibold text-gray-900">{project.grossMargin.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Profit:</span>
                  <span className={`font-semibold ${project.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{project.netProfit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Margin:</span>
                  <span className={`font-semibold ${project.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {project.netMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Margin Analysis Modal
interface MarginAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectProfitability | null;
  projects?: ProjectProfitability[];
}

export function MarginAnalysisModal({ isOpen, onClose, project, projects }: MarginAnalysisModalProps) {
  if (!isOpen) return null;

  const targetGrossMargin = 35;
  const targetNetMargin = 25;

  // Aggregate View
  if (!project && projects) {
    const avgGrossMargin = projects.reduce((sum, p) => sum + p.grossMargin, 0) / projects.length;
    const avgNetMargin = projects.reduce((sum, p) => sum + p.netMargin, 0) / projects.length;
    const belowTargetProjects = projects.filter(p => p.grossMargin < targetGrossMargin);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Portfolio Margin Analysis</h2>
              </div>
              <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="font-semibold text-green-900">Aggregate Performance</h3>
              <p className="text-sm text-green-700">Analysis across {projects.length} projects</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-600 mb-2">Avg Gross Margin</p>
                <p className="text-3xl font-bold text-blue-900">{avgGrossMargin.toFixed(1)}%</p>
                <p className="text-xs text-blue-700 mt-1">Target: {targetGrossMargin}%</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-600 mb-2">Avg Net Margin</p>
                <p className="text-3xl font-bold text-purple-900">{avgNetMargin.toFixed(1)}%</p>
                <p className="text-xs text-purple-700 mt-1">Target: {targetNetMargin}%</p>
              </div>
            </div>

            {belowTargetProjects.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-semibold text-yellow-900 mb-2">Projects Below Target ({belowTargetProjects.length})</h4>
                <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                  {belowTargetProjects.slice(0, 5).map(p => (
                    <li key={p.id}>{p.projectName} ({p.grossMargin.toFixed(1)}%)</li>
                  ))}
                  {belowTargetProjects.length > 5 && <li>...and {belowTargetProjects.length - 5} more</li>}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Margin Analysis</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h3 className="font-semibold text-green-900">{project.projectName}</h3>
            <p className="text-sm text-green-700">Margin performance analysis</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-600 mb-2">Gross Margin</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-900">{project.grossMargin.toFixed(1)}%</p>
                  <p className="text-xs text-blue-700 mt-1">Actual</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-blue-700">{targetGrossMargin}%</p>
                  <p className="text-xs text-blue-600">Target</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className={project.grossMargin >= targetGrossMargin ? 'text-green-600' : 'text-red-600'}>
                    {project.grossMargin >= targetGrossMargin ? 'Above' : 'Below'} Target
                  </span>
                  <span className="font-semibold">
                    {Math.abs(project.grossMargin - targetGrossMargin).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${project.grossMargin >= targetGrossMargin ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((project.grossMargin / targetGrossMargin) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-600 mb-2">Net Margin</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-900">{project.netMargin.toFixed(1)}%</p>
                  <p className="text-xs text-purple-700 mt-1">Actual</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-purple-700">{targetNetMargin}%</p>
                  <p className="text-xs text-purple-600">Target</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className={project.netMargin >= targetNetMargin ? 'text-green-600' : 'text-red-600'}>
                    {project.netMargin >= targetNetMargin ? 'Above' : 'Below'} Target
                  </span>
                  <span className="font-semibold">
                    {Math.abs(project.netMargin - targetNetMargin).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${project.netMargin >= targetNetMargin ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((project.netMargin / targetNetMargin) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Margin Breakdown</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold">₹{project.revenueRecognized.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Direct Costs:</span>
                  <span className="font-semibold">₹{project.directCosts.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold mb-2 pt-2 border-t">
                  <span className="text-gray-900">Gross Profit:</span>
                  <span className="text-green-600">₹{project.grossProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Indirect Costs:</span>
                  <span className="font-semibold">₹{project.indirectCosts.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                  <span className="text-gray-900">Net Profit:</span>
                  <span className={project.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ₹{project.netProfit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {(project.grossMargin < targetGrossMargin || project.netMargin < targetNetMargin) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900">Margin Below Target</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    Review cost structure and consider value engineering to improve margins.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Revenue Recognition Modal
interface RevenueRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectProfitability | null;
  onUpdate: (data: any) => void;
}

export function RevenueRecognitionModal({ isOpen, onClose, project, onUpdate }: RevenueRecognitionModalProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [milestone, setMilestone] = useState('');
  const [percentage, setPercentage] = useState('');

  const handleSubmit = () => {
    onUpdate({
      projectId: project?.id,
      amount: parseFloat(amount),
      date,
      milestone,
      percentage: parseFloat(percentage),
    });
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Revenue Recognition</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h3 className="font-semibold text-purple-900">{project.projectName}</h3>
            <div className="flex gap-2 mt-2 text-sm">
              <div>
                <span className="text-purple-600">Contract Value: </span>
                <span className="font-semibold">₹{project.contractValue.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-purple-600">Recognized: </span>
                <span className="font-semibold">₹{project.revenueRecognized.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-purple-600">Remaining: </span>
                <span className="font-semibold">
                  ₹{(project.contractValue - project.revenueRecognized).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage of Total *</label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recognition Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Milestone</label>
              <select
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select milestone</option>
                <option value="Design Approval">Design Approval</option>
                <option value="Material Delivery">Material Delivery</option>
                <option value="Installation Complete">Installation Complete</option>
                <option value="Testing Complete">Testing Complete</option>
                <option value="Project Handover">Project Handover</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || !date || !percentage}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Recognize Revenue
          </button>
        </div>
      </div>
    </div>
  );
}

// 4-10: Additional Modals (streamlined for efficiency)

export function ProfitForecastModal({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project: ProjectProfitability | null }) {
  if (!isOpen || !project) return null;
  const projectedRevenue = project.contractValue;
  const projectedCost = (project.actualCost / (project.revenueRecognized / project.contractValue));
  const projectedProfit = projectedRevenue - projectedCost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Profit Forecast</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h3 className="font-semibold text-orange-900">{project.projectName}</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-1">Projected Revenue</p>
              <p className="text-xl font-bold text-blue-900">₹{projectedRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600 mb-1">Projected Cost</p>
              <p className="text-xl font-bold text-purple-900">₹{Math.round(projectedCost).toLocaleString('en-IN')}</p>
            </div>
            <div className={`border rounded-lg p-3 ${projectedProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-xs mb-1 ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>Projected Profit</p>
              <p className={`text-xl font-bold ${projectedProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                ₹{Math.round(projectedProfit).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function CostAllocationModal({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project: ProjectProfitability | null }) {
  if (!isOpen || !project) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PieChart className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Cost Allocation</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">Cost allocation details for {project.projectName}</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentTrackingModal({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project: ProjectProfitability | null }) {
  if (!isOpen || !project) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Payment Tracking</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <h3 className="font-semibold text-teal-900">{project.projectName}</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-1">Billed Amount</p>
              <p className="text-lg font-bold text-blue-900">₹{project.billedAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-600 mb-1">Received</p>
              <p className="text-lg font-bold text-green-900">
                ₹{(project.billedAmount - project.outstandingAmount).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-600 mb-1">Outstanding</p>
              <p className="text-lg font-bold text-orange-900">₹{project.outstandingAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfitabilityReportModal({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project: ProjectProfitability | null }) {
  if (!isOpen || !project) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Profitability Report</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">Comprehensive profitability report for {project.projectName}</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExportProfitabilityModal({ isOpen, onClose, onExport }: { isOpen: boolean; onClose: () => void; onExport: (format: string) => void }) {
  const [format, setFormat] = useState('Excel');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Export Profitability Data</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option>Excel</option>
            <option>PDF</option>
            <option>CSV</option>
          </select>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onExport(format)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Export
          </button>
        </div>
      </div>
    </div>
  );
}


export function BenchmarkComparisonModal({ isOpen, onClose, projects }: { isOpen: boolean; onClose: () => void; projects: ProjectProfitability[] }) {
  if (!isOpen) return null;
  const sortedProjects = [...projects].sort((a, b) => b.netMargin - a.netMargin);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Benchmark Comparison</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-2">Comparing Top 5 Projects by Net Margin</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-3 py-2">Project Name</th>
                  <th className="px-3 py-2 text-right">Revenue</th>
                  <th className="px-3 py-2 text-right">Net Profit</th>
                  <th className="px-3 py-2 text-right">Net Margin</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.slice(0, 5).map(project => (
                  <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-900">{project.projectName}</td>
                    <td className="px-3 py-2 text-right">₹{project.revenueRecognized.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-right">₹{project.netProfit.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-right font-bold text-pink-600">{project.netMargin.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function RiskAssessmentModal({ isOpen, onClose, project, projects }: { isOpen: boolean; onClose: () => void; project: ProjectProfitability | null, projects?: ProjectProfitability[] }) {
  if (!isOpen) return null;

  if (!project && projects) {
    const highRisk = projects.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical');
    const mediumRisk = projects.filter(p => p.riskLevel === 'Medium');
    const lowRisk = projects.filter(p => p.riskLevel === 'Low');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Portfolio Risk Assessment</h2>
              </div>
              <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{highRisk.length}</p>
                <p className="text-sm text-red-700">High Risk Projects</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600">{mediumRisk.length}</p>
                <p className="text-sm text-yellow-700">Medium Risk Projects</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{lowRisk.length}</p>
                <p className="text-sm text-green-700">Low Risk Projects</p>
              </div>
            </div>

            {highRisk.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-semibold text-red-900 mb-2">High Risk Projects Attention Needed</h4>
                <ul className="list-disc list-inside text-sm text-red-800">
                  {highRisk.map(p => (
                    <li key={p.id}>{p.projectName} (Margin: {p.netMargin.toFixed(1)}%)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Risk Assessment</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h3 className="font-semibold text-red-900">{project.projectName}</h3>
            <p className="text-sm text-red-700">Risk Level: <span className="font-semibold">{project.riskLevel}</span></p>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
