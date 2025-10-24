'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Mail, Phone, Globe, MessageCircle, Video, Users, TrendingUp, Clock, Zap } from 'lucide-react'

export type ChannelType = 'email' | 'chat' | 'phone' | 'social' | 'web' | 'video' | 'whatsapp' | 'sms';
export type RoutingStrategy = 'round-robin' | 'skill-based' | 'load-balanced' | 'priority-based' | 'ai-suggested';

export interface Channel {
  id: string;
  type: ChannelType;
  name: string;
  status: 'active' | 'paused' | 'offline';
  activeTickets: number;
  avgResponseTime: number;
  agentsOnline: number;
  satisfaction: number;
  volumeToday: number;
}

export interface RoutingRule {
  id: string;
  name: string;
  channel: ChannelType;
  strategy: RoutingStrategy;
  priority: number;
  criteria: string;
  assignedAgents: number;
  enabled: boolean;
}

export interface QueueMetrics {
  totalInQueue: number;
  avgWaitTime: number;
  longestWait: number;
  abandoned: number;
  serviceLevel: number;
}

export default function OmnichannelRouting() {
  const [channels] = useState<Channel[]>([
    {
      id: 'CH-001',
      type: 'email',
      name: 'Email Support',
      status: 'active',
      activeTickets: 45,
      avgResponseTime: 125,
      agentsOnline: 8,
      satisfaction: 4.6,
      volumeToday: 234
    },
    {
      id: 'CH-002',
      type: 'chat',
      name: 'Live Chat',
      status: 'active',
      activeTickets: 23,
      avgResponseTime: 3.2,
      agentsOnline: 12,
      satisfaction: 4.8,
      volumeToday: 189
    },
    {
      id: 'CH-003',
      type: 'phone',
      name: 'Phone Support',
      status: 'active',
      activeTickets: 8,
      avgResponseTime: 5.8,
      agentsOnline: 15,
      satisfaction: 4.7,
      volumeToday: 156
    },
    {
      id: 'CH-004',
      type: 'social',
      name: 'Social Media',
      status: 'active',
      activeTickets: 12,
      avgResponseTime: 45,
      agentsOnline: 4,
      satisfaction: 4.5,
      volumeToday: 67
    },
    {
      id: 'CH-005',
      type: 'whatsapp',
      name: 'WhatsApp Business',
      status: 'active',
      activeTickets: 34,
      avgResponseTime: 8.5,
      agentsOnline: 6,
      satisfaction: 4.9,
      volumeToday: 145
    },
    {
      id: 'CH-006',
      type: 'video',
      name: 'Video Call',
      status: 'paused',
      activeTickets: 2,
      avgResponseTime: 15,
      agentsOnline: 3,
      satisfaction: 4.8,
      volumeToday: 12
    }
  ]);

  const [routingRules] = useState<RoutingRule[]>([
    {
      id: 'RULE-001',
      name: 'Priority Customer - Skill Based',
      channel: 'email',
      strategy: 'skill-based',
      priority: 1,
      criteria: 'VIP customers or urgent issues',
      assignedAgents: 5,
      enabled: true
    },
    {
      id: 'RULE-002',
      name: 'Live Chat - Load Balanced',
      channel: 'chat',
      strategy: 'load-balanced',
      priority: 2,
      criteria: 'Active agents with lowest queue',
      assignedAgents: 12,
      enabled: true
    },
    {
      id: 'RULE-003',
      name: 'Phone Support - Round Robin',
      channel: 'phone',
      strategy: 'round-robin',
      priority: 3,
      criteria: 'All available agents',
      assignedAgents: 15,
      enabled: true
    },
    {
      id: 'RULE-004',
      name: 'Social Media - AI Suggested',
      channel: 'social',
      strategy: 'ai-suggested',
      priority: 2,
      criteria: 'AI sentiment analysis + expertise',
      assignedAgents: 4,
      enabled: true
    }
  ]);

  const [queueMetrics, setQueueMetrics] = useState<QueueMetrics>({
    totalInQueue: 28,
    avgWaitTime: 4.2,
    longestWait: 12.5,
    abandoned: 3,
    serviceLevel: 87.5
  });

  const [realTimeUpdate, setRealTimeUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdate(prev => prev + 1);

      // Simulate real-time metric updates
      setQueueMetrics(prev => ({
        totalInQueue: Math.max(0, prev.totalInQueue + Math.floor(Math.random() * 5 - 2)),
        avgWaitTime: Math.max(0, Math.round((prev.avgWaitTime + (Math.random() - 0.5) * 0.5) * 10) / 10),
        longestWait: Math.max(0, Math.round((prev.longestWait + (Math.random() - 0.5) * 1) * 10) / 10),
        abandoned: Math.max(0, prev.abandoned + Math.floor(Math.random() * 2 - 0.5)),
        serviceLevel: Math.round((prev.serviceLevel + (Math.random() - 0.5) * 1) * 10) / 10
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getChannelIcon = (type: ChannelType) => {
    const icons = {
      email: Mail,
      chat: MessageSquare,
      phone: Phone,
      social: Globe,
      web: Globe,
      video: Video,
      whatsapp: MessageCircle,
      sms: MessageSquare
    };
    return icons[type] || MessageSquare;
  };

  const getChannelColor = (type: ChannelType) => {
    const colors = {
      email: 'from-blue-500 to-blue-600',
      chat: 'from-green-500 to-green-600',
      phone: 'from-purple-500 to-purple-600',
      social: 'from-pink-500 to-pink-600',
      web: 'from-indigo-500 to-indigo-600',
      video: 'from-red-500 to-red-600',
      whatsapp: 'from-teal-500 to-teal-600',
      sms: 'from-orange-500 to-orange-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      offline: 'bg-gray-100 text-gray-700'
    };
    return colors[status as keyof typeof colors];
  };

  const totalActiveTickets = channels.reduce((sum, ch) => sum + ch.activeTickets, 0);
  const totalAgentsOnline = channels.reduce((sum, ch) => sum + ch.agentsOnline, 0);
  const avgSatisfaction = channels.reduce((sum, ch) => sum + ch.satisfaction, 0) / channels.length;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Omnichannel Routing
            </h2>
            <p className="text-gray-600 mt-1">Unified ticket routing across all channels with intelligent assignment</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Updates
          </div>
        </div>
      </div>

      {/* Real-time Queue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-8 w-8 text-orange-600" />
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{queueMetrics.totalInQueue}</div>
          <div className="text-sm text-gray-600">In Queue</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{queueMetrics.avgWaitTime}m</div>
          <div className="text-sm text-gray-600">Avg Wait Time</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{queueMetrics.serviceLevel}%</div>
          <div className="text-sm text-gray-600">Service Level</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{totalAgentsOnline}</div>
          <div className="text-sm text-gray-600">Agents Online</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <MessageSquare className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-indigo-600 mb-1">{totalActiveTickets}</div>
          <div className="text-sm text-gray-600">Active Tickets</div>
        </div>
      </div>

      {/* Channels */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Channels</h3>
          <p className="text-sm text-gray-600 mt-1">Real-time performance across all support channels</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {channels.map((channel) => {
            const Icon = getChannelIcon(channel.type);
            return (
              <div key={channel.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`p-4 bg-gradient-to-r ${getChannelColor(channel.type)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-gray-900" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{channel.name}</h4>
                        <p className="text-white/90 text-sm">{channel.volumeToday} tickets today</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(channel.status)}`}>
                      {channel.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Active Tickets</div>
                    <div className="text-2xl font-bold text-gray-900">{channel.activeTickets}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Agents Online</div>
                    <div className="text-2xl font-bold text-green-600">{channel.agentsOnline}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Avg Response</div>
                    <div className="text-xl font-bold text-blue-600">
                      {channel.avgResponseTime < 60 ? `${channel.avgResponseTime}m` : `${Math.round(channel.avgResponseTime / 60)}h`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Satisfaction</div>
                    <div className="text-xl font-bold text-yellow-600">{channel.satisfaction} ★</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routing Rules */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Routing Rules</h3>
              <p className="text-sm text-gray-600 mt-1">Intelligent assignment strategies per channel</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Rule
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Rule Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Strategy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Criteria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Agents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routingRules.map((rule) => {
                const Icon = getChannelIcon(rule.channel);
                return (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{rule.name}</div>
                      <div className="text-xs text-gray-500">{rule.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-900 capitalize">{rule.channel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                        {rule.strategy.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rule.priority === 1 ? 'bg-red-100 text-red-700' :
                        rule.priority === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        P{rule.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">{rule.criteria}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rule.assignedAgents} agents</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={rule.enabled} readOnly className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
