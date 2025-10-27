'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, User, Users, Briefcase, Calendar, Mail, Phone, MapPin, TrendingUp, Download, ChevronLeft, ChevronRight, Award, Clock } from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  status: 'active' | 'on_leave' | 'inactive' | 'terminated';
  joinDate: string;
  manager: string;
  location: string;
  salary: number;
  performanceRating: number;
  leaveBalance: number;
}

const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    employeeId: 'B3-001',
    firstName: 'John',
    lastName: 'Anderson',
    email: 'john.anderson@b3macbis.com',
    phone: '+1 234-567-8901',
    department: 'Production',
    position: 'Production Manager',
    employmentType: 'full_time',
    status: 'active',
    joinDate: '2020-03-15',
    manager: 'Sarah Johnson',
    location: 'Factory - Building A',
    salary: 75000,
    performanceRating: 4.5,
    leaveBalance: 18,
  },
  {
    id: 'EMP-002',
    employeeId: 'B3-002',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@b3macbis.com',
    phone: '+1 234-567-8902',
    department: 'Engineering',
    position: 'Senior Design Engineer',
    employmentType: 'full_time',
    status: 'active',
    joinDate: '2019-07-20',
    manager: 'Michael Brown',
    location: 'Office - Floor 2',
    salary: 85000,
    performanceRating: 4.8,
    leaveBalance: 15,
  },
  {
    id: 'EMP-003',
    employeeId: 'B3-003',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@b3macbis.com',
    phone: '+1 234-567-8903',
    department: 'Sales',
    position: 'Sales Executive',
    employmentType: 'full_time',
    status: 'on_leave',
    joinDate: '2021-01-10',
    manager: 'Lisa Martinez',
    location: 'Office - Floor 1',
    salary: 65000,
    performanceRating: 4.2,
    leaveBalance: 8,
  },
  {
    id: 'EMP-004',
    employeeId: 'B3-004',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@b3macbis.com',
    phone: '+1 234-567-8904',
    department: 'Quality Control',
    position: 'QC Inspector',
    employmentType: 'full_time',
    status: 'active',
    joinDate: '2022-05-12',
    manager: 'John Anderson',
    location: 'Factory - QC Lab',
    salary: 55000,
    performanceRating: 4.6,
    leaveBalance: 20,
  },
  {
    id: 'EMP-005',
    employeeId: 'B3-005',
    firstName: 'David',
    lastName: 'Kumar',
    email: 'david.kumar@b3macbis.com',
    phone: '+1 234-567-8905',
    department: 'IT',
    position: 'Software Developer',
    employmentType: 'contract',
    status: 'active',
    joinDate: '2023-02-01',
    manager: 'Tech Lead',
    location: 'Remote',
    salary: 70000,
    performanceRating: 4.4,
    leaveBalance: 12,
  },
  {
    id: 'EMP-006',
    employeeId: 'B3-006',
    firstName: 'Jennifer',
    lastName: 'Taylor',
    email: 'jennifer.taylor@b3macbis.com',
    phone: '+1 234-567-8906',
    department: 'HR',
    position: 'HR Specialist',
    employmentType: 'full_time',
    status: 'active',
    joinDate: '2021-09-15',
    manager: 'HR Director',
    location: 'Office - Floor 3',
    salary: 60000,
    performanceRating: 4.7,
    leaveBalance: 16,
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  on_leave: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-700',
  terminated: 'bg-red-100 text-red-700',
};

const statusLabels = {
  active: 'Active',
  on_leave: 'On Leave',
  inactive: 'Inactive',
  terminated: 'Terminated',
};

const employmentTypeColors = {
  full_time: 'bg-blue-100 text-blue-700',
  part_time: 'bg-purple-100 text-purple-700',
  contract: 'bg-orange-100 text-orange-700',
  intern: 'bg-pink-100 text-pink-700',
};

const employmentTypeLabels = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  intern: 'Intern',
};

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  return 'text-orange-600';
};

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    onLeave: employees.filter((e) => e.status === 'on_leave').length,
    newThisMonth: employees.filter((e) => {
      const joinDate = new Date(e.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length,
  };

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Employees</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.activeEmployees}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">On Leave</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.onLeave}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">New This Month</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.newThisMonth}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/hr/employees/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, email, position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{emp.employeeId}</div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {emp.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {emp.email}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {emp.phone}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Joined: {emp.joinDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{emp.position}</div>
                    <div className="text-sm text-gray-600">{emp.department}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Reports to: {emp.manager}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${employmentTypeColors[emp.employmentType]}`}>
                      {employmentTypeLabels[emp.employmentType]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Award className={`h-5 w-5 ${getRatingColor(emp.performanceRating)} fill-current`} />
                      <span className={`text-lg font-bold ${getRatingColor(emp.performanceRating)}`}>
                        {emp.performanceRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Salary: ${(emp.salary / 1000).toFixed(0)}K
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-blue-900">{emp.leaveBalance} days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[emp.status]}`}>
                      {statusLabels[emp.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/hr/employees/view/${emp.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                       
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => router.push(`/hr/employees/edit/${emp.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                       
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                       
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of{' '}
            {filteredEmployees.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
