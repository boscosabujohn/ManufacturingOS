'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Clock, Lock, Globe, Database, Bell, CheckCircle, XCircle, Edit, Plus, AlertTriangle } from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'access' | 'data' | 'notification' | 'compliance';
  enabled: boolean;
  appliedRoles: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  config: {
    [key: string]: any;
  };
}

export default function RolePoliciesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const policies: Policy[] = [
    {
      id: '1',
      name: 'Multi-Factor Authentication',
      description: 'Require MFA for all user logins to enhance security',
      type: 'security',
      enabled: true,
      appliedRoles: ['admin', 'manager', 'it-support'],
      severity: 'critical',
      config: {
        methods: ['TOTP', 'SMS', 'Email'],
        gracePeriod: '7 days',
        rememberDevice: true
      }
    },
    {
      id: '2',
      name: 'Session Timeout',
      description: 'Automatically log out users after period of inactivity',
      type: 'security',
      enabled: true,
      appliedRoles: ['admin', 'manager', 'supervisor', 'operator', 'viewer'],
      severity: 'high',
      config: {
        timeout: '30 minutes',
        warning: '5 minutes before',
        extendable: true
      }
    },
    {
      id: '3',
      name: 'IP Whitelisting',
      description: 'Restrict access to specific IP addresses or ranges',
      type: 'access',
      enabled: true,
      appliedRoles: ['admin', 'it-support'],
      severity: 'critical',
      config: {
        allowedIPs: ['192.168.1.0/24', '10.0.0.0/8'],
        blockUnlisted: true,
        exceptions: []
      }
    },
    {
      id: '4',
      name: 'Time-Based Access',
      description: 'Limit access to specific time windows and days',
      type: 'access',
      enabled: false,
      appliedRoles: ['operator', 'viewer'],
      severity: 'medium',
      config: {
        allowedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '08:00',
        endTime: '18:00',
        timezone: 'UTC+05:30'
      }
    },
    {
      id: '5',
      name: 'Data Encryption at Rest',
      description: 'Encrypt sensitive data stored in the database',
      type: 'data',
      enabled: true,
      appliedRoles: ['admin', 'manager', 'supervisor', 'operator', 'viewer'],
      severity: 'critical',
      config: {
        algorithm: 'AES-256',
        keyRotation: '90 days',
        fields: ['password', 'ssn', 'bankAccount']
      }
    },
    {
      id: '6',
      name: 'Audit Logging',
      description: 'Log all user actions and system events for compliance',
      type: 'compliance',
      enabled: true,
      appliedRoles: ['admin', 'manager', 'supervisor', 'operator'],
      severity: 'high',
      config: {
        retention: '2 years',
        events: ['login', 'logout', 'create', 'update', 'delete', 'export'],
        realTime: true
      }
    },
    {
      id: '7',
      name: 'Password Complexity',
      description: 'Enforce strong password requirements for all users',
      type: 'security',
      enabled: true,
      appliedRoles: ['admin', 'manager', 'supervisor', 'operator', 'viewer'],
      severity: 'high',
      config: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expiryDays: 90,
        preventReuse: 5
      }
    },
    {
      id: '8',
      name: 'Failed Login Lockout',
      description: 'Lock account after consecutive failed login attempts',
      type: 'security',
      enabled: true,
      appliedRoles: ['admin', 'manager', 'supervisor', 'operator', 'viewer'],
      severity: 'high',
      config: {
        maxAttempts: 5,
        lockoutDuration: '30 minutes',
        resetOnSuccess: true,
        notifyUser: true
      }
    },
    {
      id: '9',
      name: 'Data Export Restrictions',
      description: 'Control and monitor data export activities',
      type: 'data',
      enabled: true,
      appliedRoles: ['manager', 'supervisor'],
      severity: 'high',
      config: {
        requireApproval: true,
        maxRecords: 10000,
        watermark: true,
        formats: ['CSV', 'Excel', 'PDF']
      }
    },
    {
      id: '10',
      name: 'Email Notifications',
      description: 'Send automated notifications for critical events',
      type: 'notification',
      enabled: true,
      appliedRoles: ['admin', 'manager'],
      severity: 'medium',
      config: {
        events: ['securityAlert', 'systemError', 'approvalRequest'],
        frequency: 'immediate',
        digest: false
      }
    },
    {
      id: '11',
      name: 'Geographic Restrictions',
      description: 'Restrict access based on geographic location',
      type: 'access',
      enabled: false,
      appliedRoles: ['admin'],
      severity: 'medium',
      config: {
        allowedCountries: ['India', 'USA', 'UK'],
        blockVPN: true,
        exceptions: []
      }
    },
    {
      id: '12',
      name: 'GDPR Compliance',
      description: 'Ensure compliance with GDPR data protection regulations',
      type: 'compliance',
      enabled: true,
      appliedRoles: ['admin', 'manager', 'supervisor', 'operator', 'viewer'],
      severity: 'critical',
      config: {
        rightToErasure: true,
        dataPortability: true,
        consentManagement: true,
        privacyByDefault: true
      }
    }
  ];

  const policyTypes = [
    { id: 'all', name: 'All Policies', icon: Shield, count: policies.length },
    { id: 'security', name: 'Security', icon: Lock, count: policies.filter(p => p.type === 'security').length },
    { id: 'access', name: 'Access Control', icon: Globe, count: policies.filter(p => p.type === 'access').length },
    { id: 'data', name: 'Data Protection', icon: Database, count: policies.filter(p => p.type === 'data').length },
    { id: 'notification', name: 'Notifications', icon: Bell, count: policies.filter(p => p.type === 'notification').length },
    { id: 'compliance', name: 'Compliance', icon: CheckCircle, count: policies.filter(p => p.type === 'compliance').length }
  ];

  const filteredPolicies = policies.filter(policy => {
    const matchesType = selectedType === 'all' || policy.type === selectedType;
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      security: 'bg-red-50 text-red-700 border-red-200',
      access: 'bg-blue-50 text-blue-700 border-blue-200',
      data: 'bg-purple-50 text-purple-700 border-purple-200',
      notification: 'bg-green-50 text-green-700 border-green-200',
      compliance: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || colors.security;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Role Policies</h1>
          <p className="text-sm text-gray-500 mt-1">Configure security and access policies for roles</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Policy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Policy Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <div className="space-y-2">
            {policyTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${selectedType === type.id ? 'text-blue-600' : 'text-gray-600'}`} />
                    <p className="font-medium text-gray-900 text-sm">{type.name}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">{type.count} policies</span>
                    {type.id !== 'all' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        policies.filter(p => p.type === type.id && p.enabled).length === type.count
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {policies.filter(p => p.type === type.id && p.enabled).length} active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-900">Policy Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">Total Policies</span>
                <span className="text-sm font-bold text-blue-900">{policies.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">Active</span>
                <span className="text-sm font-bold text-green-600">
                  {policies.filter(p => p.enabled).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">Inactive</span>
                <span className="text-sm font-bold text-gray-600">
                  {policies.filter(p => !p.enabled).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Policies List */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            {filteredPolicies.map((policy) => (
              <div key={policy.id} className={`border-2 rounded-lg p-5 ${policy.enabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{policy.name}</h3>
                      {policy.enabled ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{policy.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(policy.type)}`}>
                        {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(policy.severity)}`}>
                        {policy.severity === 'critical' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {policy.severity.charAt(0).toUpperCase() + policy.severity.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Applied to Roles:</p>
                      <div className="flex flex-wrap gap-1">
                        {policy.appliedRoles.map((role) => (
                          <span key={role} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Configuration:</p>
                      <div className="space-y-1">
                        {Object.entries(policy.config).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-gray-900 font-medium">
                              {Array.isArray(value) ? value.join(', ') : value.toString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No policies found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search term</p>
            </div>
          )}

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-900 mb-1">Policy Management Guidelines</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>" Critical policies affect system security and should be carefully reviewed before changes</li>
                  <li>" Disabling security policies may expose the system to vulnerabilities</li>
                  <li>" Policy changes take effect immediately for all users in assigned roles</li>
                  <li>" Compliance policies ensure regulatory adherence (GDPR, SOX, HIPAA)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
