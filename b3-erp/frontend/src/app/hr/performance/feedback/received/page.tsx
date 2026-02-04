'use client';

import { useState } from 'react';
import { Inbox, Star, ThumbsUp, MessageSquare, Filter, Search } from 'lucide-react';

interface Feedback {
  id: string;
  sender: string;
  senderRole?: string;
  date: string;
  category: 'appreciation' | 'performance' | 'development';
  content: string;
  anonymous: boolean;
}

export default function ReceivedFeedbackPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const feedbackData: Feedback[] = [
    {
      id: '1',
      sender: 'Sarah Jenkins',
      senderRole: 'Senior Frontend Dev',
      date: '2024-03-15',
      category: 'appreciation',
      content: 'Great job on the new dashboard implementation! The performance improvements are noticeable.',
      anonymous: false
    },
    {
      id: '2',
      sender: 'Anonymous',
      date: '2024-03-10',
      category: 'performance',
      content: 'Consistent delivery on sprint tasks. appreciated the extra effort on the documentation.',
      anonymous: true
    },
    {
      id: '3',
      sender: 'Michael Chen',
      senderRole: 'Product Manager',
      date: '2024-03-05',
      category: 'development',
      content: 'Would love to see you take lead on more technical design discussions in the future.',
      anonymous: false
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appreciation': return <ThumbsUp className="h-5 w-5 text-green-600" />;
      case 'performance': return <Star className="h-5 w-5 text-yellow-600" />;
      case 'development': return <MessageSquare className="h-5 w-5 text-blue-600" />;
      default: return <Inbox className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appreciation': return 'bg-green-50 border-green-100';
      case 'performance': return 'bg-yellow-50 border-yellow-100';
      case 'development': return 'bg-blue-50 border-blue-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const filteredFeedback = filterCategory === 'all'
    ? feedbackData
    : feedbackData.filter(f => f.category === filterCategory);

  return (
    <div className="p-6 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Inbox className="h-8 w-8 text-purple-600" />
            Received Feedback
          </h1>
          <p className="text-gray-500 mt-1">View feedback received from your peers and managers.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 pb-2">
        {['all', 'appreciation', 'performance', 'development'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${filterCategory === cat
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {filteredFeedback.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-2">
              <div className={`p-3 rounded-lg ${getCategoryColor(item.category)}`}>
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.anonymous ? 'Anonymous Peer' : item.sender}
                    </h3>
                    {!item.anonymous && (
                      <p className="text-xs text-gray-500">{item.senderRole}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="mt-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium uppercase tracking-wide mb-2 ${getCategoryColor(item.category)} text-gray-700`}>
                    {item.category}
                  </span>
                  <p className="text-gray-700 leading-relaxed">"{item.content}"</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
