export interface Designation {
  id: string;
  code: string;
  name: string;
  level: number;
  grade: string;
  department: string;
  parentDesignation?: string;
  reportingTo?: string;
  isActive: boolean;
  minSalary?: number;
  maxSalary?: number;
  headCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const mockDesignations: Designation[] = [
  // C-Level
  {
    id: '1',
    code: 'CEO',
    name: 'Chief Executive Officer',
    level: 1,
    grade: 'C1',
    department: 'Executive',
    isActive: true,
    minSalary: 5000000,
    maxSalary: 10000000,
    headCount: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    code: 'CFO',
    name: 'Chief Financial Officer',
    level: 1,
    grade: 'C1',
    department: 'Finance',
    reportingTo: 'Chief Executive Officer',
    isActive: true,
    minSalary: 3000000,
    maxSalary: 6000000,
    headCount: 1,
    createdAt: '2024-01-15T10:31:00Z',
    updatedAt: '2024-01-15T10:31:00Z'
  },
  {
    id: '3',
    code: 'CTO',
    name: 'Chief Technology Officer',
    level: 1,
    grade: 'C1',
    department: 'Technology',
    reportingTo: 'Chief Executive Officer',
    isActive: true,
    minSalary: 3000000,
    maxSalary: 6000000,
    headCount: 1,
    createdAt: '2024-01-15T10:32:00Z',
    updatedAt: '2024-01-15T10:32:00Z'
  },
  {
    id: '4',
    code: 'COO',
    name: 'Chief Operating Officer',
    level: 1,
    grade: 'C1',
    department: 'Operations',
    reportingTo: 'Chief Executive Officer',
    isActive: true,
    minSalary: 3000000,
    maxSalary: 6000000,
    headCount: 1,
    createdAt: '2024-01-15T10:33:00Z',
    updatedAt: '2024-01-15T10:33:00Z'
  },

  // VP Level
  {
    id: '5',
    code: 'VPENG',
    name: 'Vice President - Engineering',
    level: 2,
    grade: 'VP1',
    department: 'Technology',
    reportingTo: 'Chief Technology Officer',
    isActive: true,
    minSalary: 2000000,
    maxSalary: 4000000,
    headCount: 2,
    createdAt: '2024-01-15T10:34:00Z',
    updatedAt: '2024-01-15T10:34:00Z'
  },
  {
    id: '6',
    code: 'VPSALES',
    name: 'Vice President - Sales',
    level: 2,
    grade: 'VP1',
    department: 'Sales',
    reportingTo: 'Chief Executive Officer',
    isActive: true,
    minSalary: 2000000,
    maxSalary: 4000000,
    headCount: 1,
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  },

  // Director Level
  {
    id: '7',
    code: 'DIR-ENG',
    name: 'Director - Engineering',
    level: 3,
    grade: 'D1',
    department: 'Technology',
    reportingTo: 'Vice President - Engineering',
    isActive: true,
    minSalary: 1500000,
    maxSalary: 2500000,
    headCount: 4,
    createdAt: '2024-01-15T10:36:00Z',
    updatedAt: '2024-01-15T10:36:00Z'
  },
  {
    id: '8',
    code: 'DIR-FIN',
    name: 'Director - Finance',
    level: 3,
    grade: 'D1',
    department: 'Finance',
    reportingTo: 'Chief Financial Officer',
    isActive: true,
    minSalary: 1500000,
    maxSalary: 2500000,
    headCount: 1,
    createdAt: '2024-01-15T10:37:00Z',
    updatedAt: '2024-01-15T10:37:00Z'
  },
  {
    id: '9',
    code: 'DIR-HR',
    name: 'Director - Human Resources',
    level: 3,
    grade: 'D1',
    department: 'HR',
    reportingTo: 'Chief Executive Officer',
    isActive: true,
    minSalary: 1200000,
    maxSalary: 2000000,
    headCount: 1,
    createdAt: '2024-01-15T10:38:00Z',
    updatedAt: '2024-01-15T10:38:00Z'
  },

  // Manager Level
  {
    id: '10',
    code: 'MGR-ENG',
    name: 'Engineering Manager',
    level: 4,
    grade: 'M1',
    department: 'Technology',
    reportingTo: 'Director - Engineering',
    isActive: true,
    minSalary: 1000000,
    maxSalary: 1800000,
    headCount: 10,
    createdAt: '2024-01-15T10:39:00Z',
    updatedAt: '2024-01-15T10:39:00Z'
  },
  {
    id: '11',
    code: 'MGR-SALES',
    name: 'Sales Manager',
    level: 4,
    grade: 'M1',
    department: 'Sales',
    reportingTo: 'Vice President - Sales',
    isActive: true,
    minSalary: 800000,
    maxSalary: 1500000,
    headCount: 8,
    createdAt: '2024-01-15T10:40:00Z',
    updatedAt: '2024-01-15T10:40:00Z'
  },
  {
    id: '12',
    code: 'MGR-HR',
    name: 'HR Manager',
    level: 4,
    grade: 'M1',
    department: 'HR',
    reportingTo: 'Director - Human Resources',
    isActive: true,
    minSalary: 700000,
    maxSalary: 1200000,
    headCount: 3,
    createdAt: '2024-01-15T10:41:00Z',
    updatedAt: '2024-01-15T10:41:00Z'
  },

  // Team Lead Level
  {
    id: '13',
    code: 'TL-DEV',
    name: 'Development Team Lead',
    level: 5,
    grade: 'TL1',
    department: 'Technology',
    reportingTo: 'Engineering Manager',
    isActive: true,
    minSalary: 800000,
    maxSalary: 1400000,
    headCount: 15,
    createdAt: '2024-01-15T10:42:00Z',
    updatedAt: '2024-01-15T10:42:00Z'
  },
  {
    id: '14',
    code: 'TL-QA',
    name: 'QA Team Lead',
    level: 5,
    grade: 'TL1',
    department: 'Technology',
    reportingTo: 'Engineering Manager',
    isActive: true,
    minSalary: 700000,
    maxSalary: 1200000,
    headCount: 6,
    createdAt: '2024-01-15T10:43:00Z',
    updatedAt: '2024-01-15T10:43:00Z'
  },

  // Senior Level
  {
    id: '15',
    code: 'SR-DEV',
    name: 'Senior Software Developer',
    level: 6,
    grade: 'E3',
    department: 'Technology',
    reportingTo: 'Development Team Lead',
    isActive: true,
    minSalary: 600000,
    maxSalary: 1200000,
    headCount: 30,
    createdAt: '2024-01-15T10:44:00Z',
    updatedAt: '2024-01-15T10:44:00Z'
  },
  {
    id: '16',
    code: 'SR-QA',
    name: 'Senior QA Engineer',
    level: 6,
    grade: 'E3',
    department: 'Technology',
    reportingTo: 'QA Team Lead',
    isActive: true,
    minSalary: 500000,
    maxSalary: 1000000,
    headCount: 12,
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-01-15T10:45:00Z'
  },
  {
    id: '17',
    code: 'SR-ACC',
    name: 'Senior Accountant',
    level: 6,
    grade: 'E3',
    department: 'Finance',
    reportingTo: 'Director - Finance',
    isActive: true,
    minSalary: 500000,
    maxSalary: 900000,
    headCount: 5,
    createdAt: '2024-01-15T10:46:00Z',
    updatedAt: '2024-01-15T10:46:00Z'
  },

  // Mid Level
  {
    id: '18',
    code: 'DEV',
    name: 'Software Developer',
    level: 7,
    grade: 'E2',
    department: 'Technology',
    reportingTo: 'Development Team Lead',
    isActive: true,
    minSalary: 400000,
    maxSalary: 800000,
    headCount: 50,
    createdAt: '2024-01-15T10:47:00Z',
    updatedAt: '2024-01-15T10:47:00Z'
  },
  {
    id: '19',
    code: 'QA',
    name: 'QA Engineer',
    level: 7,
    grade: 'E2',
    department: 'Technology',
    reportingTo: 'QA Team Lead',
    isActive: true,
    minSalary: 350000,
    maxSalary: 700000,
    headCount: 20,
    createdAt: '2024-01-15T10:48:00Z',
    updatedAt: '2024-01-15T10:48:00Z'
  },
  {
    id: '20',
    code: 'ACC',
    name: 'Accountant',
    level: 7,
    grade: 'E2',
    department: 'Finance',
    reportingTo: 'Director - Finance',
    isActive: true,
    minSalary: 350000,
    maxSalary: 600000,
    headCount: 8,
    createdAt: '2024-01-15T10:49:00Z',
    updatedAt: '2024-01-15T10:49:00Z'
  },

  // Junior Level
  {
    id: '21',
    code: 'JR-DEV',
    name: 'Junior Developer',
    level: 8,
    grade: 'E1',
    department: 'Technology',
    reportingTo: 'Development Team Lead',
    isActive: true,
    minSalary: 250000,
    maxSalary: 500000,
    headCount: 30,
    createdAt: '2024-01-15T10:50:00Z',
    updatedAt: '2024-01-15T10:50:00Z'
  },
  {
    id: '22',
    code: 'INTERN',
    name: 'Intern',
    level: 9,
    grade: 'I1',
    department: 'Various',
    isActive: true,
    minSalary: 100000,
    maxSalary: 200000,
    headCount: 20,
    createdAt: '2024-01-15T10:51:00Z',
    updatedAt: '2024-01-15T10:51:00Z'
  },

  // Support Staff
  {
    id: '23',
    code: 'ADMIN',
    name: 'Administrative Assistant',
    level: 7,
    grade: 'S1',
    department: 'Administration',
    isActive: true,
    minSalary: 200000,
    maxSalary: 400000,
    headCount: 10,
    createdAt: '2024-01-15T10:52:00Z',
    updatedAt: '2024-01-15T10:52:00Z'
  },
  {
    id: '24',
    code: 'RECEP',
    name: 'Receptionist',
    level: 8,
    grade: 'S2',
    department: 'Administration',
    isActive: true,
    minSalary: 150000,
    maxSalary: 300000,
    headCount: 5,
    createdAt: '2024-01-15T10:53:00Z',
    updatedAt: '2024-01-15T10:53:00Z'
  },
  {
    id: '25',
    code: 'DRIVER',
    name: 'Driver',
    level: 8,
    grade: 'S2',
    department: 'Administration',
    isActive: true,
    minSalary: 180000,
    maxSalary: 300000,
    headCount: 8,
    createdAt: '2024-01-15T10:54:00Z',
    updatedAt: '2024-01-15T10:54:00Z'
  }
];
