'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Plus, Search, Edit2, Trash2, Download, Upload,
  CheckCircle2, XCircle, AlertCircle, Mail, Phone, MapPin,
  Calendar, Briefcase, Award, DollarSign, User, Shield
} from 'lucide-react';

interface Employee {
  id: string;
  employeeCode: string;

  // Personal Information
  personal: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female' | 'Other';
    bloodGroup?: string;
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
    nationality: string;
  };

  // Contact Information
  contact: {
    email: string;
    phone: string;
    alternatePhone?: string;
    emergencyContact: string;
    emergencyRelation: string;
  };

  // Address
  address: {
    current: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pinCode: string;
      country: string;
    };
    permanent?: {
      line1: string;
      city: string;
      state: string;
      pinCode: string;
    };
  };

  // Employment Details
  employment: {
    dateOfJoining: Date;
    designationId: string;
    designation: string;
    departmentId: string;
    department: string;
    gradeId: string;
    grade: string;
    employeeType: 'Permanent' | 'Contract' | 'Temporary' | 'Intern';
    reportingManagerId?: string;
    reportingManager?: string;
    location: string;
    shiftId?: string;
  };

  // Compensation
  compensation: {
    basicSalary: number;
    currency: string;
    payrollCycle: 'Monthly' | 'Bi-Weekly' | 'Weekly';
    bankAccount: {
      accountNumber: string;
      bankName: string;
      ifscCode: string;
      branch: string;
    };
  };

  // Documents
  documents: {
    panNumber?: string;
    aadharNumber?: string;
    passportNumber?: string;
    drivingLicense?: string;
    pfNumber?: string;
    esiNumber?: string;
  };

  // System
  status: 'Active' | 'Inactive' | 'On Leave' | 'Resigned' | 'Terminated';
  photoUrl?: string;

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeCode: 'EMP001',
    personal: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Male',
      bloodGroup: 'O+',
      maritalStatus: 'Married',
      nationality: 'Indian'
    },
    contact: {
      email: 'rajesh.kumar@company.com',
      phone: '+91-9876543210',
      alternatePhone: '+91-9876543211',
      emergencyContact: '+91-9876543212',
      emergencyRelation: 'Spouse'
    },
    address: {
      current: {
        line1: '123, MG Road',
        line2: 'Near City Center',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001',
        country: 'India'
      }
    },
    employment: {
      dateOfJoining: new Date('2020-01-15'),
      designationId: 'DES001',
      designation: 'Senior Software Engineer',
      departmentId: 'DEPT001',
      department: 'Technology',
      gradeId: 'GRD003',
      grade: 'E3',
      employeeType: 'Permanent',
      reportingManagerId: 'EMP100',
      reportingManager: 'Amit Sharma',
      location: 'Mumbai Office',
      shiftId: 'SHIFT001'
    },
    compensation: {
      basicSalary: 80000,
      currency: 'INR',
      payrollCycle: 'Monthly',
      bankAccount: {
        accountNumber: '123456789012',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0001234',
        branch: 'MG Road'
      }
    },
    documents: {
      panNumber: 'ABCDE1234F',
      aadharNumber: '1234-5678-9012',
      pfNumber: 'MH/MUM/123456/001',
      esiNumber: '1234567890'
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2020-01-10'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'HR Admin',
      updatedBy: 'HR Manager'
    }
  },
  {
    id: '2',
    employeeCode: 'EMP002',
    personal: {
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: new Date('1992-08-22'),
      gender: 'Female',
      bloodGroup: 'A+',
      maritalStatus: 'Single',
      nationality: 'Indian'
    },
    contact: {
      email: 'priya.sharma@company.com',
      phone: '+91-9876543220',
      emergencyContact: '+91-9876543221',
      emergencyRelation: 'Father'
    },
    address: {
      current: {
        line1: '456, Brigade Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560001',
        country: 'India'
      }
    },
    employment: {
      dateOfJoining: new Date('2021-03-01'),
      designationId: 'DES002',
      designation: 'HR Manager',
      departmentId: 'DEPT002',
      department: 'Human Resources',
      gradeId: 'GRD004',
      grade: 'M1',
      employeeType: 'Permanent',
      reportingManagerId: 'EMP101',
      reportingManager: 'Sanjay Mehta',
      location: 'Bengaluru Office'
    },
    compensation: {
      basicSalary: 95000,
      currency: 'INR',
      payrollCycle: 'Monthly',
      bankAccount: {
        accountNumber: '987654321098',
        bankName: 'ICICI Bank',
        ifscCode: 'ICIC0001234',
        branch: 'Brigade Road'
      }
    },
    documents: {
      panNumber: 'FGHIJ5678K',
      aadharNumber: '9876-5432-1098'
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2021-02-25'),
      updatedAt: new Date('2024-03-18'),
      createdBy: 'HR Admin',
      updatedBy: 'HR Manager'
    }
  },
  {
    id: '3',
    employeeCode: 'EMP003',
    personal: {
      firstName: 'Amit',
      lastName: 'Patel',
      dateOfBirth: new Date('1988-12-10'),
      gender: 'Male',
      bloodGroup: 'B+',
      maritalStatus: 'Married',
      nationality: 'Indian'
    },
    contact: {
      email: 'amit.patel@company.com',
      phone: '+91-9876543230',
      emergencyContact: '+91-9876543231',
      emergencyRelation: 'Spouse'
    },
    address: {
      current: {
        line1: '789, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
        country: 'India'
      }
    },
    employment: {
      dateOfJoining: new Date('2019-06-01'),
      designationId: 'DES003',
      designation: 'Team Lead',
      departmentId: 'DEPT003',
      department: 'Sales',
      gradeId: 'GRD004',
      grade: 'M1',
      employeeType: 'Permanent',
      location: 'Delhi Office'
    },
    compensation: {
      basicSalary: 100000,
      currency: 'INR',
      payrollCycle: 'Monthly',
      bankAccount: {
        accountNumber: '456789123456',
        bankName: 'SBI',
        ifscCode: 'SBIN0001234',
        branch: 'CP Branch'
      }
    },
    documents: {
      panNumber: 'KLMNO9012P',
      aadharNumber: '4567-8901-2345'
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2019-05-25'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'HR Admin',
      updatedBy: 'HR Manager'
    }
  }
];

