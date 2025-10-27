'use client';

import { useState } from 'react';
import { Network, Users, Calendar, MessageCircle, Heart, Share2, Eye, TrendingUp, Award, Briefcase, MapPin } from 'lucide-react';

interface AlumniEvent {
  id: string;
  title: string;
  type: 'meetup' | 'webinar' | 'workshop' | 'reunion' | 'networking';
  date: string;
  time: string;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  registrations: number;
  capacity: number;
  organizer: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface AlumniPost {
  id: string;
  author: string;
  authorDesignation: string;
  authorCompany: string;
  timestamp: string;
  content: string;
  type: 'update' | 'achievement' | 'opportunity' | 'question';
  likes: number;
  comments: number;
  shares: number;
}

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<'feed' | 'events' | 'opportunities'>('feed');

  const mockEvents: AlumniEvent[] = [
    {
      id: '1',
      title: 'Manufacturing Excellence Summit 2025',
      type: 'reunion',
      date: '2025-11-15',
      time: '10:00 AM',
      location: 'Hotel Taj, Pune',
      mode: 'offline',
      registrations: 45,
      capacity: 100,
      organizer: 'Rajesh Kumar',
      description: 'Annual alumni reunion focused on latest trends in manufacturing',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Lean Manufacturing Webinar',
      type: 'webinar',
      date: '2025-11-01',
      time: '03:00 PM',
      location: 'Zoom',
      mode: 'online',
      registrations: 78,
      capacity: 150,
      organizer: 'Amit Patel',
      description: 'Learn latest Lean Six Sigma techniques from industry experts',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Alumni Networking Meetup - Mumbai',
      type: 'networking',
      date: '2025-10-30',
      time: '06:00 PM',
      location: 'Cafe Coffee Day, Bandra',
      mode: 'offline',
      registrations: 23,
      capacity: 30,
      organizer: 'Priya Sharma',
      description: 'Casual networking evening for Mumbai-based alumni',
      status: 'upcoming'
    }
  ];

  const mockPosts: AlumniPost[] = [
    {
      id: '1',
      author: 'Rajesh Kumar',
      authorDesignation: 'GM - Manufacturing',
      authorCompany: 'Tata Motors',
      timestamp: '2 hours ago',
      content: 'Excited to announce that our plant achieved Zero Defect certification! Proud moment for the team. The foundation was laid during my time at our organization.',
      type: 'achievement',
      likes: 45,
      comments: 12,
      shares: 5
    },
    {
      id: '2',
      author: 'Priya Sharma',
      authorDesignation: 'Head of HR',
      authorCompany: 'Mahindra & Mahindra',
      timestamp: '1 day ago',
      content: 'We are hiring! Looking for experienced Production Managers with Lean Manufacturing background. DM me for details.',
      type: 'opportunity',
      likes: 67,
      comments: 23,
      shares: 15
    },
    {
      id: '3',
      author: 'Amit Patel',
      authorDesignation: 'Quality Consultant',
      authorCompany: 'Self-Employed',
      timestamp: '2 days ago',
      content: 'Question for the network: What are your experiences with implementing AI in quality inspection? Looking to gather insights for a client project.',
      type: 'question',
      likes: 28,
      comments: 34,
      shares: 3
    },
    {
      id: '4',
      author: 'Vikram Singh',
      authorDesignation: 'Project Manager',
      authorCompany: 'Infosys Ltd',
      timestamp: '3 days ago',
      content: 'Just completed PMP certification! The problem-solving skills I learned during my manufacturing days really helped in project management.',
      type: 'achievement',
      likes: 89,
      comments: 18,
      shares: 7
    }
  ];

  const stats = {
    totalMembers: 247,
    activeMembers: 156,
    upcomingEvents: mockEvents.filter(e => e.status === 'upcoming').length,
    openOpportunities: 12
  };

  const typeColors = {
    update: 'bg-blue-100 text-blue-700',
    achievement: 'bg-green-100 text-green-700',
    opportunity: 'bg-purple-100 text-purple-700',
    question: 'bg-orange-100 text-orange-700'
  };

  const eventTypeColors = {
    meetup: 'bg-blue-100 text-blue-700',
    webinar: 'bg-purple-100 text-purple-700',
    workshop: 'bg-green-100 text-green-700',
    reunion: 'bg-orange-100 text-orange-700',
    networking: 'bg-pink-100 text-pink-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alumni Network</h1>
        <p className="text-sm text-gray-600 mt-1">Stay connected, share experiences, and grow together</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Network Size</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Members</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.activeMembers}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.upcomingEvents}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Opportunities</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{stats.openOpportunities}</p>
            </div>
            <Briefcase className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('feed')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              selectedTab === 'feed'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Network Feed
          </button>
          <button
            onClick={() => setSelectedTab('events')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              selectedTab === 'events'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setSelectedTab('opportunities')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              selectedTab === 'opportunities'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Opportunities
          </button>
        </div>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'feed' && (
        <div className="space-y-4">
          {/* Create Post */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <textarea
              placeholder="Share an update with the alumni network..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Post Update
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          {mockPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <p className="text-sm text-gray-600">{post.authorDesignation} at {post.authorCompany}</p>
                    <p className="text-xs text-gray-500 mt-1">{post.timestamp}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${typeColors[post.type]}`}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </span>
              </div>

              {/* Post Content */}
              <p className="text-gray-800 mb-4">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.shares}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${eventTypeColors[event.type]}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  event.mode === 'online' ? 'bg-blue-100 text-blue-700' :
                  event.mode === 'offline' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="h-4 w-4 text-gray-400" />
                  {event.registrations}/{event.capacity} registered
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                />
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Register Now
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'opportunities' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Opportunities</h3>
          <p className="text-gray-600 mb-6">
            Browse and share job opportunities within the alumni network
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Post an Opportunity
          </button>
        </div>
      )}
    </div>
  );
}
