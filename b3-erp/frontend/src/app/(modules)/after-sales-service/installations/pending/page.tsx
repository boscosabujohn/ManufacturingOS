'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
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
  AlertCircle,
  Truck,
  CheckSquare,
  Users,
  Package,
  MapIcon,
  CalendarDays,
  Timer,
  Star
} from 'lucide-react';

interface Installation {
  id: string;
  installationNumber: string;
  customer: {
    name: string;
    company: string;
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
    alternatePhone?: string;
  };
  product: {
    name: string;
    model: string;
    serialNumber: string;
    category: string;
    warrantyType: 'Standard' | 'Extended' | 'Premium';
    value: number;
  };
  installation: {
    type: 'New Installation' | 'Replacement' | 'Upgrade' | 'Relocation';
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    complexity: 'Simple' | 'Moderate' | 'Complex' | 'Highly Complex';
    estimatedDuration: string;
    requirements: string[];
    specialInstructions?: string;
  };
  scheduling: {
    requestedDate: string;
    scheduledDate: string;
    preferredTimeSlot: string;
    estimatedStartTime: string;
    estimatedEndTime: string;
    flexibility: 'Strict' | 'Flexible' | 'Emergency';
  };
  team: {
    leadTechnician: string;
    assistantTechnicians: string[];
    teamSize: number;
    specialistRequired: boolean;
    certification: string[];
  };
  status: 'Scheduled' | 'Confirmed' | 'Preparing' | 'En Route' | 'Delayed';
  progress: {
    preparationComplete: boolean;
    materialsReady: boolean;
    toolsChecked: boolean;
    customerNotified: boolean;
    siteAccessConfirmed: boolean;
  };
  location: {
    siteType: 'Indoor' | 'Outdoor' | 'Industrial' | 'Residential' | 'Commercial';
    accessRequirements: string;
    parkingAvailable: boolean;
    elevatorAccess: boolean;
    specialAccess: string;
  };
  materials: {
    partsRequired: string[];
    toolsRequired: string[];
    consumables: string[];
    documentsNeeded: string[];
  };
  createdDate: string;
  lastUpdate: string;
  tags: string[];
  attachments: number;
  notes: string;
  riskFactors: string[];
}

const PendingInstallationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterTechnician, setFilterTechnician] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterComplexity, setFilterComplexity] = useState('');
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const installations: Installation[] = [
    {
      id: '1',
      installationNumber: 'INST-2024-0001',
      customer: {
        name: 'Marcus Johnson',
        company: 'TechFlow Industries',
        phone: '+1-555-0101',
        email: 'marcus.johnson@techflow.com',
        address: '101 Innovation Drive, Tech Valley, CA 95014',
        contactPerson: 'Marcus Johnson',
        alternatePhone: '+1-555-0102'
      },
      product: {
        name: 'Industrial Automation System',
        model: 'IAS-5000X',
        serialNumber: 'IAS-5000X-2024-001',
        category: 'Automation',
        warrantyType: 'Premium',
        value: 125000
      },
      installation: {
        type: 'New Installation',
        priority: 'High',
        complexity: 'Highly Complex',
        estimatedDuration: '3 days',
        requirements: [
          'Clean room environment',
          'Compressed air supply',
          'Dedicated electrical circuit',
          'Network connectivity',
          'Safety lockout procedures'
        ],
        specialInstructions: 'Installation must be completed during weekend shutdown to avoid production disruption'
      },
      scheduling: {
        requestedDate: '2024-01-20T00:00:00Z',
        scheduledDate: '2024-01-22T00:00:00Z',
        preferredTimeSlot: 'Weekend',
        estimatedStartTime: '06:00',
        estimatedEndTime: '18:00',
        flexibility: 'Strict'
      },
      team: {
        leadTechnician: 'Robert Chen',
        assistantTechnicians: ['Sarah Martinez', 'David Kim'],
        teamSize: 3,
        specialistRequired: true,
        certification: ['Automation Systems', 'Safety Protocols', 'Clean Room']
      },
      status: 'Scheduled',
      progress: {
        preparationComplete: true,
        materialsReady: true,
        toolsChecked: true,
        customerNotified: true,
        siteAccessConfirmed: false
      },
      location: {
        siteType: 'Industrial',
        accessRequirements: 'Security clearance required, safety equipment mandatory',
        parkingAvailable: true,
        elevatorAccess: false,
        specialAccess: 'Loading dock access for equipment delivery'
      },
      materials: {
        partsRequired: ['Control Panel', 'Sensor Array', 'Actuator Set', 'Wiring Harness'],
        toolsRequired: ['Calibration Equipment', 'Programming Laptop', 'Multimeter', 'Torque Wrench'],
        consumables: ['Cable Ties', 'Electrical Tape', 'Labels', 'Cleaning Supplies'],
        documentsNeeded: ['Installation Manual', 'Safety Protocols', 'Calibration Certificate']
      },
      createdDate: '2024-01-10T09:00:00Z',
      lastUpdate: '2024-01-18T16:30:00Z',
      tags: ['High Flag', 'Weekend Work', 'Complex'],
      attachments: 6,
      notes: 'Customer requires minimal downtime. Installation window is critical.',
      riskFactors: ['Time constraints', 'Clean room requirements', 'Weekend scheduling']
    },
    {
      id: '2',
      installationNumber: 'INST-2024-0002',
      customer: {
        name: 'Lisa Patterson',
        company: 'GreenTech Solutions',
        phone: '+1-555-0203',
        email: 'lisa.patterson@greentech.com',
        address: '203 Solar Avenue, Renewable City, NV 89123',
        contactPerson: 'Lisa Patterson'
      },
      product: {
        name: 'Solar Power Management System',
        model: 'SPMS-3000',
        serialNumber: 'SPMS-3000-2024-012',
        category: 'Energy',
        warrantyType: 'Extended',
        value: 85000
      },
      installation: {
        type: 'New Installation',
        priority: 'Medium',
        complexity: 'Moderate',
        estimatedDuration: '2 days',
        requirements: [
          'Roof access equipment',
          'Weather-dependent scheduling',
          'Electrical permits',
          'Grid connection approval'
        ],
        specialInstructions: 'Installation dependent on weather conditions'
      },
      scheduling: {
        requestedDate: '2024-01-25T00:00:00Z',
        scheduledDate: '2024-01-26T00:00:00Z',
        preferredTimeSlot: 'Morning',
        estimatedStartTime: '08:00',
        estimatedEndTime: '17:00',
        flexibility: 'Flexible'
      },
      team: {
        leadTechnician: 'Michael Torres',
        assistantTechnicians: ['Jennifer Lee'],
        teamSize: 2,
        specialistRequired: false,
        certification: ['Solar Installation', 'Electrical Work', 'Height Safety']
      },
      status: 'Confirmed',
      progress: {
        preparationComplete: true,
        materialsReady: true,
        toolsChecked: false,
        customerNotified: true,
        siteAccessConfirmed: true
      },
      location: {
        siteType: 'Commercial',
        accessRequirements: 'Height safety equipment, weather monitoring',
        parkingAvailable: true,
        elevatorAccess: true,
        specialAccess: 'Roof access via service elevator'
      },
      materials: {
        partsRequired: ['Solar Panels', 'Inverter Units', 'Mounting Hardware', 'DC Cables'],
        toolsRequired: ['Drill Set', 'Voltage Meter', 'Crimping Tools', 'Safety Harness'],
        consumables: ['Sealant', 'Conduit', 'Wire Nuts', 'Weatherproofing'],
        documentsNeeded: ['Installation Guide', 'Electrical Diagrams', 'Permit Documentation']
      },
      createdDate: '2024-01-12T11:30:00Z',
      lastUpdate: '2024-01-19T14:20:00Z',
      tags: ['Weather Dependent', 'Roof Work'],
      attachments: 4,
      notes: 'Monitor weather forecast for installation window.',
      riskFactors: ['Weather conditions', 'Height work', 'Grid connection timing']
    },
    {
      id: '3',
      installationNumber: 'INST-2024-0003',
      customer: {
        name: 'James Wilson',
        company: 'Metro Hospital System',
        phone: '+1-555-0304',
        email: 'james.wilson@metrohospital.com',
        address: '304 Medical Center Drive, Healthcare City, TX 77001',
        contactPerson: 'Dr. James Wilson',
        alternatePhone: '+1-555-0305'
      },
      product: {
        name: 'Medical Equipment Suite',
        model: 'MES-2000',
        serialNumber: 'MES-2000-2024-023',
        category: 'Medical',
        warrantyType: 'Premium',
        value: 200000
      },
      installation: {
        type: 'Upgrade',
        priority: 'Critical',
        complexity: 'Complex',
        estimatedDuration: '4 days',
        requirements: [
          'Medical grade installation',
          'Sterile environment protocols',
          'FDA compliance verification',
          'Staff training included',
          'Minimal patient disruption'
        ],
        specialInstructions: 'Installation during off-peak hours only. Strict hygiene protocols required.'
      },
      scheduling: {
        requestedDate: '2024-01-28T00:00:00Z',
        scheduledDate: '2024-01-30T00:00:00Z',
        preferredTimeSlot: 'Night Shift',
        estimatedStartTime: '22:00',
        estimatedEndTime: '06:00',
        flexibility: 'Strict'
      },
      team: {
        leadTechnician: 'Dr. Amanda Foster',
        assistantTechnicians: ['Kevin Zhang', 'Maria Rodriguez'],
        teamSize: 3,
        specialistRequired: true,
        certification: ['Medical Equipment', 'FDA Compliance', 'Sterile Procedures']
      },
      status: 'Preparing',
      progress: {
        preparationComplete: false,
        materialsReady: true,
        toolsChecked: true,
        customerNotified: true,
        siteAccessConfirmed: true
      },
      location: {
        siteType: 'Indoor',
        accessRequirements: 'Medical facility clearance, sterile protocols, background check',
        parkingAvailable: true,
        elevatorAccess: true,
        specialAccess: 'Service elevator to medical floor, security escort required'
      },
      materials: {
        partsRequired: ['Imaging Unit', 'Control Console', 'Patient Table', 'Monitor Array'],
        toolsRequired: ['Precision Instruments', 'Calibration Kit', 'Sterile Tools', 'Alignment Laser'],
        consumables: ['Sterile Covers', 'Medical Tape', 'Cleaning Solutions', 'Documentation'],
        documentsNeeded: ['FDA Documentation', 'Installation Protocol', 'Training Materials', 'Compliance Checklist']
      },
      createdDate: '2024-01-08T15:45:00Z',
      lastUpdate: '2024-01-19T11:00:00Z',
      tags: ['Critical', 'Medical', 'Night Work', 'Compliance'],
      attachments: 8,
      notes: 'Critical medical equipment. Zero tolerance for installation delays.',
      riskFactors: ['Patient safety', 'Compliance requirements', 'Night shift coordination']
    },
    {
      id: '4',
      installationNumber: 'INST-2024-0004',
      customer: {
        name: 'Carlos Rodriguez',
        company: 'FoodSafe Processing',
        phone: '+1-555-0405',
        email: 'carlos.rodriguez@foodsafe.com',
        address: '405 Processing Plant Road, Industrial Zone, IL 60601',
        contactPerson: 'Carlos Rodriguez'
      },
      product: {
        name: 'Food Safety Monitoring System',
        model: 'FSMS-1500',
        serialNumber: 'FSMS-1500-2024-034',
        category: 'Safety',
        warrantyType: 'Standard',
        value: 65000
      },
      installation: {
        type: 'Replacement',
        priority: 'High',
        complexity: 'Moderate',
        estimatedDuration: '1.5 days',
        requirements: [
          'Food grade materials only',
          'Wash-down rated equipment',
          'Temperature monitoring',
          'Data logging capability'
        ],
        specialInstructions: 'Installation during production downtime. Food safety protocols mandatory.'
      },
      scheduling: {
        requestedDate: '2024-01-24T00:00:00Z',
        scheduledDate: '2024-01-25T00:00:00Z',
        preferredTimeSlot: 'Maintenance Window',
        estimatedStartTime: '20:00',
        estimatedEndTime: '08:00',
        flexibility: 'Flexible'
      },
      team: {
        leadTechnician: 'Patricia Lee',
        assistantTechnicians: ['Thomas Kim'],
        teamSize: 2,
        specialistRequired: false,
        certification: ['Food Safety', 'Hygiene Protocols', 'Data Systems']
      },
      status: 'Confirmed',
      progress: {
        preparationComplete: true,
        materialsReady: true,
        toolsChecked: true,
        customerNotified: true,
        siteAccessConfirmed: true
      },
      location: {
        siteType: 'Industrial',
        accessRequirements: 'Food safety training, hairnet and protective clothing',
        parkingAvailable: true,
        elevatorAccess: false,
        specialAccess: 'Production floor access during maintenance window'
      },
      materials: {
        partsRequired: ['Sensor Array', 'Data Logger', 'Display Panel', 'Network Interface'],
        toolsRequired: ['Calibration Tools', 'Network Tester', 'Sanitary Tools', 'Temperature Probe'],
        consumables: ['Food Grade Sealant', 'Sanitary Wipes', 'Cable Covers', 'Labels'],
        documentsNeeded: ['Food Safety Manual', 'Calibration Procedures', 'Data Setup Guide']
      },
      createdDate: '2024-01-14T13:20:00Z',
      lastUpdate: '2024-01-19T09:45:00Z',
      tags: ['Food Safety', 'Replacement', 'Night Window'],
      attachments: 3,
      notes: 'Replacement of existing system. Minimal downtime required.',
      riskFactors: ['Food contamination', 'Production schedule', 'Data migration']
    },
    {
      id: '5',
      installationNumber: 'INST-2024-0005',
      customer: {
        name: 'Rachel Thompson',
        company: 'University Research Lab',
        phone: '+1-555-0506',
        email: 'rachel.thompson@university.edu',
        address: '506 Research Boulevard, Academic Campus, MA 02139',
        contactPerson: 'Prof. Rachel Thompson'
      },
      product: {
        name: 'Laboratory Analysis System',
        model: 'LAS-4000',
        serialNumber: 'LAS-4000-2024-045',
        category: 'Research',
        warrantyType: 'Extended',
        value: 150000
      },
      installation: {
        type: 'New Installation',
        priority: 'Medium',
        complexity: 'Complex',
        estimatedDuration: '3 days',
        requirements: [
          'Vibration isolation',
          'Temperature control',
          'Humidity control',
          'Clean air supply',
          'Specialized utilities'
        ],
        specialInstructions: 'Precision installation with environmental controls verification'
      },
      scheduling: {
        requestedDate: '2024-02-05T00:00:00Z',
        scheduledDate: '2024-02-05T00:00:00Z',
        preferredTimeSlot: 'Business Hours',
        estimatedStartTime: '09:00',
        estimatedEndTime: '17:00',
        flexibility: 'Flexible'
      },
      team: {
        leadTechnician: 'Dr. Steven Park',
        assistantTechnicians: ['Emily Chen', 'Robert Martinez'],
        teamSize: 3,
        specialistRequired: true,
        certification: ['Precision Instruments', 'Laboratory Standards', 'Environmental Controls']
      },
      status: 'Scheduled',
      progress: {
        preparationComplete: false,
        materialsReady: false,
        toolsChecked: false,
        customerNotified: true,
        siteAccessConfirmed: false
      },
      location: {
        siteType: 'Indoor',
        accessRequirements: 'University ID, laboratory safety training',
        parkingAvailable: true,
        elevatorAccess: true,
        specialAccess: 'Research building access, laboratory protocols'
      },
      materials: {
        partsRequired: ['Analysis Module', 'Computer Interface', 'Sample Handler', 'Optical Components'],
        toolsRequired: ['Precision Tools', 'Alignment Equipment', 'Environmental Meters', 'Calibration Standards'],
        consumables: ['Optical Cleaning', 'Precision Lubricants', 'Protective Covers', 'Documentation'],
        documentsNeeded: ['Installation Manual', 'Calibration Procedures', 'Safety Guidelines', 'Operating Manual']
      },
      createdDate: '2024-01-15T10:15:00Z',
      lastUpdate: '2024-01-18T15:30:00Z',
      tags: ['Research', 'Precision', 'Academic'],
      attachments: 5,
      notes: 'Research installation requiring high precision and environmental controls.',
      riskFactors: ['Environmental requirements', 'Precision alignment', 'Academic schedule']
    },
    {
      id: '6',
      installationNumber: 'INST-2024-0006',
      customer: {
        name: 'Kevin Brown',
        company: 'AutoTech Manufacturing',
        phone: '+1-555-0607',
        email: 'kevin.brown@autotech.com',
        address: '607 Assembly Line Drive, Motor City, MI 48201',
        contactPerson: 'Kevin Brown'
      },
      product: {
        name: 'Robotic Assembly Station',
        model: 'RAS-3500',
        serialNumber: 'RAS-3500-2024-056',
        category: 'Robotics',
        warrantyType: 'Premium',
        value: 180000
      },
      installation: {
        type: 'New Installation',
        priority: 'High',
        complexity: 'Highly Complex',
        estimatedDuration: '5 days',
        requirements: [
          'Foundation preparation',
          'Power requirements 480V',
          'Compressed air supply',
          'Safety systems integration',
          'Programming and commissioning'
        ],
        specialInstructions: 'Installation during plant shutdown. Foundation work completed prior to delivery.'
      },
      scheduling: {
        requestedDate: '2024-02-10T00:00:00Z',
        scheduledDate: '2024-02-12T00:00:00Z',
        preferredTimeSlot: 'Plant Shutdown',
        estimatedStartTime: '06:00',
        estimatedEndTime: '22:00',
        flexibility: 'Strict'
      },
      team: {
        leadTechnician: 'Alex Rodriguez',
        assistantTechnicians: ['Lisa Chang', 'Mark Thompson', 'Sarah Davis'],
        teamSize: 4,
        specialistRequired: true,
        certification: ['Robotics', 'Safety Systems', 'Programming', 'Heavy Equipment']
      },
      status: 'Delayed',
      progress: {
        preparationComplete: true,
        materialsReady: false,
        toolsChecked: true,
        customerNotified: true,
        siteAccessConfirmed: true
      },
      location: {
        siteType: 'Industrial',
        accessRequirements: 'Safety training, PPE required, confined space permit',
        parkingAvailable: true,
        elevatorAccess: false,
        specialAccess: 'Factory floor access via loading dock, crane available'
      },
      materials: {
        partsRequired: ['Robot Arm', 'Control Cabinet', 'Safety Barriers', 'Vision System'],
        toolsRequired: ['Lifting Equipment', 'Programming Terminal', 'Alignment Tools', 'Safety Tester'],
        consumables: ['Hydraulic Fluid', 'Pneumatic Fittings', 'Electrical Components', 'Safety Labels'],
        documentsNeeded: ['Installation Guide', 'Safety Manual', 'Programming Guide', 'Commissioning Checklist']
      },
      createdDate: '2024-01-05T08:30:00Z',
      lastUpdate: '2024-01-19T13:15:00Z',
      tags: ['High Value', 'Complex', 'Delayed', 'Plant Shutdown'],
      attachments: 7,
      notes: 'Delayed due to parts availability. Customer notified of new schedule.',
      riskFactors: ['Parts delay', 'Plant shutdown window', 'Complex integration']
    },
    {
      id: '7',
      installationNumber: 'INST-2024-0007',
      customer: {
        name: 'Nicole Davis',
        company: 'RetailMax Distribution',
        phone: '+1-555-0708',
        email: 'nicole.davis@retailmax.com',
        address: '708 Distribution Center Way, Logistics Hub, GA 30309',
        contactPerson: 'Nicole Davis'
      },
      product: {
        name: 'Warehouse Management System',
        model: 'WMS-2500',
        serialNumber: 'WMS-2500-2024-067',
        category: 'Logistics',
        warrantyType: 'Standard',
        value: 95000
      },
      installation: {
        type: 'Upgrade',
        priority: 'Medium',
        complexity: 'Moderate',
        estimatedDuration: '2 days',
        requirements: [
          'Network infrastructure',
          'Barcode scanning stations',
          'Data migration',
          'Staff training',
          'Integration testing'
        ],
        specialInstructions: 'Phased installation to maintain warehouse operations'
      },
      scheduling: {
        requestedDate: '2024-02-01T00:00:00Z',
        scheduledDate: '2024-02-01T00:00:00Z',
        preferredTimeSlot: 'Night Shift',
        estimatedStartTime: '18:00',
        estimatedEndTime: '06:00',
        flexibility: 'Flexible'
      },
      team: {
        leadTechnician: 'Daniel Kim',
        assistantTechnicians: ['Angela Wong'],
        teamSize: 2,
        specialistRequired: false,
        certification: ['Network Systems', 'Data Migration', 'Training']
      },
      status: 'Confirmed',
      progress: {
        preparationComplete: true,
        materialsReady: true,
        toolsChecked: true,
        customerNotified: true,
        siteAccessConfirmed: true
      },
      location: {
        siteType: 'Commercial',
        accessRequirements: 'Security clearance, safety vest required',
        parkingAvailable: true,
        elevatorAccess: true,
        specialAccess: 'Warehouse floor access, forklift traffic area'
      },
      materials: {
        partsRequired: ['Server Hardware', 'Scanning Devices', 'Network Equipment', 'Workstations'],
        toolsRequired: ['Network Tools', 'Laptop', 'Cable Tester', 'Label Printer'],
        consumables: ['Network Cables', 'Cable Management', 'Labels', 'Backup Media'],
        documentsNeeded: ['System Manual', 'Migration Plan', 'Training Materials', 'Test Procedures']
      },
      createdDate: '2024-01-16T14:00:00Z',
      lastUpdate: '2024-01-19T16:45:00Z',
      tags: ['Upgrade', 'Warehouse', 'Night Work'],
      attachments: 4,
      notes: 'Phased upgrade to minimize operational disruption.',
      riskFactors: ['Data migration', 'Operational continuity', 'Staff training timeline']
    },
    {
      id: '8',
      installationNumber: 'INST-2024-0008',
      customer: {
        name: 'Susan Miller',
        company: 'EcoEnergy Systems',
        phone: '+1-555-0809',
        email: 'susan.miller@ecoenergy.com',
        address: '809 Wind Power Lane, Green Valley, WY 82001',
        contactPerson: 'Susan Miller',
        alternatePhone: '+1-555-0810'
      },
      product: {
        name: 'Wind Turbine Control System',
        model: 'WTCS-5000',
        serialNumber: 'WTCS-5000-2024-078',
        category: 'Energy',
        warrantyType: 'Extended',
        value: 110000
      },
      installation: {
        type: 'New Installation',
        priority: 'Low',
        complexity: 'Complex',
        estimatedDuration: '4 days',
        requirements: [
          'Weather dependent work',
          'Height safety protocols',
          'Environmental permits',
          'Wildlife considerations',
          'Grid connection testing'
        ],
        specialInstructions: 'Installation weather dependent. Environmental monitoring required.'
      },
      scheduling: {
        requestedDate: '2024-02-15T00:00:00Z',
        scheduledDate: '2024-02-15T00:00:00Z',
        preferredTimeSlot: 'Weather Window',
        estimatedStartTime: '07:00',
        estimatedEndTime: '19:00',
        flexibility: 'Emergency'
      },
      team: {
        leadTechnician: 'Michael Johnson',
        assistantTechnicians: ['Rachel Green', 'Brian Wilson'],
        teamSize: 3,
        specialistRequired: true,
        certification: ['Height Safety', 'Wind Systems', 'Environmental', 'Grid Connection']
      },
      status: 'En Route',
      progress: {
        preparationComplete: true,
        materialsReady: true,
        toolsChecked: true,
        customerNotified: true,
        siteAccessConfirmed: true
      },
      location: {
        siteType: 'Outdoor',
        accessRequirements: 'Environmental permits, weather monitoring, wildlife clearance',
        parkingAvailable: false,
        elevatorAccess: false,
        specialAccess: 'Off-road vehicle access, crane positioning area'
      },
      materials: {
        partsRequired: ['Control Unit', 'Sensor Package', 'Communication Module', 'Safety Systems'],
        toolsRequired: ['Climbing Equipment', 'Weather Station', 'Communication Radio', 'Precision Tools'],
        consumables: ['Weather Sealing', 'Grounding Materials', 'Safety Rope', 'Environmental Markers'],
        documentsNeeded: ['Environmental Permits', 'Safety Procedures', 'Installation Manual', 'Grid Connection Plan']
      },
      createdDate: '2024-01-11T12:00:00Z',
      lastUpdate: '2024-01-20T08:00:00Z',
      tags: ['Weather Dependent', 'Height Work', 'Environmental'],
      attachments: 6,
      notes: 'Team en route to site. Weather conditions favorable for installation.',
      riskFactors: ['Weather conditions', 'Height safety', 'Environmental compliance', 'Remote location']
    }
  ];

  const filteredInstallations = installations.filter(installation => {
    const matchesSearch = installation.installationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         installation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         installation.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         installation.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         installation.team.leadTechnician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = !filterPriority || installation.installation.priority === filterPriority;
    const matchesType = !filterType || installation.installation.type === filterType;
    const matchesTechnician = !filterTechnician || installation.team.leadTechnician === filterTechnician;
    const matchesStatus = !filterStatus || installation.status === filterStatus;
    const matchesComplexity = !filterComplexity || installation.installation.complexity === filterComplexity;
    
    return matchesSearch && matchesPriority && matchesType && matchesTechnician && matchesStatus && matchesComplexity;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600 bg-blue-50';
      case 'Confirmed': return 'text-green-600 bg-green-50';
      case 'Preparing': return 'text-yellow-600 bg-yellow-50';
      case 'En Route': return 'text-purple-600 bg-purple-50';
      case 'Delayed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'text-green-600 bg-green-50';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50';
      case 'Complex': return 'text-orange-600 bg-orange-50';
      case 'Highly Complex': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getWarrantyColor = (type: string) => {
    switch (type) {
      case 'Premium': return 'text-purple-600 bg-purple-50';
      case 'Extended': return 'text-blue-600 bg-blue-50';
      case 'Standard': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressPercentage = (progress: Installation['progress']) => {
    const completed = Object.values(progress).filter(Boolean).length;
    const total = Object.keys(progress).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pending Installations</h1>
        <p className="text-gray-600">Manage and track scheduled installations awaiting execution</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by installation number, customer, product, or technician..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="New Installation">New Installation</option>
              <option value="Replacement">Replacement</option>
              <option value="Upgrade">Upgrade</option>
              <option value="Relocation">Relocation</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="En Route">En Route</option>
              <option value="Delayed">Delayed</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterComplexity}
              onChange={(e) => setFilterComplexity(e.target.value)}
            >
              <option value="">All Complexity</option>
              <option value="Simple">Simple</option>
              <option value="Moderate">Moderate</option>
              <option value="Complex">Complex</option>
              <option value="Highly Complex">Highly Complex</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterTechnician}
              onChange={(e) => setFilterTechnician(e.target.value)}
            >
              <option value="">All Technicians</option>
              <option value="Robert Chen">Robert Chen</option>
              <option value="Michael Torres">Michael Torres</option>
              <option value="Dr. Amanda Foster">Dr. Amanda Foster</option>
              <option value="Patricia Lee">Patricia Lee</option>
              <option value="Dr. Steven Park">Dr. Steven Park</option>
              <option value="Alex Rodriguez">Alex Rodriguez</option>
              <option value="Daniel Kim">Daniel Kim</option>
              <option value="Michael Johnson">Michael Johnson</option>
            </select>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-gray-900">{filteredInstallations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flag className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Flag</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInstallations.filter(i => i.installation.priority === 'Critical').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delayed</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInstallations.filter(i => i.status === 'Delayed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ready to Start</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInstallations.filter(i => i.status === 'Confirmed' || i.status === 'En Route').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Installations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installation Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduling
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team & Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Flag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstallations.map((installation) => (
                <tr key={installation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{installation.installationNumber}</div>
                      <div className="text-sm text-gray-600">{installation.installation.type}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(installation.installation.complexity)}`}>
                          {installation.installation.complexity}
                        </span>
                        <span className="text-xs text-gray-500">{installation.installation.estimatedDuration}</span>
                      </div>
                      {installation.attachments > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{installation.attachments} files</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{installation.customer.name}</div>
                      <div className="text-sm text-gray-600">{installation.customer.company}</div>
                      <div className="text-sm text-gray-900 mt-1">{installation.product.name}</div>
                      <div className="text-xs text-gray-500">{installation.product.model}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getWarrantyColor(installation.product.warrantyType)}`}>
                        {installation.product.warrantyType} Warranty
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(installation.scheduling.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{installation.scheduling.preferredTimeSlot}</div>
                      <div className="text-xs text-gray-500">
                        {installation.scheduling.estimatedStartTime} - {installation.scheduling.estimatedEndTime}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Timer className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{installation.scheduling.flexibility}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{installation.team.leadTechnician}</div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Team of {installation.team.teamSize}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getProgressPercentage(installation.progress)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(installation.progress)}% prepared
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(installation.status)}`}>
                        {installation.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriorityColor(installation.installation.priority)}`}>
                        {installation.installation.priority}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Value: ${installation.product.value.toLocaleString()}
                      </div>
                      {installation.riskFactors.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600">{installation.riskFactors.length} risks</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInstallation(installation)}
                        className="text-blue-600 hover:text-blue-800"
                       
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"
                       
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800"
                       
                      >
                        <MessageSquare className="h-4 w-4" />
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
      {selectedInstallation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl  w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedInstallation.installationNumber}</h2>
                  <p className="text-gray-600">{selectedInstallation.installation.type} - {selectedInstallation.product.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInstallation.status)}`}>
                      {selectedInstallation.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedInstallation.installation.priority)}`}>
                      {selectedInstallation.installation.priority} Flag
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(selectedInstallation.installation.complexity)}`}>
                      {selectedInstallation.installation.complexity}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInstallation(null)}
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
                      <span>{selectedInstallation.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{selectedInstallation.customer.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedInstallation.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedInstallation.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedInstallation.customer.address}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Installation Team</h3>
                  <div className="space-y-2">
                    <div><strong>Lead Technician:</strong> {selectedInstallation.team.leadTechnician}</div>
                    <div><strong>Team Size:</strong> {selectedInstallation.team.teamSize}</div>
                    <div><strong>Assistants:</strong> {selectedInstallation.team.assistantTechnicians.join(', ')}</div>
                    <div><strong>Specialist Required:</strong> {selectedInstallation.team.specialistRequired ? 'Yes' : 'No'}</div>
                    <div>
                      <strong>Certifications:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedInstallation.team.certification.map((cert, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Installation Requirements</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Duration:</strong> {selectedInstallation.installation.estimatedDuration}
                    </div>
                    <div>
                      <strong>Value:</strong> ${selectedInstallation.product.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-3">
                    <strong>Requirements:</strong>
                    <ul className="list-disc list-inside text-gray-700 mt-1">
                      {selectedInstallation.installation.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedInstallation.installation.specialInstructions && (
                    <div className="mt-3">
                      <strong>Special Instructions:</strong>
                      <p className="text-gray-700 mt-1">{selectedInstallation.installation.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Preparation Progress</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(selectedInstallation.progress).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value ? (
                          <CheckSquare className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 border border-gray-300 rounded"></div>
                        )}
                        <span className={`text-sm ${value ? 'text-green-600' : 'text-gray-600'}`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full flex items-center justify-center" 
                        style={{ width: `${getProgressPercentage(selectedInstallation.progress)}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {getProgressPercentage(selectedInstallation.progress)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Location Details</h3>
                  <div className="space-y-2">
                    <div><strong>Site Type:</strong> {selectedInstallation.location.siteType}</div>
                    <div><strong>Access Requirements:</strong> {selectedInstallation.location.accessRequirements}</div>
                    <div><strong>Parking:</strong> {selectedInstallation.location.parkingAvailable ? 'Available' : 'Not Available'}</div>
                    <div><strong>Elevator Access:</strong> {selectedInstallation.location.elevatorAccess ? 'Yes' : 'No'}</div>
                    <div><strong>Special Access:</strong> {selectedInstallation.location.specialAccess}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Risk Factors</h3>
                  {selectedInstallation.riskFactors.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700">
                      {selectedInstallation.riskFactors.map((risk, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-yellow-500" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No specific risk factors identified</p>
                  )}
                </div>
              </div>

              {selectedInstallation.notes && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedInstallation.notes}</p>
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

export default PendingInstallationsPage;