export interface State {
  id: string;
  code: string;
  name: string;
  countryCode: string;
  countryName: string;
  zone?: string;
  isUT: boolean;
  isActive: boolean;
  stateGSTCode?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockStates: State[] = [
  // India
  {
    id: '1',
    code: 'MH',
    name: 'Maharashtra',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'West',
    isUT: false,
    isActive: true,
    stateGSTCode: '27',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    code: 'KA',
    name: 'Karnataka',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'South',
    isUT: false,
    isActive: true,
    stateGSTCode: '29',
    createdAt: '2024-01-15T10:31:00Z',
    updatedAt: '2024-01-15T10:31:00Z'
  },
  {
    id: '3',
    code: 'TN',
    name: 'Tamil Nadu',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'South',
    isUT: false,
    isActive: true,
    stateGSTCode: '33',
    createdAt: '2024-01-15T10:32:00Z',
    updatedAt: '2024-01-15T10:32:00Z'
  },
  {
    id: '4',
    code: 'DL',
    name: 'Delhi',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'North',
    isUT: true,
    isActive: true,
    stateGSTCode: '07',
    createdAt: '2024-01-15T10:33:00Z',
    updatedAt: '2024-01-15T10:33:00Z'
  },
  {
    id: '5',
    code: 'GJ',
    name: 'Gujarat',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'West',
    isUT: false,
    isActive: true,
    stateGSTCode: '24',
    createdAt: '2024-01-15T10:34:00Z',
    updatedAt: '2024-01-15T10:34:00Z'
  },
  {
    id: '6',
    code: 'RJ',
    name: 'Rajasthan',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'North',
    isUT: false,
    isActive: true,
    stateGSTCode: '08',
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  },
  {
    id: '7',
    code: 'UP',
    name: 'Uttar Pradesh',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'North',
    isUT: false,
    isActive: true,
    stateGSTCode: '09',
    createdAt: '2024-01-15T10:36:00Z',
    updatedAt: '2024-01-15T10:36:00Z'
  },
  {
    id: '8',
    code: 'WB',
    name: 'West Bengal',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'East',
    isUT: false,
    isActive: true,
    stateGSTCode: '19',
    createdAt: '2024-01-15T10:37:00Z',
    updatedAt: '2024-01-15T10:37:00Z'
  },
  {
    id: '9',
    code: 'AP',
    name: 'Andhra Pradesh',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'South',
    isUT: false,
    isActive: true,
    stateGSTCode: '37',
    createdAt: '2024-01-15T10:38:00Z',
    updatedAt: '2024-01-15T10:38:00Z'
  },
  {
    id: '10',
    code: 'TG',
    name: 'Telangana',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'South',
    isUT: false,
    isActive: true,
    stateGSTCode: '36',
    createdAt: '2024-01-15T10:39:00Z',
    updatedAt: '2024-01-15T10:39:00Z'
  },
  {
    id: '11',
    code: 'PB',
    name: 'Punjab',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'North',
    isUT: false,
    isActive: true,
    stateGSTCode: '03',
    createdAt: '2024-01-15T10:40:00Z',
    updatedAt: '2024-01-15T10:40:00Z'
  },
  {
    id: '12',
    code: 'HR',
    name: 'Haryana',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'North',
    isUT: false,
    isActive: true,
    stateGSTCode: '06',
    createdAt: '2024-01-15T10:41:00Z',
    updatedAt: '2024-01-15T10:41:00Z'
  },
  {
    id: '13',
    code: 'KL',
    name: 'Kerala',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'South',
    isUT: false,
    isActive: true,
    stateGSTCode: '32',
    createdAt: '2024-01-15T10:42:00Z',
    updatedAt: '2024-01-15T10:42:00Z'
  },
  {
    id: '14',
    code: 'OR',
    name: 'Odisha',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'East',
    isUT: false,
    isActive: true,
    stateGSTCode: '21',
    createdAt: '2024-01-15T10:43:00Z',
    updatedAt: '2024-01-15T10:43:00Z'
  },
  {
    id: '15',
    code: 'AS',
    name: 'Assam',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'Northeast',
    isUT: false,
    isActive: true,
    stateGSTCode: '18',
    createdAt: '2024-01-15T10:44:00Z',
    updatedAt: '2024-01-15T10:44:00Z'
  },
  {
    id: '16',
    code: 'MP',
    name: 'Madhya Pradesh',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'Central',
    isUT: false,
    isActive: true,
    stateGSTCode: '23',
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-01-15T10:45:00Z'
  },
  {
    id: '17',
    code: 'BR',
    name: 'Bihar',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'East',
    isUT: false,
    isActive: true,
    stateGSTCode: '10',
    createdAt: '2024-01-15T10:46:00Z',
    updatedAt: '2024-01-15T10:46:00Z'
  },
  {
    id: '18',
    code: 'JK',
    name: 'Jammu and Kashmir',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'North',
    isUT: true,
    isActive: true,
    stateGSTCode: '01',
    createdAt: '2024-01-15T10:47:00Z',
    updatedAt: '2024-01-15T10:47:00Z'
  },
  {
    id: '19',
    code: 'GA',
    name: 'Goa',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'West',
    isUT: false,
    isActive: true,
    stateGSTCode: '30',
    createdAt: '2024-01-15T10:48:00Z',
    updatedAt: '2024-01-15T10:48:00Z'
  },
  {
    id: '20',
    code: 'CG',
    name: 'Chhattisgarh',
    countryCode: 'IN',
    countryName: 'India',
    zone: 'Central',
    isUT: false,
    isActive: true,
    stateGSTCode: '22',
    createdAt: '2024-01-15T10:49:00Z',
    updatedAt: '2024-01-15T10:49:00Z'
  },

  // USA
  {
    id: '21',
    code: 'CA',
    name: 'California',
    countryCode: 'US',
    countryName: 'United States',
    zone: 'West',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:50:00Z',
    updatedAt: '2024-01-15T10:50:00Z'
  },
  {
    id: '22',
    code: 'TX',
    name: 'Texas',
    countryCode: 'US',
    countryName: 'United States',
    zone: 'South',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:51:00Z',
    updatedAt: '2024-01-15T10:51:00Z'
  },
  {
    id: '23',
    code: 'NY',
    name: 'New York',
    countryCode: 'US',
    countryName: 'United States',
    zone: 'Northeast',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:52:00Z',
    updatedAt: '2024-01-15T10:52:00Z'
  },
  {
    id: '24',
    code: 'FL',
    name: 'Florida',
    countryCode: 'US',
    countryName: 'United States',
    zone: 'Southeast',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:53:00Z',
    updatedAt: '2024-01-15T10:53:00Z'
  },
  {
    id: '25',
    code: 'IL',
    name: 'Illinois',
    countryCode: 'US',
    countryName: 'United States',
    zone: 'Midwest',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:54:00Z',
    updatedAt: '2024-01-15T10:54:00Z'
  },

  // UK
  {
    id: '26',
    code: 'ENG',
    name: 'England',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:55:00Z',
    updatedAt: '2024-01-15T10:55:00Z'
  },
  {
    id: '27',
    code: 'SCT',
    name: 'Scotland',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:56:00Z',
    updatedAt: '2024-01-15T10:56:00Z'
  },
  {
    id: '28',
    code: 'WLS',
    name: 'Wales',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:57:00Z',
    updatedAt: '2024-01-15T10:57:00Z'
  },

  // UAE
  {
    id: '29',
    code: 'DXB',
    name: 'Dubai',
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:58:00Z',
    updatedAt: '2024-01-15T10:58:00Z'
  },
  {
    id: '30',
    code: 'AUH',
    name: 'Abu Dhabi',
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    isUT: false,
    isActive: true,
    createdAt: '2024-01-15T10:59:00Z',
    updatedAt: '2024-01-15T10:59:00Z'
  }
];
