'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, DollarSign, Users, Target, Gauge } from 'lucide-react'

export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical' | 'at-risk';
export type HealthCategory = 'schedule' | 'budget' | 'scope' | 'quality' | 'resources' | 'risks';

export interface HealthMetric {
  category: HealthCategory;
  score: number; // 0-100
  weight: number; // Impact weight
  status: HealthStatus;
  trend: 'up' | 'down' | 'stable';
  issues: string[];
  recommendations: string[];
}

export interface ProjectHealth {
  projectId: string;
  projectName: string;
  overallScore: number;
  overallStatus: HealthStatus;
  lastUpdated: string;
  metrics: HealthMetric[];
  predictedCompletion: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
}

export default function ProjectHealthScoring() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);

  // Simulate real-time health updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdate(prev => prev + 1);
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const [projectHealthData] = useState<ProjectHealth[]>([
    {
      projectId: 'PRJ-2025-001',
      projectName: 'Hydraulic Press Installation',
      overallScore: 78 + (realTimeUpdate % 3),
      overallStatus: 'good',
      lastUpdated: new Date().toISOString(),
      predictedCompletion: '2025-12-05',
      riskLevel: 'medium',
      confidence: 85,
      metrics: [
        {
          category: 'schedule',
          score: 72,
          weight: 25,
          status: 'good',
          trend: 'down',
          issues: ['2 tasks delayed by 3 days', 'Critical path at risk'],
          recommendations: ['Allocate additional resources to Task #45', 'Review dependency chain']
        },
        {
          category: 'budget',
          score: 85,
          weight: 25,
          status: 'good',
          trend: 'stable',
          issues: [],
          recommendations: ['Monitor material costs closely']
        },
        {
          category: 'scope',
          score: 90,
          weight: 15,
          status: 'excellent',
          trend: 'stable',
          issues: [],
          recommendations: []
        },
        {
          category: 'quality',
          score: 68,
          weight: 20,
          status: 'warning',
          trend: 'down',
          issues: ['3 quality defects identified', 'Rework required on Module B'],
          recommendations: ['Conduct quality review meeting', 'Increase inspection frequency']
        },
        {
          category: 'resources',
          score: 75,
          weight: 10,
          status: 'good',
          trend: 'up',
          issues: ['1 key resource on leave'],
          recommendations: ['Cross-train backup resources']
        },
        {
          category: 'risks',
          score: 80,
          weight: 5,
          status: 'good',
          trend: 'stable',
          issues: ['Vendor delay risk'],
          recommendations: ['Identify alternate suppliers']
        }
      ]
    },
    {
      projectId: 'PRJ-2025-002',
      projectName: 'CNC Machine Upgrade',
      overallScore: 92,
      overallStatus: 'excellent',
      lastUpdated: new Date().toISOString(),
      predictedCompletion: '2025-12-10',
      riskLevel: 'low',
      confidence: 92,
      metrics: [
        {
          category: 'schedule',
          score: 95,
          weight: 25,
          status: 'excellent',
          trend: 'up',
          issues: [],
          recommendations: []
        },
        {
          category: 'budget',
          score: 88,
          weight: 25,
          status: 'good',
          trend: 'stable',
          issues: [],
          recommendations: []
        },
        {
          category: 'scope',
          score: 93,
          weight: 15,
          status: 'excellent',
          trend: 'stable',
          issues: [],
          recommendations: []
        },
        {
          category: 'quality',
          score: 91,
          weight: 20,
          status: 'excellent',
          trend: 'up',
          issues: [],
          recommendations: []
        },
        {
          category: 'resources',
          score: 90,
          weight: 10,
          status: 'excellent',
          trend: 'stable',
          issues: [],
          recommendations: []
        },
        {
          category: 'risks',
          score: 94,
          weight: 5,
          status: 'excellent',
          trend: 'up',
          issues: [],
          recommendations: []
        }
      ]
    },
    {
      projectId: 'PRJ-2025-003',
      projectName: 'Automation System',
      overallScore: 45,
      overallStatus: 'critical',
      lastUpdated: new Date().toISOString(),
      predictedCompletion: '2025-11-25',
      riskLevel: 'critical',
      confidence: 62,
      metrics: [
        {
          category: 'schedule',
          score: 35,
          weight: 25,
          status: 'critical',
          trend: 'down',
          issues: ['15 days behind schedule', 'Critical milestones missed', '4 blockers identified'],
          recommendations: ['Emergency resource allocation', 'Daily stand-ups required', 'Escalate to steering committee']
        },
        {
          category: 'budget',
          score: 52,
          weight: 25,
          status: 'at-risk',
          trend: 'down',
          issues: ['Budget overrun by 12%', 'Unplanned expenses'],
          recommendations: ['Cost reduction review', 'Budget reforecast needed']
        },
        {
          category: 'scope',
          score: 60,
          weight: 15,
          status: 'warning',
          trend: 'down',
          issues: ['Scope creep detected', '5 change requests pending'],
          recommendations: ['Freeze scope changes', 'Review change control process']
        },
        {
          category: 'quality',
          score: 40,
          weight: 20,
          status: 'critical',
          trend: 'down',
          issues: ['8 critical defects', 'Failed QA testing', 'Rework required'],
          recommendations: ['Quality audit required', 'Dedicated QA resources needed']
        },
        {
          category: 'resources',
          score: 48,
          weight: 10,
          status: 'critical',
          trend: 'down',
          issues: ['Team morale low', '2 key resources resigned', 'Skill gaps identified'],
          recommendations: ['Immediate hiring required', 'Team motivation initiatives']
        },
        {
          category: 'risks',
          score: 30,
          weight: 5,
          status: 'critical',
          trend: 'down',
          issues: ['Multiple high-priority risks', 'No mitigation plans'],
          recommendations: ['Risk workshop needed', 'Assign risk owners']
        }
      ]
    }
  ]);

  const getHealthStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'at-risk':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCategoryIcon = (category: HealthCategory) => {
    switch (category) {
      case 'schedule':
        return <Clock className="h-5 w-5" />;
      case 'budget':
        return <DollarSign className="h-5 w-5" />;
      case 'scope':
        return <Target className="h-5 w-5" />;
      case 'quality':
        return <CheckCircle className="h-5 w-5" />;
      case 'resources':
        return <Users className="h-5 w-5" />;
      case 'risks':
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const filteredProjects = selectedProject === 'all'
    ? projectHealthData
    : projectHealthData.filter(p => p.projectId === selectedProject);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Gauge className="h-8 w-8 text-blue-600" />
              Real-Time Project Health Scoring
            </h2>
            <p className="text-gray-600 mt-1">AI-powered health monitoring with predictive analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Project Filter */}
      <div className="bg-white shadow-md p-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter by Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Projects</option>
            {projectHealthData.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Health Cards */}
      <div className="space-y-3">
        {filteredProjects.map((project) => (
          <div key={project.projectId} className="bg-white shadow-lg border border-gray-200">
            {/* Project Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{project.projectName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.projectId}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-2">
                    <span className={`text-4xl font-bold ${getScoreColor(project.overallScore)}`}>
                      {project.overallScore}
                    </span>
                    <span className="text-gray-500">/100</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getHealthStatusColor(project.overallStatus)}`}>
                    {project.overallStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Overall Health Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getScoreBarColor(project.overallScore)}`}
                    style={{ width: `${project.overallScore}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Risk Level</p>
                  <p className={`text-sm font-bold mt-1 ${
                    project.riskLevel === 'critical' ? 'text-red-600' :
                    project.riskLevel === 'high' ? 'text-orange-600' :
                    project.riskLevel === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {project.riskLevel.toUpperCase()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Confidence</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">{project.confidence}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Predicted Completion</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{project.predictedCompletion}</p>
                </div>
              </div>
            </div>

            {/* Health Metrics Grid */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Health Metrics Breakdown</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {project.metrics.map((metric) => (
                  <div key={metric.category} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getHealthStatusColor(metric.status)}`}>
                          {getCategoryIcon(metric.category)}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 capitalize">{metric.category}</h5>
                          <p className="text-xs text-gray-600">Weight: {metric.weight}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-xl font-bold ${getScoreColor(metric.score)}`}>
                          {metric.score}
                        </span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(metric.score)}`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>

                    {/* Issues */}
                    {metric.issues.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-red-600 mb-1">Issues:</p>
                        <ul className="space-y-1">
                          {metric.issues.map((issue, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                              <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {metric.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-blue-600 mb-1">Recommendations:</p>
                        <ul className="space-y-1">
                          {metric.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
