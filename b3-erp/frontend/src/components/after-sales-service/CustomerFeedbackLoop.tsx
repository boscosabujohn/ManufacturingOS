'use client';

import React from 'react';
import {
  Star,
  MessageCircle,
  TrendingUp,
  ThumbsUp,
  Heart,
  Search,
  Filter,
  ChevronRight,
  Smile,
  Meh,
  Frown,
  Share2,
  PieChart,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function CustomerFeedbackLoop() {
  const reviews = [
    { id: 'RV-102', customer: 'Arjun M.', rating: 5, sentiment: 'Positive', comment: 'The technician (Rajesh) was incredibly professional. Fixed the mixer in record time!', date: '2h ago', product: 'Mixer Pro 5G' },
    { id: 'RV-101', customer: 'Sita R.', rating: 4, sentiment: 'Positive', comment: 'Good service, but the parts took a day longer than expected to arrive.', date: '5h ago', product: 'Smart Oven X4' },
    { id: 'RV-100', customer: 'John Doe', rating: 2, sentiment: 'Negative', comment: 'Still waiting for a callback regarding my service request. Disappointing.', date: '1d ago', product: 'PureAir Chimney' },
  ];

  return (
    <div className="space-y-6">
      {/* Featured Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-yellow-400 rounded-3xl shadow-xl shadow-yellow-100 rotate-6 group-hover:rotate-0 transition-transform">
            <Heart className="h-8 w-8 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Customer Voice Hub</h2>
            <div className="flex items-center gap-3 text-slate-500 mt-1 font-bold text-sm">
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> 4.8 Avg Rating</span>
              <span className="text-slate-300">•</span>
              <span>1,240 Total Feedbacks</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Export Insights
          </button>
        </div>
        <Sparkles className="absolute -right-6 -top-6 h-48 w-48 text-slate-50 pointer-events-none" />
      </div>

      {/* Sentiment Awareness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Overall CSAT', value: '4.8', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', trend: 'Excellent' },
          { label: 'Positive Sentiment', value: '92%', icon: Smile, color: 'text-green-600', bg: 'bg-green-50', trend: '+4% vs LP' },
          { label: 'Response Rate', value: '64%', icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Target 70%' },
          { label: 'NPS Score', value: '72', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'World Class' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-yellow-400 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bg} rounded-2xl group-hover:rotate-12 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feedback Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                Real-time Feedback Stream
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600"><Search className="h-4 w-4" /></button>
                <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600"><Filter className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${rev.sentiment === 'Positive' ? 'bg-green-100 text-green-600' :
                          rev.sentiment === 'Negative' ? 'bg-red-100 text-red-600' :
                            'bg-slate-100 text-slate-500'
                        }`}>
                        {rev.sentiment === 'Positive' ? <Smile className="h-6 w-6" /> :
                          rev.sentiment === 'Negative' ? <Frown className="h-6 w-6" /> :
                            <Meh className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900">{rev.customer}</h4>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-bold text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">"{rev.comment}"</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PRODUCT:</span>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{rev.product}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 mx-auto">
                Load More Conversations <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          {/* Visual Sentiment Pie/Chart Representation */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Sentiment Breakdown
            </h3>
            <div className="flex items-center gap-8 mb-8">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="92, 100" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-black text-slate-900">92%</span>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> <span className="text-xs font-bold text-slate-500 uppercase">Happy</span></div>
                  <span className="text-xs font-black text-slate-900">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-300 rounded-full"></div> <span className="text-xs font-bold text-slate-500 uppercase">Neutral</span></div>
                  <span className="text-xs font-black text-slate-900">5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-400 rounded-full"></div> <span className="text-xs font-bold text-slate-500 uppercase">Negative</span></div>
                  <span className="text-xs font-black text-slate-900">3%</span>
                </div>
              </div>
            </div>
            <button className="w-full py-3 border-2 border-slate-100 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm">
              Full Analysis Report
            </button>
          </div>

          {/* Word Cloud / Keyword Mockup */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl">
            <h4 className="font-bold text-slate-200 mb-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              Trending Keywords
            </h4>
            <div className="flex flex-wrap gap-2 relative z-10">
              {['Fast', 'Professional', 'Clean', 'Expensive', 'Polite', 'Punctual', 'Technical', 'Helpful', 'Late', 'Fixed'].map((word, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all hover:scale-110 cursor-pointer ${idx === 0 ? 'text-xl bg-white/20 text-white' :
                      idx < 3 ? 'text-sm bg-white/10 text-slate-300' :
                        'text-[10px] bg-white/5 text-slate-500'
                    }`}
                >
                  {word}
                </span>
              ))}
            </div>
            <TrendingUp className="absolute -right-6 -bottom-6 h-32 w-32 text-indigo-500 opacity-20 pointer-events-none" />
          </div>

          {/* Feedback Recommendation */}
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">AI ADVANTAGE</p>
            <h4 className="font-bold text-indigo-900 mb-3">Service Training Needed</h4>
            <p className="text-xs text-indigo-700 leading-relaxed mb-4">
              Analysis suggests 12% of negative feedback is due to "Delay in spare parts arrival". Consider optimizing warehouse logistics for faster dispatch.
            </p>
            <button className="flex items-center gap-1 text-xs font-black text-indigo-900 hover:gap-2 transition-all">
              View Action Plan <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
