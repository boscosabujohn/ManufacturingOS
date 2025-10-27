export interface DocumentType {
  id: string;
  typeCode: string;
  typeName: string;
  category: 'identity' | 'address' | 'educational' | 'employment' | 'financial' | 'medical' | 'legal' | 'other';
  description: string;

  // Requirements
  isMandatory: boolean;
  isVerificationRequired: boolean;
  validityPeriod?: number; // in months, null = no expiry
  renewalRequired: boolean;

  // Storage & Format
  allowedFormats: string[];
  maxFileSizeMB: number;
  multipleFilesAllowed: boolean;
  encryptionRequired: boolean;

  // Applicability
  applicableFor: 'employee' | 'candidate' | 'contractor' | 'dependent' | 'all';
  requiredForJoining: boolean;
  requiredForPayroll: boolean;

  // Usage
  documentsCount: number;
  pendingVerification: number;
  expiringIn30Days: number;

  isActive: boolean;
  createdBy: string;
  createdDate: string;
}

export const mockDocumentTypes: DocumentType[] = [
  {
    id: 'DT001',
    typeCode: 'AADHAAR',
    typeName: 'Aadhaar Card',
    category: 'identity',
    description: 'Unique Identification Number issued by UIDAI',
    isMandatory: true,
    isVerificationRequired: true,
    validityPeriod: undefined,
    renewalRequired: false,
    allowedFormats: ['pdf', 'jpg', 'png'],
    maxFileSizeMB: 2,
    multipleFilesAllowed: false,
    encryptionRequired: true,
    applicableFor: 'all',
    requiredForJoining: true,
    requiredForPayroll: true,
    documentsCount: 145,
    pendingVerification: 3,
    expiringIn30Days: 0,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01'
  },
  {
    id: 'DT002',
    typeCode: 'PAN',
    typeName: 'PAN Card',
    category: 'financial',
    description: 'Permanent Account Number for tax purposes',
    isMandatory: true,
    isVerificationRequired: true,
    validityPeriod: undefined,
    renewalRequired: false,
    allowedFormats: ['pdf', 'jpg', 'png'],
    maxFileSizeMB: 2,
    multipleFilesAllowed: false,
    encryptionRequired: true,
    applicableFor: 'all',
    requiredForJoining: true,
    requiredForPayroll: true,
    documentsCount: 145,
    pendingVerification: 2,
    expiringIn30Days: 0,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01'
  },
  {
    id: 'DT003',
    typeCode: 'PASSPORT',
    typeName: 'Passport',
    category: 'identity',
    description: 'Government issued passport',
    isMandatory: false,
    isVerificationRequired: true,
    validityPeriod: 120,
    renewalRequired: true,
    allowedFormats: ['pdf', 'jpg', 'png'],
    maxFileSizeMB: 3,
    multipleFilesAllowed: false,
    encryptionRequired: true,
    applicableFor: 'all',
    requiredForJoining: false,
    requiredForPayroll: false,
    documentsCount: 42,
    pendingVerification: 1,
    expiringIn30Days: 3,
    isActive: true,
    createdBy: 'HR Manager',
    createdDate: '2024-01-15'
  },
  {
    id: 'DT004',
    typeCode: 'DEGREE',
    typeName: 'Educational Degree',
    category: 'educational',
    description: 'Degree certificate from university/college',
    isMandatory: true,
    isVerificationRequired: true,
    validityPeriod: undefined,
    renewalRequired: false,
    allowedFormats: ['pdf', 'jpg', 'png'],
    maxFileSizeMB: 5,
    multipleFilesAllowed: true,
    encryptionRequired: false,
    applicableFor: 'all',
    requiredForJoining: true,
    requiredForPayroll: false,
    documentsCount: 156,
    pendingVerification: 5,
    expiringIn30Days: 0,
    isActive: true,
    createdBy: 'HR Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'DT005',
    typeCode: 'RELIEVING',
    typeName: 'Relieving Letter',
    category: 'employment',
    description: 'Relieving letter from previous employer',
    isMandatory: true,
    isVerificationRequired: true,
    validityPeriod: undefined,
    renewalRequired: false,
    allowedFormats: ['pdf'],
    maxFileSizeMB: 3,
    multipleFilesAllowed: true,
    encryptionRequired: false,
    applicableFor: 'employee',
    requiredForJoining: true,
    requiredForPayroll: false,
    documentsCount: 128,
    pendingVerification: 4,
    expiringIn30Days: 0,
    isActive: true,
    createdBy: 'HR Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'DT006',
    typeCode: 'BANK',
    typeName: 'Bank Account Details',
    category: 'financial',
    description: 'Cancelled cheque or bank passbook',
    isMandatory: true,
    isVerificationRequired: true,
    validityPeriod: 24,
    renewalRequired: true,
    allowedFormats: ['pdf', 'jpg', 'png'],
    maxFileSizeMB: 2,
    multipleFilesAllowed: false,
    encryptionRequired: true,
    applicableFor: 'all',
    requiredForJoining: true,
    requiredForPayroll: true,
    documentsCount: 145,
    pendingVerification: 2,
    expiringIn30Days: 8,
    isActive: true,
    createdBy: 'Admin',
    createdDate: '2024-01-01'
  },
  {
    id: 'DT007',
    typeCode: 'MEDICAL',
    typeName: 'Medical Fitness Certificate',
    category: 'medical',
    description: 'Medical fitness certificate from authorized doctor',
    isMandatory: true,
    isVerificationRequired: true,
    validityPeriod: 12,
    renewalRequired: true,
    allowedFormats: ['pdf'],
    maxFileSizeMB: 3,
    multipleFilesAllowed: false,
    encryptionRequired: true,
    applicableFor: 'all',
    requiredForJoining: true,
    requiredForPayroll: false,
    documentsCount: 142,
    pendingVerification: 6,
    expiringIn30Days: 12,
    isActive: true,
    createdBy: 'HR Manager',
    createdDate: '2024-01-01'
  },
  {
    id: 'DT008',
    typeCode: 'POLICE',
    typeName: 'Police Verification',
    category: 'legal',
    description: 'Police verification certificate',
    isMandatory: false,
    isVerificationRequired: true,
    validityPeriod: 36,
    renewalRequired: true,
    allowedFormats: ['pdf'],
    maxFileSizeMB: 2,
    multipleFilesAllowed: false,
    encryptionRequired: true,
    applicableFor: 'employee',
    requiredForJoining: false,
    requiredForPayroll: false,
    documentsCount: 85,
    pendingVerification: 8,
    expiringIn30Days: 4,
    isActive: true,
    createdBy: 'HR Manager',
    createdDate: '2024-02-01'
  }
];

export function getDocumentTypeStats() {
  return {
    total: mockDocumentTypes.length,
    active: mockDocumentTypes.filter(d => d.isActive).length,
    mandatory: mockDocumentTypes.filter(d => d.isMandatory).length,
    requiredForJoining: mockDocumentTypes.filter(d => d.requiredForJoining).length,
    totalDocuments: mockDocumentTypes.reduce((sum, d) => sum + d.documentsCount, 0),
    pendingVerification: mockDocumentTypes.reduce((sum, d) => sum + d.pendingVerification, 0),
    expiringIn30Days: mockDocumentTypes.reduce((sum, d) => sum + d.expiringIn30Days, 0),
    byCategory: {
      identity: mockDocumentTypes.filter(d => d.category === 'identity').length,
      financial: mockDocumentTypes.filter(d => d.category === 'financial').length,
      educational: mockDocumentTypes.filter(d => d.category === 'educational').length,
      employment: mockDocumentTypes.filter(d => d.category === 'employment').length,
      medical: mockDocumentTypes.filter(d => d.category === 'medical').length
    }
  };
}