export default function EmployeeMaster() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentTab, setCurrentTab] = useState('personal');

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    setCurrentTab('personal');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'On Leave': { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
      'Resigned': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      'Terminated': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'Permanent': { bg: 'bg-green-100', text: 'text-green-800' },
      'Contract': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Temporary': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Intern': { bg: 'bg-purple-100', text: 'text-purple-800' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {type}
      </span>
    );
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const fullName = `${employee.personal.firstName} ${employee.personal.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                           employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'All' || employee.employment.department === filterDepartment;
      const matchesStatus = filterStatus === 'All' || employee.status === filterStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, filterDepartment, filterStatus]);

  const uniqueDepartments = Array.from(new Set(employees.map(e => e.employment.department)));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-600" />
          Employee Master
        </h2>
        <p className="text-gray-600">Manage employee personnel database</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{employees.length}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {employees.filter(e => e.status === 'Active').length}
              </p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Permanent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {employees.filter(e => e.employment.employeeType === 'Permanent').length}
              </p>
            </div>
            <Briefcase className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{uniqueDepartments.length}</p>
            </div>
            <Award className="h-12 w-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setIsModalOpen(true);
                  setCurrentTab('personal');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Employee
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.personal.firstName} {employee.personal.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.employeeCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-900">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">{employee.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">{employee.contact.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{employee.employment.designation}</div>
                      <div className="text-xs text-gray-500">Grade: {employee.employment.grade}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {employee.employment.department}
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(employee.employment.employeeType)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(employee.employment.dateOfJoining).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(employee.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
            </div>

            <div className="flex border-b border-gray-200 overflow-x-auto">
              {['personal', 'contact', 'address', 'employment', 'compensation', 'documents'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
                    currentTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {currentTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Code *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedEmployee?.employeeCode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedEmployee?.personal.firstName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedEmployee?.personal.lastName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        defaultValue={selectedEmployee?.personal.dateOfBirth.toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select defaultValue={selectedEmployee?.personal.gender}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Group
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedEmployee?.personal.bloodGroup}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marital Status
                      </label>
                      <select defaultValue={selectedEmployee?.personal.maritalStatus}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedEmployee?.personal.nationality}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'employment' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Joining *
                      </label>
                      <input
                        type="date"
                        defaultValue={selectedEmployee?.employment.dateOfJoining.toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Type *
                      </label>
                      <select defaultValue={selectedEmployee?.employment.employeeType}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      <select
                        defaultValue={selectedEmployee?.employment.departmentId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Department</option>
                        <option value="DEPT001">Technology</option>
                        <option value="DEPT002">Human Resources</option>
                        <option value="DEPT003">Sales</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation *
                      </label>
                      <select
                        defaultValue={selectedEmployee?.employment.designationId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Designation</option>
                        <option value="DES001">Senior Software Engineer</option>
                        <option value="DES002">HR Manager</option>
                        <option value="DES003">Team Lead</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade *
                      </label>
                      <select
                        defaultValue={selectedEmployee?.employment.gradeId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Grade</option>
                        <option value="GRD001">E1</option>
                        <option value="GRD002">E2</option>
                        <option value="GRD003">E3</option>
                        <option value="GRD004">M1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedEmployee?.employment.location}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select defaultValue={selectedEmployee?.status || 'Active'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Resigned">Resigned</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  alert('Employee saved successfully!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedEmployee ? 'Update' : 'Create'} Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
