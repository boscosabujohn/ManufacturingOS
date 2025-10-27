'use client';

import { useState, useMemo } from 'react';
import { File, Search, Download, CheckCircle, Clock, AlertCircle, FileText, User, Calendar } from 'lucide-react';

interface Form16Record {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  financialYear: string;
  pan: string;
  tanNumber: string;
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTDS: number;
  taxRelief: number;
  netTaxPayable: number;
  status: 'draft' | 'generated' | 'issued' | 'downloaded';
  generatedDate?: string;
  issuedDate?: string;
  form16Number?: string;
}

export default function Form16Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('2024-25');

  const mockForm16Records: Form16Record[] = [
    {
      id: 'F16-2024-001',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      designation: 'Senior Production Manager',
      department: 'Production',
      financialYear: '2024-25',
      pan: 'ABCDE1234F',
      tanNumber: 'KARB01234E',
      totalIncome: 596700,
      totalDeductions: 225000,
      taxableIncome: 321700,
      totalTDS: 15850,
      taxRelief: 12500,
      netTaxPayable: 3350,
      status: 'issued',
      generatedDate: '2025-05-25',
      issuedDate: '2025-06-01',
      form16Number: 'F16/2024-25/001'
    },
    {
      id: 'F16-2024-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      designation: 'Quality Control Supervisor',
      department: 'Quality',
      financialYear: '2024-25',
      pan: 'FGHIJ5678K',
      tanNumber: 'KARB01234E',
      totalIncome: 431712,
      totalDeductions: 180000,
      taxableIncome: 201712,
      totalTDS: 5043,
      taxRelief: 12500,
      netTaxPayable: 0,
      status: 'generated',
      generatedDate: '2025-05-26',
      form16Number: 'F16/2024-25/002'
    },
    {
      id: 'F16-2024-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Production Operator',
      department: 'Production',
      financialYear: '2024-25',
      pan: 'KLMNO9012P',
      tanNumber: 'KARB01234E',
      totalIncome: 262488,
      totalDeductions: 120000,
      taxableIncome: 92488,
      totalTDS: 0,
      taxRelief: 0,
      netTaxPayable: 0,
      status: 'generated',
      generatedDate: '2025-05-27',
      form16Number: 'F16/2024-25/003'
    },
    {
      id: 'F16-2024-004',
      employeeId: 'EMP004',
      employeeName: 'Neha Singh',
      designation: 'Maintenance Engineer',
      department: 'Maintenance',
      financialYear: '2024-25',
      pan: 'QRSTU3456V',
      tanNumber: 'KARB01234E',
      totalIncome: 409212,
      totalDeductions: 85000,
      taxableIncome: 274212,
      totalTDS: 10711,
      taxRelief: 12500,
      netTaxPayable: 0,
      status: 'draft',
      form16Number: 'F16/2024-25/004'
    },
    {
      id: 'F16-2024-005',
      employeeId: 'EMP005',
      employeeName: 'Vikram Desai',
      designation: 'Logistics Coordinator',
      department: 'Logistics',
      financialYear: '2024-25',
      pan: 'WXYZ7890A',
      tanNumber: 'KARB01234E',
      totalIncome: 379200,
      totalDeductions: 195000,
      taxableIncome: 134200,
      totalTDS: 2071,
      taxRelief: 12500,
      netTaxPayable: 0,
      status: 'issued',
      generatedDate: '2025-05-28',
      issuedDate: '2025-06-02',
      form16Number: 'F16/2024-25/005'
    },
    {
      id: 'F16-2024-006',
      employeeId: 'EMP006',
      employeeName: 'Kavita Mehta',
      designation: 'HR Executive',
      department: 'HR',
      financialYear: '2024-25',
      pan: 'BCDEF2345G',
      tanNumber: 'KARB01234E',
      totalIncome: 394188,
      totalDeductions: 165000,
      taxableIncome: 179188,
      totalTDS: 4297,
      taxRelief: 12500,
      netTaxPayable: 0,
      status: 'downloaded',
      generatedDate: '2025-05-25',
      issuedDate: '2025-06-01',
      form16Number: 'F16/2024-25/006'
    }
  ];

  const filteredRecords = useMemo(() => {
    return mockForm16Records.filter(record => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.pan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
      const matchesFY = record.financialYear === selectedFinancialYear;
      return matchesSearch && matchesDepartment && matchesStatus && matchesFY;
    });
  }, [searchTerm, selectedDepartment, selectedStatus, selectedFinancialYear]);

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];
  const statuses = ['all', 'draft', 'generated', 'issued', 'downloaded'];
  const financialYears = ['2024-25', '2023-24', '2022-23'];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    generated: 'bg-blue-100 text-blue-700',
    issued: 'bg-green-100 text-green-700',
    downloaded: 'bg-purple-100 text-purple-700'
  };

  const statusIcons = {
    draft: Clock,
    generated: FileText,
    issued: CheckCircle,
    downloaded: Download
  };

  const stats = {
    totalEmployees: filteredRecords.length,
    generated: filteredRecords.filter(r => ['generated', 'issued', 'downloaded'].includes(r.status)).length,
    issued: filteredRecords.filter(r => ['issued', 'downloaded'].includes(r.status)).length,
    draft: filteredRecords.filter(r => r.status === 'draft').length,
    totalTDS: filteredRecords.reduce((sum, r) => sum + r.totalTDS, 0)
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Form 16 (Part A & B)</h1>
        <p className="text-sm text-gray-600 mt-1">TDS Certificate for salary income - Financial Year {selectedFinancialYear}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalEmployees}</p>
            </div>
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-sm border border-cyan-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-cyan-700">Generated</p>
              <p className="text-2xl font-bold text-cyan-900 mt-1">{stats.generated}</p>
            </div>
            <FileText className="h-6 w-6 text-cyan-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700">Issued</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.issued}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-yellow-700">Draft</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.draft}</p>
            </div>
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-700">Total TDS</p>
              <p className="text-lg font-bold text-purple-900 mt-1">{formatCurrency(stats.totalTDS)}</p>
            </div>
            <File className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by employee name, ID, or PAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFinancialYear}
            onChange={(e) => setSelectedFinancialYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {financialYears.map(fy => (
              <option key={fy} value={fy}>
                FY {fy}
              </option>
            ))}
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.toUpperCase()}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Bulk Download
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.map(record => {
          const StatusIcon = statusIcons[record.status];

          return (
            <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{record.employeeName}</h3>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      {record.employeeId}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${statusColors[record.status]}`}>
                      <StatusIcon className="h-3 w-3" />
                      {record.status.toUpperCase()}
                    </span>
                    {record.form16Number && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {record.form16Number}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {record.designation} • {record.department}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>PAN: {record.pan}</span>
                    <span>TAN: {record.tanNumber}</span>
                    <span>FY: {record.financialYear}</span>
                    {record.generatedDate && <span>Generated: {new Date(record.generatedDate).toLocaleDateString('en-IN')}</span>}
                    {record.issuedDate && <span>Issued: {new Date(record.issuedDate).toLocaleDateString('en-IN')}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Total TDS Deducted</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(record.totalTDS)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-xs font-semibold text-blue-900 mb-3">Income Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">Total Income</span>
                      <span className="font-bold text-blue-900">{formatCurrency(record.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">Less: Deductions</span>
                      <span className="font-medium text-blue-800">({formatCurrency(record.totalDeductions)})</span>
                    </div>
                    <div className="pt-2 border-t border-blue-300">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-blue-900">Taxable Income</span>
                        <span className="font-bold text-blue-900">{formatCurrency(record.taxableIncome)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-xs font-semibold text-green-900 mb-3">TDS Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Total TDS Deducted</span>
                      <span className="font-bold text-green-900">{formatCurrency(record.totalTDS)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Tax Relief (u/s 89)</span>
                      <span className="font-medium text-green-800">{formatCurrency(record.taxRelief)}</span>
                    </div>
                    <div className="pt-2 border-t border-green-300">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-green-900">Net Tax Payable</span>
                        <span className="font-bold text-green-900">{formatCurrency(record.netTaxPayable)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-xs font-semibold text-purple-900 mb-3">Form 16 Parts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-700">Part A (Annexure)</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-700">Part B (Details)</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="pt-2 border-t border-purple-300">
                      <p className="text-xs text-purple-700">
                        Complete certificate with salary breakup & TDS summary
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="text-xs font-semibold text-orange-900 mb-3">Actions</h4>
                  <div className="space-y-2">
                    {record.status === 'draft' && (
                      <button className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Generate Form 16
                      </button>
                    )}
                    {record.status === 'generated' && (
                      <button className="w-full px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Issue to Employee
                      </button>
                    )}
                    {['issued', 'downloaded'].includes(record.status) && (
                      <>
                        <button className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                          <Download className="h-3 w-3" />
                          Download PDF
                        </button>
                        <button className="w-full px-3 py-2 text-xs border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
                          Send via Email
                        </button>
                      </>
                    )}
                    <button className="w-full px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Form 16 Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Form 16:</strong> TDS certificate issued by employer to employee for salary income (as per Section 203 of Income Tax Act)</li>
          <li>• <strong>Part A:</strong> Contains certificate number, employer details (name, TAN), employee details (name, PAN), TDS summary, and quarterly breakup</li>
          <li>• <strong>Part B:</strong> Contains detailed salary breakup, allowances, perquisites, deductions claimed (80C, 80D, etc.), and tax computation</li>
          <li>• <strong>Issue Timeline:</strong> Must be issued on or before 15th June following the end of financial year</li>
          <li>• <strong>Digitally Signed:</strong> Form 16 must be digitally signed by authorized person and contain unique certificate number</li>
          <li>• <strong>TDS Credit:</strong> Employees use Form 16 while filing ITR to claim TDS credit</li>
          <li>• <strong>Verification:</strong> Employees should verify Form 26AS or AIS to match TDS credits with Form 16</li>
          <li>• <strong>Revised Form 16:</strong> If corrections needed, issue revised Form 16 with original certificate number</li>
        </ul>
      </div>
    </div>
  );
}
