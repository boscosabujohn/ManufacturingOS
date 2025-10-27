'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Users, Star, TrendingUp, Calendar, MapPin, CheckCircle, Award, BarChart3, Download } from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  employeeId: string;
  region: string;
  experience: number; // in years
  rating: number;
  totalServices: number;
  ftfCount: number;
  avgResolutionTime: number; // in minutes
  completionRate: number; // percentage
  specializations: string[];
  certifications: string[];
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave';
}

const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'Amit Kumar',
    employeeId: 'TEC-001',
    region: 'Mumbai',
    experience: 8,
    rating: 4.8,
    totalServices: 245,
    ftfCount: 198,
    avgResolutionTime: 48,
    completionRate: 98,
    specializations: ['Washing Machine', 'Refrigerator', 'AC'],
    certifications: ['LG Service Center', 'Samsung Expert', 'IEC Certified'],
    joiningDate: '2017-03-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    employeeId: 'TEC-002',
    region: 'Pune',
    experience: 6,
    rating: 4.6,
    totalServices: 189,
    ftfCount: 165,
    avgResolutionTime: 52,
    completionRate: 95,
    specializations: ['Dishwasher', 'Microwave', 'Water Heater'],
    certifications: ['Bosch Certified', 'IFB Expert', 'Safety Certified'],
    joiningDate: '2019-06-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Rajesh Patel',
    employeeId: 'TEC-003',
    region: 'Mumbai',
    experience: 10,
    rating: 4.9,
    totalServices: 312,
    ftfCount: 289,
    avgResolutionTime: 45,
    completionRate: 99,
    specializations: ['AC', 'Refrigerator', 'Heating Systems'],
    certifications: ['Daikin Expert', 'Godrej Certified', 'Advanced Diagnostics'],
    joiningDate: '2015-01-10',
    status: 'active'
  },
  {
    id: '4',
    name: 'Vikram Singh',
    employeeId: 'TEC-004',
    region: 'Delhi',
    experience: 5,
    rating: 4.4,
    totalServices: 156,
    ftfCount: 129,
    avgResolutionTime: 58,
    completionRate: 92,
    specializations: ['Washing Machine', 'Microwave', 'Cooktop'],
    certifications: ['Wipro Certified', 'Electrolux Expert'],
    joiningDate: '2020-02-28',
    status: 'active'
  },
  {
    id: '5',
    name: 'Neha Desai',
    employeeId: 'TEC-005',
    region: 'Bangalore',
    experience: 7,
    rating: 4.7,
    totalServices: 218,
    ftfCount: 195,
    avgResolutionTime: 50,
    completionRate: 97,
    specializations: ['Refrigerator', 'Freezer', 'Water Purifier'],
    certifications: ['Videocon Certified', 'IEC Expert', 'Environmental Safety'],
    joiningDate: '2018-05-12',
    status: 'active'
  },
  {
    id: '6',
    name: 'Sanjay Verma',
    employeeId: 'TEC-006',
    region: 'Chennai',
    experience: 9,
    rating: 4.5,
    totalServices: 267,
    ftfCount: 223,
    avgResolutionTime: 54,
    completionRate: 94,
    specializations: ['AC', 'Washing Machine', 'Geyser'],
    certifications: ['Carrier Expert', 'Kuvera Certified', 'Energy Audit'],
    joiningDate: '2016-08-22',
    status: 'active'
  },
  {
    id: '7',
    name: 'Ananya Sharma',
    employeeId: 'TEC-007',
    region: 'Ahmedabad',
    experience: 4,
    rating: 4.3,
    totalServices: 98,
    ftfCount: 78,
    avgResolutionTime: 62,
    completionRate: 88,
    specializations: ['Microwave', 'Chimney', 'Water Heater'],
    certifications: ['Havells Expert', 'Safety Certified'],
    joiningDate: '2021-09-15',
    status: 'on-leave'
  },
  {
    id: '8',
    name: 'Ravi Kumar',
    employeeId: 'TEC-008',
    region: 'Hyderabad',
    experience: 6,
    rating: 4.6,
    totalServices: 201,
    ftfCount: 172,
    avgResolutionTime: 51,
    completionRate: 96,
    specializations: ['Refrigerator', 'AC', 'Dishwasher'],
    certifications: ['LG Expert', 'Whirlpool Certified'],
    joiningDate: '2019-11-01',
    status: 'active'
  },
  {
    id: '9',
    name: 'Rakesh Singh',
    employeeId: 'TEC-009',
    region: 'Kolkata',
    experience: 8,
    rating: 4.7,
    totalServices: 234,
    ftfCount: 201,
    avgResolutionTime: 49,
    completionRate: 97,
    specializations: ['Water Heater', 'Cooktop', 'Refrigerator'],
    certifications: ['AO Smith Expert', 'Bajaj Certified', 'Thermal Expert'],
    joiningDate: '2017-07-18',
    status: 'active'
  },
  {
    id: '10',
    name: 'Priyanka Verma',
    employeeId: 'TEC-010',
    region: 'Lucknow',
    experience: 5,
    rating: 4.5,
    totalServices: 167,
    ftfCount: 138,
    avgResolutionTime: 56,
    completionRate: 93,
    specializations: ['Washing Machine', 'Refrigerator', 'Microwave'],
    certifications: ['Godrej Expert', 'Safety Certified'],
    joiningDate: '2020-05-10',
    status: 'active'
  }
];

