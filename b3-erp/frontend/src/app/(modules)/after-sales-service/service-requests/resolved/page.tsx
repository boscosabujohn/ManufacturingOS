'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare,
  Flag,
  Tag,
  Building,
  Wrench,
  FileText,
  ExternalLink,
  ThumbsUp,
  Star,
  Award,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  ticketNumber: string;
  customer: {
    name: string;
    company: string;
    phone: string;
    email: string;
    address: string;
  };
  product: {
    name: string;
    model: string;
    serialNumber: string;
    warrantyStatus: 'Active' | 'Expired' | 'Extended';
  };
  issue: {
    title: string;
    description: string;
    category: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    severity: 'Critical' | 'Major' | 'Minor';
  };
  status: 'Resolved' | 'Closed' | 'Customer Approved';
  assignedTo: string;
  assignedTeam: string;
  createdDate: string;
  startedDate: string;
  resolvedDate: string;
  slaStatus: 'Met' | 'Exceeded' | 'Breached';
  resolutionTime: string;
  tags: string[];
  attachments: number;
  lastUpdate: string;
  contactPreference: 'Phone' | 'Email' | 'WhatsApp' | 'SMS';
  estimatedHours: number;
  actualHours: number;
  resolution: {
    summary: string;
    rootCause: string;
    actionsTaken: string[];
    partsReplaced: string[];
    preventiveMeasures: string[];
  };
  customerSatisfaction: {
    rating: number;
    feedback: string;
    wouldRecommend: boolean;
    responseTime: number;
    resolutionQuality: number;
  };
  followUp: {
    scheduled: boolean;
    date?: string;
    type?: string;
    completed?: boolean;
  };
}

const ResolvedServiceRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterSLA, setFilterSLA] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const serviceRequests: ServiceRequest[] = [
    {
      id: '1',
      ticketNumber: 'SR-2024-0017',
      customer: {
        name: 'Thomas Anderson',
        company: 'Matrix Manufacturing',
        phone: '+1-555-0199',
        email: 'thomas.anderson@matrix.com',
        address: '199 Neo Street, City Central, NY 10001'
      },
      product: {
        name: 'Automated Assembly Line',
        model: 'AAL-3000',
        serialNumber: 'AAL-3000-2023-067',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Sensor calibration causing misalignment',
        description: 'Position sensors were providing incorrect readings causing assembly misalignment and quality issues.',
        category: 'Calibration',
        priority: 'High',
        severity: 'Major'
      },
      status: 'Resolved',
      assignedTo: 'Sarah Johnson',
      assignedTeam: 'Automation Team',
      createdDate: '2024-01-05T09:00:00Z',
      startedDate: '2024-01-05T10:30:00Z',
      resolvedDate: '2024-01-07T15:30:00Z',
      slaStatus: 'Met',
      resolutionTime: '2d 5h',
      tags: ['Sensor', 'Calibration', 'Assembly'],
      attachments: 5,
      lastUpdate: '2024-01-07T15:30:00Z',
      contactPreference: 'Email',
      estimatedHours: 16,
      actualHours: 14,
      resolution: {
        summary: 'Replaced faulty position sensors and recalibrated entire assembly line',
        rootCause: 'Manufacturing defect in original sensor batch causing drift over time',
        actionsTaken: [
          'Diagnosed sensor accuracy issues',
          'Replaced all position sensors with updated models',
          'Performed full system recalibration',
          'Conducted quality test runs',
          'Updated calibration procedures'
        ],
        partsReplaced: ['Position Sensors (4x)', 'Calibration Module'],
        preventiveMeasures: [
          'Monthly calibration verification',
          'Sensor accuracy monitoring system',
          'Preventive replacement schedule'
        ]
      },
      customerSatisfaction: {
        rating: 5,
        feedback: 'Excellent service! Quick resolution and thorough explanation of the issue.',
        wouldRecommend: true,
        responseTime: 5,
        resolutionQuality: 5
      },
      followUp: {
        scheduled: true,
        date: '2024-02-07T10:00:00Z',
        type: 'Calibration Verification',
        completed: false
      }
    },
    {
      id: '2',
      ticketNumber: 'SR-2024-0018',
      customer: {
        name: 'Elena Rodriguez',
        company: 'GreenEnergy Solutions',
        phone: '+1-555-0288',
        email: 'elena.rodriguez@greenenergy.com',
        address: '288 Solar Drive, California, CA 90210'
      },
      product: {
        name: 'Solar Panel Inverter',
        model: 'SPI-5000',
        serialNumber: 'SPI-5000-2022-145',
        warrantyStatus: 'Extended'
      },
      issue: {
        title: 'Inverter efficiency degradation',
        description: 'Power conversion efficiency dropped from 98% to 92% over 6 months of operation.',
        category: 'Electronics',
        priority: 'Medium',
        severity: 'Minor'
      },
      status: 'Customer Approved',
      assignedTo: 'Michael Chen',
      assignedTeam: 'Electronics Team',
      createdDate: '2024-01-03T14:20:00Z',
      startedDate: '2024-01-04T08:00:00Z',
      resolvedDate: '2024-01-06T17:00:00Z',
      slaStatus: 'Exceeded',
      resolutionTime: '2d 9h',
      tags: ['Inverter', 'Efficiency', 'Power'],
      attachments: 3,
      lastUpdate: '2024-01-06T17:00:00Z',
      contactPreference: 'Phone',
      estimatedHours: 12,
      actualHours: 8,
      resolution: {
        summary: 'Replaced aging capacitors and updated firmware to latest version',
        rootCause: 'Electrolytic capacitors showing signs of aging reducing conversion efficiency',
        actionsTaken: [
          'Performed electrical diagnostics',
          'Identified aging capacitor bank',
          'Replaced capacitor bank with improved models',
          'Updated firmware to v3.2.1',
          'Verified efficiency restoration'
        ],
        partsReplaced: ['Capacitor Bank', 'Control Board'],
        preventiveMeasures: [
          'Annual capacitor health monitoring',
          'Firmware update notifications',
          'Environmental monitoring system'
        ]
      },
      customerSatisfaction: {
        rating: 5,
        feedback: 'Outstanding work! Efficiency is now even better than original specifications.',
        wouldRecommend: true,
        responseTime: 5,
        resolutionQuality: 5
      },
      followUp: {
        scheduled: true,
        date: '2024-04-06T14:00:00Z',
        type: 'Performance Review',
        completed: false
      }
    },
    {
      id: '3',
      ticketNumber: 'SR-2024-0019',
      customer: {
        name: 'David Park',
        company: 'Precision Tools Corp',
        phone: '+1-555-0367',
        email: 'david.park@precisiontools.com',
        address: '367 Tool Street, Detroit, MI 48201'
      },
      product: {
        name: 'CNC Lathe Machine',
        model: 'CL-2500',
        serialNumber: 'CL-2500-2023-089',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Spindle vibration affecting precision',
        description: 'Excessive spindle vibration causing poor surface finish and dimensional accuracy issues.',
        category: 'Mechanical',
        priority: 'High',
        severity: 'Major'
      },
      status: 'Closed',
      assignedTo: 'Lisa Martinez',
      assignedTeam: 'Mechanical Team',
      createdDate: '2024-01-01T11:30:00Z',
      startedDate: '2024-01-02T09:00:00Z',
      resolvedDate: '2024-01-05T16:45:00Z',
      slaStatus: 'Met',
      resolutionTime: '3d 7h 45m',
      tags: ['Spindle', 'Vibration', 'Precision'],
      attachments: 4,
      lastUpdate: '2024-01-05T16:45:00Z',
      contactPreference: 'Email',
      estimatedHours: 24,
      actualHours: 22,
      resolution: {
        summary: 'Replaced worn spindle bearings and rebalanced the spindle assembly',
        rootCause: 'Spindle bearing wear due to high-speed operation and contamination',
        actionsTaken: [
          'Performed vibration analysis',
          'Identified bearing wear patterns',
          'Replaced spindle bearing set',
          'Rebalanced spindle assembly',
          'Upgraded lubrication system',
          'Conducted precision tests'
        ],
        partsReplaced: ['Spindle Bearings', 'Lubrication Pump', 'Oil Filter'],
        preventiveMeasures: [
          'Quarterly vibration monitoring',
          'Enhanced lubrication schedule',
          'Contamination prevention training'
        ]
      },
      customerSatisfaction: {
        rating: 4,
        feedback: 'Good work overall. Machine is running smoothly now. Slightly longer than expected.',
        wouldRecommend: true,
        responseTime: 4,
        resolutionQuality: 5
      },
      followUp: {
        scheduled: true,
        date: '2024-02-05T13:00:00Z',
        type: 'Vibration Check',
        completed: false
      }
    },
    {
      id: '4',
      ticketNumber: 'SR-2024-0020',
      customer: {
        name: 'Rachel Green',
        company: 'FoodSafe Processing',
        phone: '+1-555-0434',
        email: 'rachel.green@foodsafe.com',
        address: '434 Food Safety Blvd, Chicago, IL 60601'
      },
      product: {
        name: 'Sterilization Unit',
        model: 'SU-1000',
        serialNumber: 'SU-1000-2023-123',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Temperature controller malfunction',
        description: 'Temperature controller failing to maintain consistent sterilization temperature.',
        category: 'Electronics',
        priority: 'Critical',
        severity: 'Critical'
      },
      status: 'Resolved',
      assignedTo: 'James Wilson',
      assignedTeam: 'Field Service',
      createdDate: '2023-12-28T08:00:00Z',
      startedDate: '2023-12-28T09:30:00Z',
      resolvedDate: '2023-12-29T14:20:00Z',
      slaStatus: 'Met',
      resolutionTime: '1d 4h 50m',
      tags: ['Temperature', 'Controller', 'Sterilization'],
      attachments: 6,
      lastUpdate: '2023-12-29T14:20:00Z',
      contactPreference: 'Phone',
      estimatedHours: 8,
      actualHours: 7,
      resolution: {
        summary: 'Replaced faulty temperature controller and calibrated system to FDA standards',
        rootCause: 'Temperature controller board failure due to power surge damage',
        actionsTaken: [
          'Emergency response within 2 hours',
          'Diagnosed controller board failure',
          'Replaced temperature controller',
          'Calibrated to FDA standards',
          'Installed surge protection',
          'Verified sterilization cycles'
        ],
        partsReplaced: ['Temperature Controller', 'Surge Protector', 'Temperature Probe'],
        preventiveMeasures: [
          'Power quality monitoring',
          'Monthly calibration verification',
          'Backup controller on standby'
        ]
      },
      customerSatisfaction: {
        rating: 5,
        feedback: 'Critical issue resolved quickly! Prevented production shutdown. Very professional team.',
        wouldRecommend: true,
        responseTime: 5,
        resolutionQuality: 5
      },
      followUp: {
        scheduled: true,
        date: '2024-01-29T11:00:00Z',
        type: 'Calibration Verification',
        completed: true
      }
    },
    {
      id: '5',
      ticketNumber: 'SR-2024-0021',
      customer: {
        name: 'Anthony Miller',
        company: 'AutoParts Plus',
        phone: '+1-555-0523',
        email: 'anthony.miller@autoparts.com',
        address: '523 Auto Lane, Toledo, OH 43604'
      },
      product: {
        name: 'Hydraulic Press',
        model: 'HP-1500',
        serialNumber: 'HP-1500-2022-234',
        warrantyStatus: 'Extended'
      },
      issue: {
        title: 'Hydraulic seal leak repair',
        description: 'Main cylinder seal leak causing pressure loss and oil contamination.',
        category: 'Hydraulic',
        priority: 'Medium',
        severity: 'Minor'
      },
      status: 'Resolved',
      assignedTo: 'Carlos Rodriguez',
      assignedTeam: 'Hydraulic Team',
      createdDate: '2023-12-20T13:15:00Z',
      startedDate: '2023-12-21T08:00:00Z',
      resolvedDate: '2023-12-23T15:30:00Z',
      slaStatus: 'Exceeded',
      resolutionTime: '2d 7h 30m',
      tags: ['Hydraulic', 'Seal', 'Leak'],
      attachments: 3,
      lastUpdate: '2023-12-23T15:30:00Z',
      contactPreference: 'WhatsApp',
      estimatedHours: 12,
      actualHours: 10,
      resolution: {
        summary: 'Replaced hydraulic seals and upgraded to improved seal design',
        rootCause: 'Normal wear of hydraulic seals after 2 years of operation',
        actionsTaken: [
          'Drained hydraulic system',
          'Disassembled main cylinder',
          'Replaced all hydraulic seals',
          'Upgraded to improved seal design',
          'Refilled with fresh hydraulic oil',
          'Pressure tested system'
        ],
        partsReplaced: ['Hydraulic Seal Kit', 'Hydraulic Oil', 'Filter Element'],
        preventiveMeasures: [
          'Annual seal inspection program',
          'Oil quality monitoring',
          'Upgraded seal specifications'
        ]
      },
      customerSatisfaction: {
        rating: 4,
        feedback: 'Great job! Machine is working better than before. Appreciate the upgrade.',
        wouldRecommend: true,
        responseTime: 4,
        resolutionQuality: 5
      },
      followUp: {
        scheduled: true,
        date: '2024-03-23T10:00:00Z',
        type: 'Preventive Maintenance',
        completed: false
      }
    },
    {
      id: '6',
      ticketNumber: 'SR-2024-0022',
      customer: {
        name: 'Nicole Taylor',
        company: 'TextileTech Industries',
        phone: '+1-555-0645',
        email: 'nicole.taylor@textiletech.com',
        address: '645 Textile Road, Charlotte, NC 28202'
      },
      product: {
        name: 'Fabric Cutting Machine',
        model: 'FCM-800',
        serialNumber: 'FCM-800-2023-178',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Blade dullness affecting cut quality',
        description: 'Cutting blade becoming dull resulting in frayed edges and material waste.',
        category: 'Maintenance',
        priority: 'Low',
        severity: 'Minor'
      },
      status: 'Customer Approved',
      assignedTo: 'Amanda Davis',
      assignedTeam: 'Maintenance Team',
      createdDate: '2023-12-15T16:20:00Z',
      startedDate: '2023-12-18T09:00:00Z',
      resolvedDate: '2023-12-18T12:30:00Z',
      slaStatus: 'Exceeded',
      resolutionTime: '3h 30m',
      tags: ['Blade', 'Cutting', 'Maintenance'],
      attachments: 2,
      lastUpdate: '2023-12-18T12:30:00Z',
      contactPreference: 'Email',
      estimatedHours: 4,
      actualHours: 3,
      resolution: {
        summary: 'Replaced cutting blade and optimized cutting parameters',
        rootCause: 'Normal blade wear after processing abrasive materials',
        actionsTaken: [
          'Assessed blade condition',
          'Replaced with new cutting blade',
          'Optimized cutting speed and pressure',
          'Performed test cuts on various materials',
          'Trained operator on maintenance indicators'
        ],
        partsReplaced: ['Cutting Blade', 'Blade Guard'],
        preventiveMeasures: [
          'Blade condition monitoring checklist',
          'Material-specific cutting parameters',
          'Operator training program'
        ]
      },
      customerSatisfaction: {
        rating: 5,
        feedback: 'Quick and efficient service. Cut quality is perfect now. Great training provided.',
        wouldRecommend: true,
        responseTime: 5,
        resolutionQuality: 5
      },
      followUp: {
        scheduled: false
      }
    },
    {
      id: '7',
      ticketNumber: 'SR-2024-0023',
      customer: {
        name: 'Robert Kim',
        company: 'Chemical Solutions Inc',
        phone: '+1-555-0756',
        email: 'robert.kim@chemsol.com',
        address: '756 Chemical Ave, Houston, TX 77002'
      },
      product: {
        name: 'Chemical Reactor',
        model: 'CR-3000',
        serialNumber: 'CR-3000-2022-345',
        warrantyStatus: 'Extended'
      },
      issue: {
        title: 'Pressure relief valve calibration',
        description: 'Safety pressure relief valve requiring recalibration after annual inspection.',
        category: 'Safety',
        priority: 'High',
        severity: 'Major'
      },
      status: 'Closed',
      assignedTo: 'Emily Johnson',
      assignedTeam: 'Safety Team',
      createdDate: '2023-12-10T10:00:00Z',
      startedDate: '2023-12-11T08:30:00Z',
      resolvedDate: '2023-12-12T16:00:00Z',
      slaStatus: 'Met',
      resolutionTime: '1d 7h 30m',
      tags: ['Safety', 'Pressure', 'Calibration'],
      attachments: 4,
      lastUpdate: '2023-12-12T16:00:00Z',
      contactPreference: 'Phone',
      estimatedHours: 6,
      actualHours: 6,
      resolution: {
        summary: 'Recalibrated pressure relief valve and updated safety documentation',
        rootCause: 'Scheduled calibration required per safety regulations',
        actionsTaken: [
          'Performed safety lockout procedures',
          'Removed and tested relief valve',
          'Recalibrated to exact specifications',
          'Reinstalled with new gaskets',
          'Updated safety certificates',
          'Conducted operational test'
        ],
        partsReplaced: ['Valve Gaskets', 'Calibration Certificate'],
        preventiveMeasures: [
          'Annual calibration reminder system',
          'Safety documentation updates',
          'Operator safety training refresh'
        ]
      },
      customerSatisfaction: {
        rating: 5,
        feedback: 'Perfect safety compliance service. Documentation is excellent. Very thorough.',
        wouldRecommend: true,
        responseTime: 5,
        resolutionQuality: 5
      },
      followUp: {
        scheduled: true,
        date: '2024-12-12T10:00:00Z',
        type: 'Annual Safety Inspection',
        completed: false
      }
    },
    {
      id: '8',
      ticketNumber: 'SR-2024-0024',
      customer: {
        name: 'Jessica Brown',
        company: 'PackagingPro Systems',
        phone: '+1-555-0867',
        email: 'jessica.brown@packagingpro.com',
        address: '867 Packaging Blvd, Atlanta, GA 30309'
      },
      product: {
        name: 'Automated Packaging Line',
        model: 'APL-1200',
        serialNumber: 'APL-1200-2023-456',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Conveyor belt misalignment',
        description: 'Packaging conveyor belt tracking incorrectly causing jams and product damage.',
        category: 'Mechanical',
        priority: 'Medium',
        severity: 'Minor'
      },
      status: 'Resolved',
      assignedTo: 'Kevin Lee',
      assignedTeam: 'Mechanical Team',
      createdDate: '2023-12-05T14:45:00Z',
      startedDate: '2023-12-06T09:00:00Z',
      resolvedDate: '2023-12-07T11:15:00Z',
      slaStatus: 'Exceeded',
      resolutionTime: '1d 2h 15m',
      tags: ['Conveyor', 'Belt', 'Alignment'],
      attachments: 3,
      lastUpdate: '2023-12-07T11:15:00Z',
      contactPreference: 'Email',
      estimatedHours: 8,
      actualHours: 6,
      resolution: {
        summary: 'Realigned conveyor belt and adjusted tracking mechanisms',
        rootCause: 'Belt stretching and roller wear causing tracking issues',
        actionsTaken: [
          'Analyzed belt tracking patterns',
          'Adjusted roller alignment',
          'Replaced worn tracking guides',
          'Retensioned conveyor belt',
          'Calibrated belt tracking system',
          'Performed operational tests'
        ],
        partsReplaced: ['Tracking Guides', 'Belt Tensioner'],
        preventiveMeasures: [
          'Monthly belt inspection routine',
          'Tension monitoring system',
          'Preventive roller replacement schedule'
        ]
      },
      customerSatisfaction: {
        rating: 4,
        feedback: 'Good service and explanation. Belt is running perfectly now. Thanks!',
        wouldRecommend: true,
        responseTime: 4,
        resolutionQuality: 4
      },
      followUp: {
        scheduled: true,
        date: '2024-02-07T14:00:00Z',
        type: 'Belt Inspection',
        completed: false
      }
    }
  ];

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = !filterPriority || request.issue.priority === filterPriority;
    const matchesCategory = !filterCategory || request.issue.category === filterCategory;
    const matchesAssignee = !filterAssignee || request.assignedTo === filterAssignee;
    const matchesSLA = !filterSLA || request.slaStatus === filterSLA;
    const matchesRating = !filterRating ||
      (filterRating === '5' && request.customerSatisfaction.rating === 5) ||
      (filterRating === '4+' && request.customerSatisfaction.rating >= 4) ||
      (filterRating === '3+' && request.customerSatisfaction.rating >= 3);

    return matchesSearch && matchesPriority && matchesCategory && matchesAssignee && matchesSLA && matchesRating;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'Met': return 'text-green-600 bg-green-50';
      case 'Exceeded': return 'text-blue-600 bg-blue-50';
      case 'Breached': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'text-green-600 bg-green-50';
      case 'Closed': return 'text-gray-600 bg-gray-50';
      case 'Customer Approved': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getWarrantyColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Extended': return 'text-blue-600 bg-blue-50';
      case 'Expired': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const averageRating = filteredRequests.reduce((sum, r) => sum + r.customerSatisfaction.rating, 0) / filteredRequests.length;
  const slaMetPercentage = (filteredRequests.filter(r => r.slaStatus === 'Met' || r.slaStatus === 'Exceeded').length / filteredRequests.length) * 100;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resolved Service Requests</h1>
        <p className="text-gray-600">View completed service requests and customer satisfaction metrics</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by ticket, customer, assignee, or issue..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electronics">Electronics</option>
              <option value="Calibration">Calibration</option>
              <option value="Hydraulic">Hydraulic</option>
              <option value="Safety">Safety</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterSLA}
              onChange={(e) => setFilterSLA(e.target.value)}
            >
              <option value="">All SLA Status</option>
              <option value="Met">Met</option>
              <option value="Exceeded">Exceeded</option>
              <option value="Breached">Breached</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4+">4+ Stars</option>
              <option value="3+">3+ Stars</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
            >
              <option value="">All Assignees</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Michael Chen">Michael Chen</option>
              <option value="Lisa Martinez">Lisa Martinez</option>
              <option value="James Wilson">James Wilson</option>
              <option value="Carlos Rodriguez">Carlos Rodriguez</option>
              <option value="Amanda Davis">Amanda Davis</option>
              <option value="Emily Johnson">Emily Johnson</option>
              <option value="Kevin Lee">Kevin Lee</option>
            </select>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{filteredRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{slaMetPercentage.toFixed(0)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ThumbsUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Would Recommend</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredRequests.filter(r => r.customerSatisfaction.wouldRecommend).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolution Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolution & SLA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{request.ticketNumber}</div>
                      <div className="text-sm text-gray-600 max-w-xs truncate">{request.issue.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.issue.priority)}`}>
                          {request.issue.priority}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {request.issue.category}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(request.status)}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {request.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{request.customer.name}</div>
                      <div className="text-sm text-gray-600">{request.customer.company}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{request.customer.phone}</span>
                      </div>
                      <div className="text-xs text-gray-500">{request.product.name}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getWarrantyColor(request.product.warrantyStatus)}`}>
                        {request.product.warrantyStatus} Warranty
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{request.assignedTo}</div>
                      <div className="text-sm text-gray-600">{request.assignedTeam}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {request.actualHours}h / {request.estimatedHours}h
                      </div>
                      <div className="text-xs text-gray-400">
                        Resolved: {new Date(request.resolvedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSLAStatusColor(request.slaStatus)}`}>
                        {request.slaStatus === 'Met' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {request.slaStatus === 'Exceeded' && <Award className="h-3 w-3 mr-1" />}
                        {request.slaStatus}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">Time: {request.resolutionTime}</div>
                      {request.followUp.scheduled && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Follow-up scheduled</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        {renderStars(request.customerSatisfaction.rating)}
                        <span className="text-sm text-gray-600 ml-2">
                          {request.customerSatisfaction.rating}/5
                        </span>
                      </div>
                      {request.customerSatisfaction.wouldRecommend && (
                        <div className="flex items-center gap-1 mt-1">
                          <ThumbsUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Would recommend</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        "{request.customerSatisfaction.feedback}"
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-800"

                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"

                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800"

                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800"

                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedRequest.ticketNumber}</h2>
                  <p className="text-gray-600">{selectedRequest.issue.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                    <span className="text-sm text-gray-600">•</span>
                    <div className="flex items-center gap-1">
                      {renderStars(selectedRequest.customerSatisfaction.rating)}
                      <span className="text-sm text-gray-600 ml-1">Customer Rating</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.customer.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.customer.email}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Resolution Summary</h3>
                  <div className="space-y-2">
                    <div><strong>Assigned To:</strong> {selectedRequest.assignedTo}</div>
                    <div><strong>Team:</strong> {selectedRequest.assignedTeam}</div>
                    <div><strong>Resolution Time:</strong> {selectedRequest.resolutionTime}</div>
                    <div><strong>Hours:</strong> {selectedRequest.actualHours} / {selectedRequest.estimatedHours}</div>
                    <div>
                      <strong>SLA Status:</strong>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSLAStatusColor(selectedRequest.slaStatus)}`}>
                        {selectedRequest.slaStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Resolution Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-3">{selectedRequest.resolution.summary}</p>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-gray-900">Root Cause:</strong>
                      <p className="text-gray-700">{selectedRequest.resolution.rootCause}</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">Actions Taken:</strong>
                      <ul className="list-disc list-inside text-gray-700 mt-1">
                        {selectedRequest.resolution.actionsTaken.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                    {selectedRequest.resolution.partsReplaced.length > 0 && (
                      <div>
                        <strong className="text-gray-900">Parts Replaced:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRequest.resolution.partsReplaced.map((part, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <strong className="text-gray-900">Preventive Measures:</strong>
                      <ul className="list-disc list-inside text-gray-700 mt-1">
                        {selectedRequest.resolution.preventiveMeasures.map((measure, index) => (
                          <li key={index}>{measure}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Satisfaction</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <strong>Overall Rating:</strong>
                        <div className="flex items-center gap-1">
                          {renderStars(selectedRequest.customerSatisfaction.rating)}
                          <span className="ml-1">({selectedRequest.customerSatisfaction.rating}/5)</span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong>Response Time:</strong> {selectedRequest.customerSatisfaction.responseTime}/5
                      </div>
                      <div className="mb-2">
                        <strong>Resolution Quality:</strong> {selectedRequest.customerSatisfaction.resolutionQuality}/5
                      </div>
                      {selectedRequest.customerSatisfaction.wouldRecommend && (
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">Would recommend our service</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <strong>Customer Feedback:</strong>
                      <p className="text-gray-700 italic mt-1">"{selectedRequest.customerSatisfaction.feedback}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRequest.followUp.scheduled && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Follow-up</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                      <span><strong>Scheduled:</strong> {selectedRequest.followUp.date && new Date(selectedRequest.followUp.date).toLocaleDateString()}</span>
                    </div>
                    <div><strong>Type:</strong> {selectedRequest.followUp.type}</div>
                    <div><strong>Status:</strong> {selectedRequest.followUp.completed ? 'Completed' : 'Pending'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolvedServiceRequestsPage;