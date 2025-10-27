'use client';

import { useState } from 'react';
import { Target, TrendingUp, Award, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface ReadinessAssessment {
  id: string;
  name: string;
  employeeCode: string;
  currentRole: string;
  targetRole: string;
  department: string;
  photo: string;
  readinessLevel: 'ready_now' | '6_months' | '1_year' | '2_years' | '3_plus_years';
  overallScore: number;
  technicalReadiness: number;
  leadershipReadiness: number;
  strategicReadiness: number;
  culturalFit: number;
  businessAcumen: number;
  gapAreas: string[];
  developmentActions: {
    action: string;
    status: 'completed' | 'in_progress' | 'planned';
    dueDate: string;
  }[];
  estimatedReadyDate: string;
  assessmentDate: string;
  assessor: string;
}

export default function Page() {
  const [selectedReadiness, setSelectedReadiness] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const mockAssessments: ReadinessAssessment[] = [
    {
      id: '1',
      name: 'Kavita Singh',
      employeeCode: 'EMP008',
      currentRole: 'IT Lead',
      targetRole: 'CTO',
      department: 'IT',
      photo: '👩‍💼',
      readinessLevel: 'ready_now',
      overallScore: 92,
      technicalReadiness: 95,
      leadershipReadiness: 90,
      strategicReadiness: 88,
      culturalFit: 95,
      businessAcumen: 90,
      gapAreas: ['Board-level communication', 'P&L management experience'],
      developmentActions: [
        { action: 'Executive Leadership Program', status: 'in_progress', dueDate: '2025-03-31' },
        { action: 'CFO shadowing for P&L exposure', status: 'planned', dueDate: '2025-06-30' },
        { action: 'Board presentation training', status: 'planned', dueDate: '2025-05-15' }
      ],
      estimatedReadyDate: '2025-07-01',
      assessmentDate: '2025-01-15',
      assessor: 'Rajesh Kumar (CTO)'
    },
    {
      id: '2',
      name: 'Arjun Kapoor',
      employeeCode: 'EMP007',
      currentRole: 'Sales Lead',
      targetRole: 'VP Sales',
      department: 'Sales',
      photo: '👨‍💼',
      readinessLevel: '6_months',
      overallScore: 85,
      technicalReadiness: 82,
      leadershipReadiness: 88,
      strategicReadiness: 80,
      culturalFit: 90,
      businessAcumen: 85,
      gapAreas: ['Multi-regional management', 'Strategic planning', 'Larger team leadership'],
      developmentActions: [
        { action: 'Leadership Development Program', status: 'in_progress', dueDate: '2025-04-30' },
        { action: 'Regional sales strategy project', status: 'in_progress', dueDate: '2025-05-31' },
        { action: 'Cross-regional team management', status: 'planned', dueDate: '2025-06-30' }
      ],
      estimatedReadyDate: '2025-07-15',
      assessmentDate: '2025-01-10',
      assessor: 'Priya Sharma (VP Sales)'
    },
    {
      id: '3',
      name: 'Rahul Mehta',
      employeeCode: 'EMP015',
      currentRole: 'Finance Manager',
      targetRole: 'CFO',
      department: 'Finance',
      photo: '👨‍💼',
      readinessLevel: '1_year',
      overallScore: 78,
      technicalReadiness: 88,
      leadershipReadiness: 75,
      strategicReadiness: 72,
      culturalFit: 85,
      businessAcumen: 75,
      gapAreas: ['Executive leadership', 'Board interactions', 'Strategic business planning', 'Investor relations'],
      developmentActions: [
        { action: 'CFO mentorship program', status: 'in_progress', dueDate: '2025-06-30' },
        { action: 'Executive MBA (Finance focus)', status: 'in_progress', dueDate: '2026-01-31' },
        { action: 'Board meeting shadowing', status: 'planned', dueDate: '2025-08-31' },
        { action: 'Investor presentation training', status: 'planned', dueDate: '2025-09-30' }
      ],
      estimatedReadyDate: '2026-01-15',
      assessmentDate: '2025-01-12',
      assessor: 'Suresh Iyer (CFO)'
    },
    {
      id: '4',
      name: 'Neha Gupta',
      employeeCode: 'EMP012',
      currentRole: 'HR Manager',
      targetRole: 'CHRO',
      department: 'HR',
      photo: '👩‍💼',
      readinessLevel: '1_year',
      overallScore: 80,
      technicalReadiness: 85,
      leadershipReadiness: 78,
      strategicReadiness: 75,
      culturalFit: 88,
      businessAcumen: 72,
      gapAreas: ['C-suite leadership', 'Organizational transformation', 'Business strategy alignment'],
      developmentActions: [
        { action: 'Senior HR Leadership Program', status: 'in_progress', dueDate: '2025-05-31' },
        { action: 'Business strategy workshops', status: 'in_progress', dueDate: '2025-07-31' },
        { action: 'Change management certification', status: 'planned', dueDate: '2025-08-31' },
        { action: 'Executive coaching', status: 'in_progress', dueDate: '2025-12-31' }
      ],
      estimatedReadyDate: '2026-02-01',
      assessmentDate: '2025-01-08',
      assessor: 'Anjali Desai (CHRO)'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      employeeCode: 'EMP020',
      currentRole: 'Operations Manager',
      targetRole: 'COO',
      department: 'Operations',
      photo: '👨‍💼',
      readinessLevel: '2_years',
      overallScore: 72,
      technicalReadiness: 78,
      leadershipReadiness: 70,
      strategicReadiness: 68,
      culturalFit: 80,
      businessAcumen: 65,
      gapAreas: ['Executive leadership', 'Cross-functional leadership', 'Strategic planning', 'Business transformation'],
      developmentActions: [
        { action: 'Executive Development Program', status: 'planned', dueDate: '2025-09-30' },
        { action: 'Cross-functional project leadership', status: 'in_progress', dueDate: '2025-12-31' },
        { action: 'Strategic operations planning', status: 'planned', dueDate: '2026-03-31' },
        { action: 'Business transformation project', status: 'planned', dueDate: '2026-06-30' }
      ],
      estimatedReadyDate: '2027-01-01',
      assessmentDate: '2025-01-05',
      assessor: 'Ramesh Nair (COO)'
    },
    {
      id: '6',
      name: 'Priya Reddy',
      employeeCode: 'EMP025',
      currentRole: 'Marketing Manager',
      targetRole: 'CMO',
      department: 'Marketing',
      photo: '👩‍💼',
      readinessLevel: '2_years',
      overallScore: 75,
      technicalReadiness: 80,
      leadershipReadiness: 72,
      strategicReadiness: 70,
      culturalFit: 82,
      businessAcumen: 70,
      gapAreas: ['Executive presence', 'Brand strategy at scale', 'Digital transformation leadership'],
      developmentActions: [
        { action: 'Advanced Marketing Leadership', status: 'in_progress', dueDate: '2025-08-31' },
        { action: 'Digital marketing transformation project', status: 'in_progress', dueDate: '2026-01-31' },
        { action: 'Executive branding workshop', status: 'planned', dueDate: '2026-06-30' },
        { action: 'CMO mentorship program', status: 'planned', dueDate: '2026-09-30' }
      ],
      estimatedReadyDate: '2027-02-01',
      assessmentDate: '2025-01-07',
      assessor: 'Amit Verma (CMO)'
    }
  ];

  const filteredAssessments = mockAssessments.filter(assessment => {
    const matchesReadiness = selectedReadiness === 'all' || assessment.readinessLevel === selectedReadiness;
    const matchesDepartment = selectedDepartment === 'all' || assessment.department === selectedDepartment;
    return matchesReadiness && matchesDepartment;
  });

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'ready_now': return 'bg-green-100 text-green-700 border-green-300';
      case '6_months': return 'bg-teal-100 text-teal-700 border-teal-300';
      case '1_year': return 'bg-blue-100 text-blue-700 border-blue-300';
      case '2_years': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case '3_plus_years': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getReadinessLabel = (level: string) => {
    switch (level) {
      case 'ready_now': return 'Ready Now';
      case '6_months': return 'Ready in 6 Months';
      case '1_year': return 'Ready in 1 Year';
      case '2_years': return 'Ready in 2 Years';
      case '3_plus_years': return 'Ready in 3+ Years';
      default: return level;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-teal-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getActionStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'planned': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const totalAssessments = mockAssessments.length;
  const readyNow = mockAssessments.filter(a => a.readinessLevel === 'ready_now').length;
  const readySoon = mockAssessments.filter(a => ['6_months', '1_year'].includes(a.readinessLevel)).length;
  const avgScore = Math.round(mockAssessments.reduce((sum, a) => sum + a.overallScore, 0) / totalAssessments);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="h-6 w-6 text-teal-600" />
          Readiness Assessment
        </h1>
        <p className="text-sm text-gray-600 mt-1">Successor readiness evaluation and gap analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Total Assessments</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{totalAssessments}</p>
            </div>
            <Users className="h-10 w-10 text-purple-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Ready Now</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{readyNow}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-sm border border-teal-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Ready Soon (≤1 Yr)</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">{readySoon}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-teal-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Avg. Score</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{avgScore}%</p>
            </div>
            <Award className="h-10 w-10 text-blue-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Readiness</label>
            <select value={selectedReadiness} onChange={(e) => setSelectedReadiness(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Readiness Levels</option>
              <option value="ready_now">Ready Now</option>
              <option value="6_months">Ready in 6 Months</option>
              <option value="1_year">Ready in 1 Year</option>
              <option value="2_years">Ready in 2 Years</option>
              <option value="3_plus_years">Ready in 3+ Years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredAssessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-6xl">{assessment.photo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{assessment.name}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${getReadinessColor(assessment.readinessLevel)}`}>
                    {getReadinessLabel(assessment.readinessLevel)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{assessment.employeeCode} • {assessment.currentRole} → {assessment.targetRole}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <span className="font-semibold text-gray-900 ml-2">{assessment.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Overall Score:</span>
                    <span className={`font-bold ml-2 ${getScoreColor(assessment.overallScore)}`}>{assessment.overallScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Est. Ready:</span>
                    <span className="font-semibold text-gray-900 ml-2">{new Date(assessment.estimatedReadyDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Readiness Dimensions</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Technical Readiness</span>
                    <span className={`text-sm font-bold ${getScoreColor(assessment.technicalReadiness)}`}>{assessment.technicalReadiness}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-500 rounded-full h-2 transition-all" style={{ width: `${assessment.technicalReadiness}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Leadership Readiness</span>
                    <span className={`text-sm font-bold ${getScoreColor(assessment.leadershipReadiness)}`}>{assessment.leadershipReadiness}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 rounded-full h-2 transition-all" style={{ width: `${assessment.leadershipReadiness}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Strategic Readiness</span>
                    <span className={`text-sm font-bold ${getScoreColor(assessment.strategicReadiness)}`}>{assessment.strategicReadiness}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 rounded-full h-2 transition-all" style={{ width: `${assessment.strategicReadiness}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Cultural Fit</span>
                    <span className={`text-sm font-bold ${getScoreColor(assessment.culturalFit)}`}>{assessment.culturalFit}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2 transition-all" style={{ width: `${assessment.culturalFit}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Business Acumen</span>
                    <span className={`text-sm font-bold ${getScoreColor(assessment.businessAcumen)}`}>{assessment.businessAcumen}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 rounded-full h-2 transition-all" style={{ width: `${assessment.businessAcumen}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <h4 className="text-sm font-bold text-gray-900">Gap Areas</h4>
                </div>
                <ul className="space-y-2">
                  {assessment.gapAreas.map((gap, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-gray-900">Development Actions</h4>
                </div>
                <div className="space-y-2">
                  {assessment.developmentActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getActionStatusBadge(action.status)}`}>
                        {action.status.replace('_', ' ')}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{action.action}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(action.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Assessed by: {assessment.assessor}</span>
                <span>Assessment Date: {new Date(assessment.assessmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
