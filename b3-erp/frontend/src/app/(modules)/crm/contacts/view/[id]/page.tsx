'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  Globe,
  Clock,
  MessageSquare,
  FileText,
  PhoneCall,
  Video,
  Activity,
  ArrowRight,
  MapPin,
  UserCheck,
  Tag,
  Linkedin,
  Twitter,
  Facebook,
  MoreVertical
} from 'lucide-react';

interface Contact {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  company: string;
  contactType: 'primary' | 'secondary' | 'billing' | 'technical';
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  createdAt: string;
}

interface ContactActivity {
  id: string;
  contactId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'video_call';
  title: string;
  description: string;
  performedBy: string;
  timestamp: string;
  metadata?: {
    duration?: string;
    outcome?: string;
    attachments?: number;
  };
}

// Mock contact data for Sarah Williams
const mockContact: Contact = {
  id: '1',
  salutation: 'Ms.',
  firstName: 'Sarah',
  lastName: 'Williams',
  title: 'Head of Procurement',
  department: 'Procurement & Supply Chain',
  email: 'sarah.williams@premierkitchen.com',
  phone: '+1 (555) 123-4567',
  mobile: '+1 (555) 987-6543',
  company: 'Premier Kitchen Designs',
  contactType: 'primary',
  status: 'active',
  lastContact: '2025-10-09',
  createdAt: '2025-08-15',
};

// Mock activities
const mockActivities: ContactActivity[] = [
  {
    id: 'ca1',
    contactId: '1',
    type: 'email',
    title: 'Product Inquiry Follow-up',
    description: 'Sent follow-up email regarding the new kitchen cabinet line pricing and availability. Included product catalog and installation timeline.',
    performedBy: 'John Martinez',
    timestamp: '2025-10-09 14:30',
    metadata: { attachments: 2 }
  },
  {
    id: 'ca2',
    contactId: '1',
    type: 'call',
    title: 'Contract Negotiation Discussion',
    description: 'Discussed contract terms for the upcoming Q4 bulk order. Sarah requested volume discount pricing and extended payment terms.',
    performedBy: 'John Martinez',
    timestamp: '2025-10-08 10:15',
    metadata: { duration: '35 mins', outcome: 'Positive' }
  },
  {
    id: 'ca3',
    contactId: '1',
    type: 'meeting',
    title: 'On-site Facility Tour',
    description: 'Conducted facility tour showcasing our manufacturing capabilities and quality control processes. Sarah was impressed with our automation systems.',
    performedBy: 'Michael Chen',
    timestamp: '2025-10-05 14:00',
    metadata: { duration: '2 hours', outcome: 'Very Positive' }
  },
  {
    id: 'ca4',
    contactId: '1',
    type: 'video_call',
    title: 'Product Demo Session',
    description: 'Virtual demonstration of new smart kitchen cabinet systems with integrated lighting and soft-close mechanisms.',
    performedBy: 'Jennifer Lee',
    timestamp: '2025-10-03 11:00',
    metadata: { duration: '45 mins', outcome: 'Interested' }
  },
  {
    id: 'ca5',
    contactId: '1',
    type: 'note',
    title: 'Budget Planning Note',
    description: 'Sarah mentioned Q4 budget has been approved for kitchen equipment upgrade. Estimated budget range: $250K-$300K. Decision timeline: End of November.',
    performedBy: 'John Martinez',
    timestamp: '2025-10-01 09:15'
  },
  {
    id: 'ca6',
    contactId: '1',
    type: 'email',
    title: 'Monthly Newsletter Sent',
    description: 'Sent September newsletter featuring new product launches, case studies, and industry trends.',
    performedBy: 'Marketing Automation',
    timestamp: '2025-09-28 08:00',
    metadata: { attachments: 1 }
  },
  {
    id: 'ca7',
    contactId: '1',
    type: 'call',
    title: 'Quarterly Check-in',
    description: 'Regular quarterly touch-base call. Discussed current supplier performance and upcoming procurement needs for their new showroom.',
    performedBy: 'John Martinez',
    timestamp: '2025-09-15 15:30',
    metadata: { duration: '20 mins', outcome: 'Positive' }
  }
];

const activityIcons = {
  call: PhoneCall,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  status_change: Activity,
  video_call: Video
};

const activityColors = {
  call: 'bg-blue-100 text-blue-600 border-blue-200',
  email: 'bg-purple-100 text-purple-600 border-purple-200',
  meeting: 'bg-green-100 text-green-600 border-green-200',
  note: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  status_change: 'bg-orange-100 text-orange-600 border-orange-200',
  video_call: 'bg-pink-100 text-pink-600 border-pink-200'
};

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

const contactTypeColors = {
  primary: 'bg-blue-100 text-blue-700',
  secondary: 'bg-purple-100 text-purple-700',
  billing: 'bg-green-100 text-green-700',
  technical: 'bg-orange-100 text-orange-700',
};

