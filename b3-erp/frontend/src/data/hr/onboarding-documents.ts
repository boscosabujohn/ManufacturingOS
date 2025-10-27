export interface OnboardingCandidate {
  id: string;
  candidateName: string;
  employeeCode: string;
  designation: string;
  department: string;
  joiningDate: string;
  offerAcceptedDate: string;
  email: string;
  phone: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  documentsSubmitted: number;
  documentsTotal: number;
  completionPercentage: number;
  verificationStatus: 'not_started' | 'in_progress' | 'completed' | 'issues_found';
  assignedHR: string;
}

export interface DocumentRequirement {
  id: string;
  docType: string;
  category: 'identity' | 'address' | 'education' | 'employment' | 'tax' | 'bank' | 'medical' | 'other';
  isMandatory: boolean;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  submittedDate?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  fileName?: string;
  fileSize?: string;
}

export const mockCandidates: OnboardingCandidate[] = [
  {
    id: '1',
    candidateName: 'Rajesh Kumar',
    employeeCode: 'EMP2025001',
    designation: 'Production Supervisor',
    department: 'Production',
    joiningDate: '2025-11-05',
    offerAcceptedDate: '2025-10-20',
    email: 'rajesh.kumar@kitchen.com',
    phone: '+91 98765 43210',
    status: 'in_progress',
    documentsSubmitted: 8,
    documentsTotal: 12,
    completionPercentage: 67,
    verificationStatus: 'in_progress',
    assignedHR: 'Priya Sharma'
  },
  {
    id: '2',
    candidateName: 'Sneha Patel',
    employeeCode: 'EMP2025002',
    designation: 'Quality Inspector',
    department: 'Quality Control',
    joiningDate: '2025-11-08',
    offerAcceptedDate: '2025-10-22',
    email: 'sneha.patel@kitchen.com',
    phone: '+91 98765 43211',
    status: 'completed',
    documentsSubmitted: 12,
    documentsTotal: 12,
    completionPercentage: 100,
    verificationStatus: 'completed',
    assignedHR: 'Priya Sharma'
  },
  {
    id: '3',
    candidateName: 'Amit Singh',
    employeeCode: 'EMP2025003',
    designation: 'Warehouse Executive',
    department: 'Warehouse',
    joiningDate: '2025-11-10',
    offerAcceptedDate: '2025-10-25',
    email: 'amit.singh@kitchen.com',
    phone: '+91 98765 43212',
    status: 'pending',
    documentsSubmitted: 3,
    documentsTotal: 12,
    completionPercentage: 25,
    verificationStatus: 'not_started',
    assignedHR: 'Rahul Verma'
  },
  {
    id: '4',
    candidateName: 'Neha Gupta',
    employeeCode: 'EMP2025004',
    designation: 'HR Executive',
    department: 'HR',
    joiningDate: '2025-11-01',
    offerAcceptedDate: '2025-10-15',
    email: 'neha.gupta@kitchen.com',
    phone: '+91 98765 43213',
    status: 'overdue',
    documentsSubmitted: 5,
    documentsTotal: 12,
    completionPercentage: 42,
    verificationStatus: 'issues_found',
    assignedHR: 'Priya Sharma'
  },
  {
    id: '5',
    candidateName: 'Vikram Rao',
    employeeCode: 'EMP2025005',
    designation: 'Machine Operator',
    department: 'Production',
    joiningDate: '2025-11-12',
    offerAcceptedDate: '2025-10-28',
    email: 'vikram.rao@kitchen.com',
    phone: '+91 98765 43214',
    status: 'pending',
    documentsSubmitted: 0,
    documentsTotal: 12,
    completionPercentage: 0,
    verificationStatus: 'not_started',
    assignedHR: 'Rahul Verma'
  }
];

export const documentCategories = [
  { id: 'identity', label: 'Identity Proof', icon: '🪪', color: 'blue' },
  { id: 'address', label: 'Address Proof', icon: '🏠', color: 'green' },
  { id: 'education', label: 'Educational Certificates', icon: '🎓', color: 'purple' },
  { id: 'employment', label: 'Previous Employment', icon: '💼', color: 'orange' },
  { id: 'tax', label: 'Tax Documents', icon: '📋', color: 'red' },
  { id: 'bank', label: 'Bank Details', icon: '🏦', color: 'indigo' },
  { id: 'medical', label: 'Medical Fitness', icon: '🏥', color: 'pink' },
  { id: 'other', label: 'Other Documents', icon: '📄', color: 'gray' }
];

export function getCandidateStats() {
  return {
    total: mockCandidates.length,
    pending: mockCandidates.filter(c => c.status === 'pending').length,
    inProgress: mockCandidates.filter(c => c.status === 'in_progress').length,
    completed: mockCandidates.filter(c => c.status === 'completed').length,
    overdue: mockCandidates.filter(c => c.status === 'overdue').length,
    avgCompletion: Math.round(mockCandidates.reduce((sum, c) => sum + c.completionPercentage, 0) / mockCandidates.length)
  };
}
