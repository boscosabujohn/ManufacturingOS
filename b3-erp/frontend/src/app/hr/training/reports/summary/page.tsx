'use client';

import { useState } from 'react';
import { FileText, Users, BookOpen, Award, TrendingUp, Clock, Calendar, BarChart3, IndianRupee } from 'lucide-react';
import DataTable from '@/components/DataTable';

interface DepartmentTraining {
  department: string;
  employees: number;
  programsCompleted: number;
  programsInProgress: number;
  totalHours: number;
  certifications: number;
  avgCompletion: number;
  budgetSpent: number;
  budgetTotal: number;
}

export default function TrainingSummaryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-q3');

  const mockDepartmentData: DepartmentTraining[] = [
    {
      department: 'Manufacturing', employees: 120, programsCompleted: 145, programsInProgress: 38,
      totalHours: 2340, certifications: 89, avgCompletion: 82, budgetSpent: 1850000, budgetTotal: 2500000
    },
    {
      department: 'Quality Assurance', employees: 25, programsCompleted: 48, programsInProgress: 12,
      totalHours: 780, certifications: 32, avgCompletion: 88, budgetSpent: 620000, budgetTotal: 800000
    },
    {
      department: 'Maintenance', employees: 22, programsCompleted: 38, programsInProgress: 8,
      totalHours: 520, certifications: 24, avgCompletion: 85, budgetSpent: 450000, budgetTotal: 600000
    },
    {
      department: 'Safety & Compliance', employees: 15, programsCompleted: 52, programsInProgress: 5,
      totalHours: 340, certifications: 28, avgCompletion: 92, budgetSpent: 280000, budgetTotal: 400000
    },
    {
      department: 'Warehouse & Logistics', employees: 35, programsCompleted: 42, programsInProgress: 15,
      totalHours: 680, certifications: 18, avgCompletion: 78, budgetSpent: 510000, budgetTotal: 700000
    },
    {
      department: 'Human Resources', employees: 12, programsCompleted: 28, programsInProgress: 6,
      totalHours: 420, certifications: 15, avgCompletion: 90, budgetSpent: 340000, budgetTotal: 450000
    }
  ];

  const overallStats = {
    totalEmployees: mockDepartmentData.reduce((sum, d) => sum + d.employees, 0),
    totalProgramsCompleted: mockDepartmentData.reduce((sum, d) => sum + d.programsCompleted, 0),
    totalProgramsInProgress: mockDepartmentData.reduce((sum, d) => sum + d.programsInProgress, 0),
    totalHours: mockDepartmentData.reduce((sum, d) => sum + d.totalHours, 0),
    totalCertifications: mockDepartmentData.reduce((sum, d) => sum + d.certifications, 0),
    avgCompletion: Math.round(mockDepartmentData.reduce((sum, d) => sum + d.avgCompletion, 0) / mockDepartmentData.length),
    totalBudgetSpent: mockDepartmentData.reduce((sum, d) => sum + d.budgetSpent, 0),
    totalBudget: mockDepartmentData.reduce((sum, d) => sum + d.budgetTotal, 0)
  };

  const topTrainings = [
    { program: 'Workplace Safety & OSHA Compliance', enrollments: 156, completions: 142, completionRate: 91 },
    { program: 'Quality Control Fundamentals', enrollments: 124, completions: 112, completionRate: 90 },
    { program: 'Lean Manufacturing Fundamentals', enrollments: 98, completions: 86, completionRate: 88 },
    { program: 'CNC Programming Advanced', enrollments: 89, completions: 72, completionRate: 81 },
    { program: 'Leadership for Supervisors', enrollments: 78, completions: 65, completionRate: 83 }
  ];

  const columns = [
    { key: 'department', label: 'Department', sortable: true,
      render: (v: string) => <div className="font-semibold text-gray-900">{v}</div>
    },
    { key: 'employees', label: 'Employees', sortable: true,
      render: (v: number) => <div className="text-sm text-gray-700">{v}</div>
    },
    { key: 'programsCompleted', label: 'Completed', sortable: true,
      render: (v: number) => <div className="text-sm font-semibold text-green-700">{v}</div>
    },
    { key: 'programsInProgress', label: 'In Progress', sortable: true,
      render: (v: number) => <div className="text-sm text-blue-700">{v}</div>
    },
    { key: 'totalHours', label: 'Total Hours', sortable: true,
      render: (v: number) => <div className="text-sm text-gray-700">{v}h</div>
    },
    { key: 'certifications', label: 'Certifications', sortable: true,
      render: (v: number) => <div className="text-sm font-semibold text-orange-700">{v}</div>
    },
    { key: 'avgCompletion', label: 'Completion %', sortable: true,
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
            <div
              className={`h-2 rounded-full ${v >= 85 ? 'bg-green-500' : v >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${v}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-900">{v}%</span>
        </div>
      )
    },
    { key: 'budgetSpent', label: 'Budget Used', sortable: true,
      render: (v: number, row: DepartmentTraining) => (
        <div className="text-sm text-gray-700">
          <div>₹{(v / 100000).toFixed(1)}L</div>
          <div className="text-xs text-gray-500">of ₹{(row.budgetTotal / 100000).toFixed(1)}L</div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-8 w-8 text-emerald-600" />
          Training Summary Report
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive overview of organizational training activities</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Report Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="2024-q3">Q3 2024 (Jul - Sep)</option>
            <option value="2024-q2">Q2 2024 (Apr - Jun)</option>
            <option value="2024-q1">Q1 2024 (Jan - Mar)</option>
            <option value="2024-ytd">Year to Date 2024</option>
            <option value="2024-full">Full Year 2024</option>
          </select>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees Trained</p>
              <p className="text-2xl font-bold text-emerald-600">{overallStats.totalEmployees}</p>
            </div>
            <Users className="h-10 w-10 text-emerald-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Programs Completed</p>
              <p className="text-2xl font-bold text-green-600">{overallStats.totalProgramsCompleted}</p>
            </div>
            <BookOpen className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{overallStats.totalProgramsInProgress}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold text-purple-600">{overallStats.avgCompletion}%</p>
            </div>
            <BarChart3 className="h-10 w-10 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-white border-2 border-orange-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Training Hours</p>
              <p className="text-2xl font-bold text-orange-600">{overallStats.totalHours}h</p>
            </div>
            <Clock className="h-10 w-10 text-orange-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Certifications Earned</p>
              <p className="text-2xl font-bold text-yellow-600">{overallStats.totalCertifications}</p>
            </div>
            <Award className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget Utilized</p>
              <p className="text-xl font-bold text-indigo-600">₹{(overallStats.totalBudgetSpent / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-gray-500">of ₹{(overallStats.totalBudget / 10000000).toFixed(2)}Cr</p>
            </div>
            <IndianRupee className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-teal-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Hours/Employee</p>
              <p className="text-2xl font-bold text-teal-600">
                {Math.round(overallStats.totalHours / overallStats.totalEmployees)}h
              </p>
            </div>
            <Calendar className="h-10 w-10 text-teal-400" />
          </div>
        </div>
      </div>

      {/* Department-wise Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-3">
        <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Department-wise Training Summary</h3>
        </div>
        <DataTable data={mockDepartmentData} columns={columns} />
      </div>

      {/* Top Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Top Training Programs
          </h3>
          <div className="space-y-2">
            {topTrainings.map((training, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{training.program}</p>
                    <p className="text-sm text-gray-600">
                      {training.completions} completions / {training.enrollments} enrolled
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {training.completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${training.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-indigo-600" />
            Budget Analysis
          </h3>
          <div className="space-y-2">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Budget Allocated</p>
              <p className="text-2xl font-bold text-indigo-900">
                ₹{(overallStats.totalBudget / 10000000).toFixed(2)} Crore
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Budget Spent</p>
              <p className="text-2xl font-bold text-green-900">
                ₹{(overallStats.totalBudgetSpent / 10000000).toFixed(2)} Crore
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(overallStats.totalBudgetSpent / overallStats.totalBudget) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {Math.round((overallStats.totalBudgetSpent / overallStats.totalBudget) * 100)}% utilized
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Remaining Budget</p>
              <p className="text-2xl font-bold text-orange-900">
                ₹{((overallStats.totalBudget - overallStats.totalBudgetSpent) / 10000000).toFixed(2)} Crore
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cost per Employee</p>
              <p className="text-2xl font-bold text-blue-900">
                ₹{Math.round(overallStats.totalBudgetSpent / overallStats.totalEmployees).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-emerald-900 mb-2">Key Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-white rounded-lg p-3 border border-emerald-200">
            <h4 className="font-semibold text-gray-900 mb-2">✓ Strengths</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Safety & Compliance dept has highest completion rate (92%)</li>
              <li>• Overall average completion rate is strong at {overallStats.avgCompletion}%</li>
              <li>• {overallStats.totalCertifications} certifications earned this quarter</li>
              <li>• Budget utilization is on track at {Math.round((overallStats.totalBudgetSpent / overallStats.totalBudget) * 100)}%</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-3 border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-2">⚠ Areas for Improvement</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Warehouse & Logistics has lowest completion rate (78%)</li>
              <li>• {overallStats.totalProgramsInProgress} programs still in progress</li>
              <li>• Recommend increasing budget allocation for high-demand programs</li>
              <li>• Focus on improving engagement in technical training courses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
