export interface Holiday {
  id: string;
  holidayCode: string;
  holidayName: string;
  date: string;
  holidayType: 'national' | 'regional' | 'festival' | 'restricted' | 'company';
  category: 'mandatory' | 'optional' | 'restricted';
  applicableLocations: string[];
  applicableFor: 'all' | 'office' | 'factory' | 'specific';
  description: string;
  isRecurring: boolean;
  year: number;
  dayOfWeek: string;
  isActive: boolean;
  notes?: string;
}

export const mockHolidays: Holiday[] = [
  {
    id: '1',
    holidayCode: 'NAT-2025-001',
    holidayName: 'Republic Day',
    date: '2025-01-26',
    holidayType: 'national',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Republic Day of India - National Holiday',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Sunday',
    isActive: true,
    notes: 'Celebrates the adoption of Constitution of India'
  },
  {
    id: '2',
    holidayCode: 'REG-2025-001',
    holidayName: 'Maharashtra Day',
    date: '2025-05-01',
    holidayType: 'regional',
    category: 'mandatory',
    applicableLocations: ['Maharashtra'],
    applicableFor: 'all',
    description: 'Maharashtra Day - State Formation Day',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Thursday',
    isActive: true,
    notes: 'Applicable to Maharashtra locations only'
  },
  {
    id: '3',
    holidayCode: 'NAT-2025-002',
    holidayName: 'Independence Day',
    date: '2025-08-15',
    holidayType: 'national',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Independence Day of India - National Holiday',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Friday',
    isActive: true,
    notes: 'Celebrates independence from British rule in 1947'
  },
  {
    id: '4',
    holidayCode: 'NAT-2025-003',
    holidayName: 'Mahatma Gandhi Jayanti',
    date: '2025-10-02',
    holidayType: 'national',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Birth Anniversary of Mahatma Gandhi - National Holiday',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Thursday',
    isActive: true,
    notes: 'International Day of Non-Violence'
  },
  {
    id: '5',
    holidayCode: 'FEST-2025-001',
    holidayName: 'Holi',
    date: '2025-03-14',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Festival of Colors - Hindu Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Friday',
    isActive: true,
    notes: 'Date varies each year based on lunar calendar'
  },
  {
    id: '6',
    holidayCode: 'FEST-2025-002',
    holidayName: 'Eid-ul-Fitr',
    date: '2025-03-31',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Eid-ul-Fitr - Islamic Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Monday',
    isActive: true,
    notes: 'Tentative date - subject to moon sighting'
  },
  {
    id: '7',
    holidayCode: 'FEST-2025-003',
    holidayName: 'Good Friday',
    date: '2025-04-18',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Good Friday - Christian Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Friday',
    isActive: true,
    notes: 'Commemorates the crucifixion of Jesus Christ'
  },
  {
    id: '8',
    holidayCode: 'FEST-2025-004',
    holidayName: 'Buddha Purnima',
    date: '2025-05-12',
    holidayType: 'festival',
    category: 'restricted',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Buddha Purnima - Buddhist Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Monday',
    isActive: true,
    notes: 'Celebrates birth of Gautama Buddha'
  },
  {
    id: '9',
    holidayCode: 'FEST-2025-005',
    holidayName: 'Eid-ul-Adha (Bakrid)',
    date: '2025-06-07',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Eid-ul-Adha - Islamic Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Saturday',
    isActive: true,
    notes: 'Tentative date - subject to moon sighting'
  },
  {
    id: '10',
    holidayCode: 'FEST-2025-006',
    holidayName: 'Janmashtami',
    date: '2025-08-16',
    holidayType: 'festival',
    category: 'restricted',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Krishna Janmashtami - Hindu Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Saturday',
    isActive: true,
    notes: 'Celebrates birth of Lord Krishna'
  },
  {
    id: '11',
    holidayCode: 'FEST-2025-007',
    holidayName: 'Ganesh Chaturthi',
    date: '2025-08-27',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['Maharashtra', 'Karnataka'],
    applicableFor: 'all',
    description: 'Ganesh Chaturthi - Hindu Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Wednesday',
    isActive: true,
    notes: 'Major festival in Maharashtra'
  },
  {
    id: '12',
    holidayCode: 'FEST-2025-008',
    holidayName: 'Dussehra',
    date: '2025-10-02',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Dussehra (Vijaya Dashami) - Hindu Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Thursday',
    isActive: true,
    notes: 'Victory of good over evil'
  },
  {
    id: '13',
    holidayCode: 'FEST-2025-009',
    holidayName: 'Diwali',
    date: '2025-10-20',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Diwali - Festival of Lights',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Monday',
    isActive: true,
    notes: 'Most celebrated festival in India'
  },
  {
    id: '14',
    holidayCode: 'FEST-2025-010',
    holidayName: 'Diwali (Day 2)',
    date: '2025-10-21',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Diwali Day 2 - Festival of Lights',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Tuesday',
    isActive: true,
    notes: 'Second day of Diwali celebrations'
  },
  {
    id: '15',
    holidayCode: 'FEST-2025-011',
    holidayName: 'Guru Nanak Jayanti',
    date: '2025-11-05',
    holidayType: 'festival',
    category: 'restricted',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Guru Nanak Jayanti - Sikh Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Wednesday',
    isActive: true,
    notes: 'Birth anniversary of Guru Nanak Dev Ji'
  },
  {
    id: '16',
    holidayCode: 'FEST-2025-012',
    holidayName: 'Christmas',
    date: '2025-12-25',
    holidayType: 'festival',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Christmas - Christian Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Thursday',
    isActive: true,
    notes: 'Celebrates birth of Jesus Christ'
  },
  {
    id: '17',
    holidayCode: 'COMP-2025-001',
    holidayName: 'Company Foundation Day',
    date: '2025-01-15',
    holidayType: 'company',
    category: 'mandatory',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Company Foundation Day Anniversary',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Wednesday',
    isActive: true,
    notes: 'Celebrates company establishment in 2015'
  },
  {
    id: '18',
    holidayCode: 'REST-2025-001',
    holidayName: 'Mahavir Jayanti',
    date: '2025-04-10',
    holidayType: 'festival',
    category: 'restricted',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Mahavir Jayanti - Jain Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Thursday',
    isActive: true,
    notes: 'Birth anniversary of Lord Mahavira'
  },
  {
    id: '19',
    holidayCode: 'REST-2025-002',
    holidayName: 'Muharram',
    date: '2025-07-06',
    holidayType: 'festival',
    category: 'restricted',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Muharram - Islamic Observance',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Sunday',
    isActive: true,
    notes: 'Tentative date - Islamic New Year'
  },
  {
    id: '20',
    holidayCode: 'REST-2025-003',
    holidayName: 'Raksha Bandhan',
    date: '2025-08-09',
    holidayType: 'festival',
    category: 'restricted',
    applicableLocations: ['All India'],
    applicableFor: 'all',
    description: 'Raksha Bandhan - Hindu Festival',
    isRecurring: true,
    year: 2025,
    dayOfWeek: 'Saturday',
    isActive: true,
    notes: 'Celebrates bond between brothers and sisters'
  }
];

// Helper function to get holidays for a specific month
export function getHolidaysByMonth(month: number, year: number): Holiday[] {
  return mockHolidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getMonth() + 1 === month && holidayDate.getFullYear() === year;
  });
}

// Helper function to get upcoming holidays
export function getUpcomingHolidays(count: number = 5): Holiday[] {
  const today = new Date();
  return mockHolidays
    .filter(holiday => new Date(holiday.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
}

// Helper function to count holidays by type
export function getHolidayStats() {
  return {
    total: mockHolidays.length,
    national: mockHolidays.filter(h => h.holidayType === 'national').length,
    regional: mockHolidays.filter(h => h.holidayType === 'regional').length,
    festival: mockHolidays.filter(h => h.holidayType === 'festival').length,
    mandatory: mockHolidays.filter(h => h.category === 'mandatory').length,
    restricted: mockHolidays.filter(h => h.category === 'restricted').length
  };
}
