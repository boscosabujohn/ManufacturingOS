'use client'
import { Star, MessageCircle, TrendingUp, ThumbsUp } from 'lucide-react'
export default function CustomerFeedbackLoop() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Star className="h-8 w-8 text-yellow-600" />
          Customer Feedback Loop
        </h2>
        <p className="text-gray-600 mt-1">Post-service surveys and continuous improvement</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Star className="h-8 w-8 text-yellow-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <ThumbsUp className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">92%</div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <MessageCircle className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">456</div>
          <div className="text-sm text-gray-600">Responses</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">+5%</div>
          <div className="text-sm text-gray-600">Improvement</div>
        </div>
      </div>
    </div>
  );
}