export default function TechniciansAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [sortBy, setSortBy] = useState<'rating' | 'ftfRate' | 'services' | 'experience'>('rating');

  const regions = ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Chennai', 'Ahmedabad', 'Hyderabad', 'Kolkata', 'Lucknow'];

  const filteredTechnicians = useMemo(() => {
    let filtered = mockTechnicians.filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || tech.region === selectedRegion;
      const matchesStatus = tech.status === selectedStatus;
      return matchesSearch && matchesRegion && matchesStatus;
    });

    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'ftfRate') {
      filtered.sort((a, b) => {
        const ftfRateA = (a.ftfCount / a.totalServices) * 100;
        const ftfRateB = (b.ftfCount / b.totalServices) * 100;
        return ftfRateB - ftfRateA;
      });
    } else if (sortBy === 'services') {
      filtered.sort((a, b) => b.totalServices - a.totalServices);
    } else {
      filtered.sort((a, b) => b.experience - a.experience);
    }

    return filtered;
  }, [searchTerm, selectedRegion, selectedStatus, sortBy]);

  const stats = {
    total: mockTechnicians.filter(t => t.status === 'active').length,
    avgRating: (mockTechnicians.filter(t => t.status === 'active').reduce((sum, t) => sum + t.rating, 0) / mockTechnicians.filter(t => t.status === 'active').length).toFixed(2),
    totalServices: mockTechnicians.filter(t => t.status === 'active').reduce((sum, t) => sum + t.totalServices, 0),
    totalFTF: mockTechnicians.filter(t => t.status === 'active').reduce((sum, t) => sum + t.ftfCount, 0),
    topPerformer: mockTechnicians.filter(t => t.status === 'active').reduce((best, current) => (current.rating > best.rating ? current : best)),
    avgCompletionRate: (mockTechnicians.filter(t => t.status === 'active').reduce((sum, t) => sum + t.completionRate, 0) / mockTechnicians.filter(t => t.status === 'active').length).toFixed(1)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'on-leave': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.7) return 'text-emerald-600';
    if (rating >= 4.5) return 'text-blue-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-emerald-600" />
              Technician Performance Analytics
            </h1>
            <p className="text-gray-600 mt-1">Monitor technician metrics, ratings, and service history</p>
          </div>
          <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
            <Download className="h-5 w-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Technicians</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className={`text-3xl font-bold mt-2 ${getRatingColor(parseFloat(stats.avgRating))}`}>{stats.avgRating}/5</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.totalServices}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">FTF Count</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalFTF}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">{((stats.totalFTF / stats.totalServices) * 100).toFixed(1)}% Success</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performer */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 mb-6 shadow-md text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Top Performer</p>
            <h3 className="text-2xl font-bold mt-2">{stats.topPerformer.name}</h3>
            <p className="text-sm opacity-90 mt-1">{stats.topPerformer.region} • {stats.topPerformer.experience} years experience</p>
            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-xs opacity-75">Rating</p>
                <p className="text-xl font-bold">{stats.topPerformer.rating}/5</p>
              </div>
              <div>
                <p className="text-xs opacity-75">Services</p>
                <p className="text-xl font-bold">{stats.topPerformer.totalServices}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">FTF Rate</p>
                <p className="text-xl font-bold">{((stats.topPerformer.ftfCount / stats.topPerformer.totalServices) * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
          <Award className="h-16 w-16 opacity-20" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="rating">Top Rating</option>
                <option value="ftfRate">Highest FTF %</option>
                <option value="services">Most Services</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>

            <div></div>

            <div className="flex items-end">
              <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnicians.map((tech) => {
          const ftfRate = ((tech.ftfCount / tech.totalServices) * 100).toFixed(1);
          return (
            <div key={tech.id} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{tech.name}</h3>
                  <p className="text-xs text-gray-600">{tech.employeeId}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(tech.status)}`}>
                  {tech.status.charAt(0).toUpperCase() + tech.status.slice(1).replace('-', ' ')}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(tech.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className={`font-bold ${getRatingColor(tech.rating)}`}>{tech.rating.toFixed(1)}</span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Services</span>
                  <span className="font-semibold text-gray-900">{tech.totalServices}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">FTF Rate</span>
                  <span className="font-semibold text-green-600">{ftfRate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg Resolution</span>
                  <span className="font-semibold text-gray-900">{tech.avgResolutionTime} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-blue-600">{tech.completionRate}%</span>
                </div>
              </div>

              {/* Location & Experience */}
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 pb-4 border-b">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {tech.region}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {tech.experience}y exp
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-1">
                  {tech.specializations.map((spec, idx) => (
                    <span key={idx} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Certifications</p>
                <div className="flex flex-wrap gap-1">
                  {tech.certifications.slice(0, 2).map((cert, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {cert}
                    </span>
                  ))}
                  {tech.certifications.length > 2 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      +{tech.certifications.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* View Details Button */}
              <button className="w-full mt-4 py-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {filteredTechnicians.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No technicians found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
