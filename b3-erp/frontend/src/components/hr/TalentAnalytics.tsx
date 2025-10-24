'use client';

import React from 'react';
import { Users, TrendingUp, TrendingDown, Award, Target, Activity, BarChart3, PieChart, Calendar, DollarSign } from 'lucide-react';

export default function TalentAnalytics() {
  const metrics = {
    headcount: { total: 245, growth: 8.5, turnover: 12.3 },
    diversity: { female: 32, male: 68, avgAge: 32 },
    performance: { topPerformers: 28, needsImprovement: 15 },
    retention: { rate: 87.7, avgTenure: 3.2 },
    skills: [
      { name: 'Leadership', count: 45, trend: 12 },
      { name: 'Technical', count: 120, trend: 8 },
      { name: 'Communication', count: 98, trend: 5 },
    ],
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Talent Analytics & Insights</h1>
          <p className="text-gray-600">Data-driven insights on workforce trends and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Total Headcount</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{metrics.headcount.total}</p>
            <p className="text-sm text-green-600 mt-2">↑ {metrics.headcount.growth}% growth</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Retention Rate</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{metrics.retention.rate}%</p>
            <p className="text-sm text-gray-600 mt-2">Avg tenure: {metrics.retention.avgTenure}y</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Top Performers</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{metrics.performance.topPerformers}</p>
            <p className="text-sm text-gray-600 mt-2">11% of workforce</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <TrendingDown className="w-6 h-6 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Turnover Rate</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">{metrics.headcount.turnover}%</p>
            <p className="text-sm text-gray-600 mt-2">Last 12 months</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Skills Distribution</h3>
            <div className="space-y-4">
              {metrics.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.count} employees</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${(skill.count / metrics.headcount.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Diversity Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">Female</span>
                <span className="text-2xl font-bold text-pink-600">{metrics.diversity.female}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <span className="font-medium text-gray-700">Male</span>
                <span className="text-2xl font-bold text-blue-600">{metrics.diversity.male}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <span className="font-medium text-gray-700">Average Age</span>
                <span className="text-2xl font-bold text-gray-700">{metrics.diversity.avgAge} years</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
