'use client'

import { useState } from 'react'
import { Star, TrendingUp, Users, MessageSquare, ThumbsUp } from 'lucide-react'

export default function CSATSurveys() {
  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Star className="h-8 w-8 text-yellow-600" />
          CSAT Surveys
        </h2>
        <p className="text-gray-600 mt-1">Customer Satisfaction tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <Star className="h-8 w-8 text-yellow-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">4.7</div>
          <div className="text-sm text-gray-600">Avg CSAT Score</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <Users className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">1,234</div>
          <div className="text-sm text-gray-600">Responses</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">85%</div>
          <div className="text-sm text-gray-600">Response Rate</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <MessageSquare className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">567</div>
          <div className="text-sm text-gray-600">Comments</div>
        </div>
      </div>
    </div>
  );
}
