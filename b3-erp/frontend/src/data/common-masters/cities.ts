export interface City {
  id: string;
  code: string;
  name: string;
  stateCode: string;
  stateName: string;
  countryCode: string;
  countryName: string;
  tier?: 'Tier 1' | 'Tier 2' | 'Tier 3';
  isMetro: boolean;
  isActive: boolean;
  population?: number;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockCities: City[] = [
  // India - Maharashtra
  {
    id: '1',
    code: 'MUM',
    name: 'Mumbai',
    stateCode: 'MH',
    stateName: 'Maharashtra',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 20411000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    code: 'PUN',
    name: 'Pune',
    stateCode: 'MH',
    stateName: 'Maharashtra',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 1',
    isMetro: false,
    isActive: true,
    population: 6430000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:31:00Z',
    updatedAt: '2024-01-15T10:31:00Z'
  },
  {
    id: '3',
    code: 'NAG',
    name: 'Nagpur',
    stateCode: 'MH',
    stateName: 'Maharashtra',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 2523000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:32:00Z',
    updatedAt: '2024-01-15T10:32:00Z'
  },

  // India - Karnataka
  {
    id: '4',
    code: 'BLR',
    name: 'Bengaluru',
    stateCode: 'KA',
    stateName: 'Karnataka',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 12765000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:33:00Z',
    updatedAt: '2024-01-15T10:33:00Z'
  },
  {
    id: '5',
    code: 'MYS',
    name: 'Mysuru',
    stateCode: 'KA',
    stateName: 'Karnataka',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 1060000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:34:00Z',
    updatedAt: '2024-01-15T10:34:00Z'
  },

  // India - Tamil Nadu
  {
    id: '6',
    code: 'MAA',
    name: 'Chennai',
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 10456000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  },
  {
    id: '7',
    code: 'CBE',
    name: 'Coimbatore',
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 2151000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:36:00Z',
    updatedAt: '2024-01-15T10:36:00Z'
  },

  // India - Delhi
  {
    id: '8',
    code: 'DEL',
    name: 'New Delhi',
    stateCode: 'DL',
    stateName: 'Delhi',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 32941000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:37:00Z',
    updatedAt: '2024-01-15T10:37:00Z'
  },

  // India - Gujarat
  {
    id: '9',
    code: 'AMD',
    name: 'Ahmedabad',
    stateCode: 'GJ',
    stateName: 'Gujarat',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 1',
    isMetro: false,
    isActive: true,
    population: 8451000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:38:00Z',
    updatedAt: '2024-01-15T10:38:00Z'
  },
  {
    id: '10',
    code: 'SRT',
    name: 'Surat',
    stateCode: 'GJ',
    stateName: 'Gujarat',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 6564000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:39:00Z',
    updatedAt: '2024-01-15T10:39:00Z'
  },

  // India - West Bengal
  {
    id: '11',
    code: 'CCU',
    name: 'Kolkata',
    stateCode: 'WB',
    stateName: 'West Bengal',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 15134000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:40:00Z',
    updatedAt: '2024-01-15T10:40:00Z'
  },

  // India - Telangana
  {
    id: '12',
    code: 'HYD',
    name: 'Hyderabad',
    stateCode: 'TG',
    stateName: 'Telangana',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 10494000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:41:00Z',
    updatedAt: '2024-01-15T10:41:00Z'
  },

  // India - Kerala
  {
    id: '13',
    code: 'COK',
    name: 'Kochi',
    stateCode: 'KL',
    stateName: 'Kerala',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 2119000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:42:00Z',
    updatedAt: '2024-01-15T10:42:00Z'
  },
  {
    id: '14',
    code: 'TRV',
    name: 'Thiruvananthapuram',
    stateCode: 'KL',
    stateName: 'Kerala',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 1687000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:43:00Z',
    updatedAt: '2024-01-15T10:43:00Z'
  },

  // India - Punjab
  {
    id: '15',
    code: 'CHD',
    name: 'Chandigarh',
    stateCode: 'PB',
    stateName: 'Punjab',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 1055000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:44:00Z',
    updatedAt: '2024-01-15T10:44:00Z'
  },

  // India - Rajasthan
  {
    id: '16',
    code: 'JAI',
    name: 'Jaipur',
    stateCode: 'RJ',
    stateName: 'Rajasthan',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 3459000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-01-15T10:45:00Z'
  },

  // India - Uttar Pradesh
  {
    id: '17',
    code: 'LKO',
    name: 'Lucknow',
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 3382000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:46:00Z',
    updatedAt: '2024-01-15T10:46:00Z'
  },
  {
    id: '18',
    code: 'AGR',
    name: 'Agra',
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 1746000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:47:00Z',
    updatedAt: '2024-01-15T10:47:00Z'
  },

  // India - Goa
  {
    id: '19',
    code: 'GOI',
    name: 'Panaji',
    stateCode: 'GA',
    stateName: 'Goa',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 3',
    isMetro: false,
    isActive: true,
    population: 114000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:48:00Z',
    updatedAt: '2024-01-15T10:48:00Z'
  },

  // India - Madhya Pradesh
  {
    id: '20',
    code: 'BPL',
    name: 'Bhopal',
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 1883000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:49:00Z',
    updatedAt: '2024-01-15T10:49:00Z'
  },
  {
    id: '21',
    code: 'IDR',
    name: 'Indore',
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    countryCode: 'IN',
    countryName: 'India',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 2201000,
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15T10:50:00Z',
    updatedAt: '2024-01-15T10:50:00Z'
  },

  // USA
  {
    id: '22',
    code: 'NYC',
    name: 'New York City',
    stateCode: 'NY',
    stateName: 'New York',
    countryCode: 'US',
    countryName: 'United States',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 8336000,
    timezone: 'America/New_York',
    createdAt: '2024-01-15T10:51:00Z',
    updatedAt: '2024-01-15T10:51:00Z'
  },
  {
    id: '23',
    code: 'LAX',
    name: 'Los Angeles',
    stateCode: 'CA',
    stateName: 'California',
    countryCode: 'US',
    countryName: 'United States',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 3979000,
    timezone: 'America/Los_Angeles',
    createdAt: '2024-01-15T10:52:00Z',
    updatedAt: '2024-01-15T10:52:00Z'
  },
  {
    id: '24',
    code: 'SFO',
    name: 'San Francisco',
    stateCode: 'CA',
    stateName: 'California',
    countryCode: 'US',
    countryName: 'United States',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 873965,
    timezone: 'America/Los_Angeles',
    createdAt: '2024-01-15T10:53:00Z',
    updatedAt: '2024-01-15T10:53:00Z'
  },
  {
    id: '25',
    code: 'CHI',
    name: 'Chicago',
    stateCode: 'IL',
    stateName: 'Illinois',
    countryCode: 'US',
    countryName: 'United States',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 2716000,
    timezone: 'America/Chicago',
    createdAt: '2024-01-15T10:54:00Z',
    updatedAt: '2024-01-15T10:54:00Z'
  },

  // UK
  {
    id: '26',
    code: 'LON',
    name: 'London',
    stateCode: 'ENG',
    stateName: 'England',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 9002000,
    timezone: 'Europe/London',
    createdAt: '2024-01-15T10:55:00Z',
    updatedAt: '2024-01-15T10:55:00Z'
  },
  {
    id: '27',
    code: 'MAN',
    name: 'Manchester',
    stateCode: 'ENG',
    stateName: 'England',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    tier: 'Tier 2',
    isMetro: false,
    isActive: true,
    population: 2730000,
    timezone: 'Europe/London',
    createdAt: '2024-01-15T10:56:00Z',
    updatedAt: '2024-01-15T10:56:00Z'
  },

  // UAE
  {
    id: '28',
    code: 'DXB',
    name: 'Dubai',
    stateCode: 'DXB',
    stateName: 'Dubai',
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 3552000,
    timezone: 'Asia/Dubai',
    createdAt: '2024-01-15T10:57:00Z',
    updatedAt: '2024-01-15T10:57:00Z'
  },
  {
    id: '29',
    code: 'AUH',
    name: 'Abu Dhabi',
    stateCode: 'AUH',
    stateName: 'Abu Dhabi',
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 1482000,
    timezone: 'Asia/Dubai',
    createdAt: '2024-01-15T10:58:00Z',
    updatedAt: '2024-01-15T10:58:00Z'
  },

  // Singapore
  {
    id: '30',
    code: 'SIN',
    name: 'Singapore',
    stateCode: 'SG',
    stateName: 'Singapore',
    countryCode: 'SG',
    countryName: 'Singapore',
    tier: 'Tier 1',
    isMetro: true,
    isActive: true,
    population: 5454000,
    timezone: 'Asia/Singapore',
    createdAt: '2024-01-15T10:59:00Z',
    updatedAt: '2024-01-15T10:59:00Z'
  }
];