export default function ViewContactPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;
  const contact = mockContact; // In real app, fetch by contactId

  const [activeTab, setActiveTab] = useState<'overview' | 'communication' | 'details'>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'communication', name: 'Communication History', icon: MessageSquare },
    { id: 'details', name: 'Details', icon: FileText },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/crm/contacts')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Contacts</span>
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Contact Header Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {contact.salutation} {contact.firstName} {contact.lastName}
                </h1>
                <p className="text-lg text-gray-600 mt-1">{contact.title}</p>
                <p className="text-base text-gray-500">{contact.company}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${contactTypeColors[contact.contactType]}`}>
                    {contact.contactType.charAt(0).toUpperCase() + contact.contactType.slice(1)} Contact
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[contact.status]}`}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push(`/crm/contacts/edit/${contactId}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <PhoneCall className="h-4 w-4" />
                <span>Call</span>
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                <MoreVertical className="h-5 w-5" />
                <span>More</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-medium text-blue-600 uppercase mb-1">Email</p>
              <a href={`mailto:${contact.email}`} className="text-sm font-semibold text-blue-900 hover:underline break-all">
                {contact.email}
              </a>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <p className="text-xs font-medium text-purple-600 uppercase mb-1">Phone</p>
              <a href={`tel:${contact.phone}`} className="text-sm font-semibold text-purple-900 hover:underline">
                {contact.phone}
              </a>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-xs font-medium text-green-600 uppercase mb-1">Type</p>
              <p className="text-sm font-semibold text-green-900 capitalize">{contact.contactType}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <p className="text-xs font-medium text-orange-600 uppercase mb-1">Status</p>
              <p className="text-sm font-semibold text-orange-900 capitalize">{contact.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline break-all">{contact.email}</a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                    <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:underline">{contact.phone}</a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Mobile</p>
                    <a href={`tel:${contact.mobile}`} className="text-sm text-blue-600 hover:underline">{contact.mobile}</a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase">Address</p>
                    <p className="text-sm text-gray-900">456 Business Park Drive, Suite 200</p>
                    <p className="text-sm text-gray-900">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Company Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Company Name</p>
                  <p className="text-sm font-semibold text-gray-900">{contact.company}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Department</p>
                  <p className="text-sm text-gray-900">{contact.department}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Industry</p>
                  <p className="text-sm text-gray-900">Kitchen Design & Manufacturing</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Website</p>
                  <a href="https://www.premierkitchen.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    www.premierkitchen.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                Contact Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Contact Type</p>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${contactTypeColors[contact.contactType]}`}>
                    {contact.contactType.charAt(0).toUpperCase() + contact.contactType.slice(1)} Contact
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Reports To</p>
                  <p className="text-sm font-semibold text-gray-900">Michael Chen</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Preferred Contact Method</p>
                  <p className="text-sm text-gray-900">Email</p>
                </div>
              </div>
            </div>

            {/* Key Dates */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Key Dates
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Created</p>
                  <p className="text-sm font-semibold text-gray-900">{contact.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Last Contact</p>
                  <p className="text-sm font-semibold text-gray-900">{contact.lastContact}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Birthday</p>
                  <p className="text-sm text-gray-900">June 15, 1985</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communication History Tab */}
        {activeTab === 'communication' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Communication Timeline</h3>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium">
                  <PhoneCall className="h-4 w-4" />
                  <span>Log Call</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  <span>Add Note</span>
                </button>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {mockActivities
                .filter(activity => activity.contactId === contactId)
                .map((activity, index) => {
                  const ActivityIcon = activityIcons[activity.type];
                  const isLast = index === mockActivities.filter(a => a.contactId === contactId).length - 1;

                  return (
                    <div key={activity.id} className="relative">
                      {/* Timeline connector */}
                      {!isLast && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-300"></div>
                      )}

                      <div className="flex items-start space-x-4">
                        {/* Activity Icon */}
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${activityColors[activity.type]}`}>
                          <ActivityIcon className="h-5 w-5" />
                        </div>

                        {/* Activity Content */}
                        <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-base font-bold text-gray-900">{activity.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                by {activity.performedBy} • {activity.timestamp}
                              </p>
                            </div>
                            {activity.metadata?.outcome && (
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                activity.metadata.outcome === 'Positive' || activity.metadata.outcome === 'Very Positive'
                                  ? 'bg-green-100 text-green-700'
                                  : activity.metadata.outcome === 'Interested'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {activity.metadata.outcome}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-700 mb-3">{activity.description}</p>

                          {/* Activity Metadata */}
                          {activity.metadata && (
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                              {activity.metadata.duration && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{activity.metadata.duration}</span>
                                </div>
                              )}
                              {activity.metadata.attachments && (
                                <div className="flex items-center space-x-1">
                                  <FileText className="h-4 w-4" />
                                  <span>{activity.metadata.attachments} attachments</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* All detailed sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Full Name</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {contact.salutation} {contact.firstName} {contact.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Title/Position</p>
                    <p className="text-sm text-gray-900">{contact.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Department</p>
                    <p className="text-sm text-gray-900">{contact.department}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Assistant Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Assistant Name</p>
                    <p className="text-sm font-semibold text-gray-900">Emily Rodriguez</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Assistant Phone</p>
                    <a href="tel:+15552345678" className="text-sm text-blue-600 hover:underline">+1 (555) 234-5678</a>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Profiles</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href="https://linkedin.com/in/sarah-williams"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="text-sm font-medium">LinkedIn Profile</span>
                    </a>
                    <a
                      href="https://twitter.com/sarahwilliams"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-600"
                    >
                      <Twitter className="h-5 w-5" />
                      <span className="text-sm font-medium">Twitter Profile</span>
                    </a>
                    <a
                      href="https://facebook.com/sarah.williams"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-700 hover:text-blue-900"
                    >
                      <Facebook className="h-5 w-5" />
                      <span className="text-sm font-medium">Facebook Profile</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Preferred Contact Method</p>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Best Time to Contact</p>
                    <p className="text-sm text-gray-900">Weekdays, 9 AM - 5 PM PST</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <Tag className="h-3 w-3 mr-1" />
                      VIP
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      <Tag className="h-3 w-3 mr-1" />
                      Decision Maker
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <Tag className="h-3 w-3 mr-1" />
                      Procurement
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Key decision maker for kitchen procurement. Prefers detailed product specifications and competitive pricing.
                    Has a strong focus on quality and reliability. Currently evaluating suppliers for their Q4 budget allocation.
                    Interested in long-term partnership opportunities with volume discount pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
