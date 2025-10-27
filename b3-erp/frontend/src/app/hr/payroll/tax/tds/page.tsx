'use client';

import { useState, useMemo } from 'react';
import { Calculator, Search, Download, TrendingUp, DollarSign, Users, FileText, Calendar } from 'lucide-react';

interface MonthlyTDS {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  month: string;
  grossSalary: number;
  standardDeduction: number;
  professionalTax: number;
  pfEmployee: number;
  otherDeductions: number;
  taxableIncome: number;
  estimatedAnnualIncome: number;
  estimatedDeductions: number;
  estimatedTaxableIncome: number;
  taxRate: number;
  monthlyTDS: number;
  tdsDeductedTillDate: number;
}

export default function TDSCalculationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('Nov-2025');

  const mockTDSData: MonthlyTDS[] = [
    {
      id: 'TDS-NOV-001',
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      designation: 'Senior Production Manager',
      department: 'Production',
      month: 'Nov-2025',
      grossSalary: 49725,
      standardDeduction: 4167, // ₹50,000/12
      professionalTax: 200,
      pfEmployee: 1800,
      otherDeductions: 0,
      taxableIncome: 43558,
      estimatedAnnualIncome: 596700,
      estimatedDeductions: 275000, // 50k std + 225k declared
      estimatedTaxableIncome: 321700,
      taxRate: 5,
      monthlyTDS: 1321,
      tdsDeductedTillDate: 9247
    },
    {
      id: 'TDS-NOV-002',
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      designation: 'Quality Control Supervisor',
      department: 'Quality',
      month: 'Nov-2025',
      grossSalary: 35976,
      standardDeduction: 4167,
      professionalTax: 200,
      pfEmployee: 1800,
      otherDeductions: 0,
      taxableIncome: 29809,
      estimatedAnnualIncome: 431712,
      estimatedDeductions: 230000,
      estimatedTaxableIncome: 201712,
      taxRate: 5,
      monthlyTDS: 420,
      tdsDeductedTillDate: 2940
    },
    {
      id: 'TDS-NOV-003',
      employeeId: 'EMP003',
      employeeName: 'Amit Patel',
      designation: 'Production Operator',
      department: 'Production',
      month: 'Nov-2025',
      grossSalary: 21874,
      standardDeduction: 4167,
      professionalTax: 200,
      pfEmployee: 1800,
      otherDeductions: 0,
      taxableIncome: 15707,
      estimatedAnnualIncome: 262488,
      estimatedDeductions: 170000,
      estimatedTaxableIncome: 92488,
      taxRate: 0,
      monthlyTDS: 0,
      tdsDeductedTillDate: 0
    },
    {
      id: 'TDS-NOV-004',
      employeeId: 'EMP004',
      employeeName: 'Neha Singh',
      designation: 'Maintenance Engineer',
      department: 'Maintenance',
      month: 'Nov-2025',
      grossSalary: 34101,
      standardDeduction: 4167,
      professionalTax: 200,
      pfEmployee: 1800,
      otherDeductions: 0,
      taxableIncome: 27934,
      estimatedAnnualIncome: 409212,
      estimatedDeductions: 135000,
      estimatedTaxableIncome: 274212,
      taxRate: 5,
      monthlyTDS: 893,
      tdsDeductedTillDate: 6251
    },
    {
      id: 'TDS-NOV-005',
      employeeId: 'EMP005',
      employeeName: 'Vikram Desai',
      designation: 'Logistics Coordinator',
      department: 'Logistics',
      month: 'Nov-2025',
      grossSalary: 31600,
      standardDeduction: 4167,
      professionalTax: 200,
      pfEmployee: 1800,
      otherDeductions: 0,
      taxableIncome: 25433,
      estimatedAnnualIncome: 379200,
      estimatedDeductions: 245000,
      estimatedTaxableIncome: 134200,
      taxRate: 5,
      monthlyTDS: 173,
      tdsDeductedTillDate: 1211
    },
    {
      id: 'TDS-NOV-006',
      employeeId: 'EMP006',
      employeeName: 'Kavita Mehta',
      designation: 'HR Executive',
      department: 'HR',
      month: 'Nov-2025',
      grossSalary: 32849,
      standardDeduction: 4167,
      professionalTax: 200,
      pfEmployee: 1800,
      otherDeductions: 0,
      taxableIncome: 26682,
      estimatedAnnualIncome: 394188,
      estimatedDeductions: 215000,
      estimatedTaxableIncome: 179188,
      taxRate: 5,
      monthlyTDS: 358,
      tdsDeductedTillDate: 2506
    }
  ];

  const filteredData = useMemo(() => {
    return mockTDSData.filter(record => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
      const matchesMonth = record.month === selectedMonth;
      return matchesSearch && matchesDepartment && matchesMonth;
    });
  }, [searchTerm, selectedDepartment, selectedMonth]);

  const departments = ['all', 'Production', 'Quality', 'Maintenance', 'Logistics', 'HR'];
  const months = ['Nov-2025', 'Oct-2025', 'Sep-2025', 'Aug-2025'];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const stats = {
    totalEmployees: filteredData.length,
    employeesWithTDS: filteredData.filter(d => d.monthlyTDS > 0).length,
    totalMonthlyTDS: filteredData.reduce((sum, d) => sum + d.monthlyTDS, 0),
    totalTDSTillDate: filteredData.reduce((sum, d) => sum + d.tdsDeductedTillDate, 0),
    totalTaxableIncome: filteredData.reduce((sum, d) => sum + d.taxableIncome, 0)
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">TDS Calculation & Deduction</h1>
        <p className="text-sm text-gray-600 mt-1">Monthly Tax Deducted at Source (TDS) computation for {selectedMonth}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalEmployees}</p>
            </div>
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700">With TDS</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.employeesWithTDS}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-700">Monthly TDS</p>
              <p className="text-lg font-bold text-purple-900 mt-1">{formatCurrency(stats.totalMonthlyTDS)}</p>
            </div>
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-sm border border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-700">TDS Till Date</p>
              <p className="text-lg font-bold text-orange-900 mt-1">{formatCurrency(stats.totalTDSTillDate)}</p>
            </div>
            <Calculator className="h-6 w-6 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-sm border border-cyan-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-cyan-700">Taxable Income</p>
              <p className="text-lg font-bold text-cyan-900 mt-1">{formatCurrency(stats.totalTaxableIncome)}</p>
            </div>
            <FileText className="h-6 w-6 text-cyan-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {months.map(month => (
              <option key={month} value={month}>
                {month}
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
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export TDS Report
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map(record => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{record.employeeName}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {record.employeeId}
                  </span>
                  {record.monthlyTDS > 0 ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      TDS APPLICABLE
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      NO TDS
                    </span>
                  )}
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    Tax Rate: {record.taxRate}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {record.designation} • {record.department}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Month: {record.month}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Monthly TDS Deduction</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(record.monthlyTDS)}</p>
                <p className="text-xs text-gray-500 mt-2">TDS Till Date</p>
                <p className="text-sm font-semibold text-orange-600">{formatCurrency(record.tdsDeductedTillDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-xs font-semibold text-blue-900 mb-3">Monthly Salary Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Gross Salary</span>
                    <span className="font-bold text-blue-900">{formatCurrency(record.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Standard Deduction</span>
                    <span className="font-medium text-blue-800">({formatCurrency(record.standardDeduction)})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Professional Tax</span>
                    <span className="font-medium text-blue-800">({formatCurrency(record.professionalTax)})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">PF Employee</span>
                    <span className="font-medium text-blue-800">({formatCurrency(record.pfEmployee)})</span>
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
                <h4 className="text-xs font-semibold text-green-900 mb-3">Annual Projection</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Estimated Annual Income</span>
                    <span className="font-bold text-green-900">{formatCurrency(record.estimatedAnnualIncome)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-700">Less: Total Deductions</span>
                    <span className="font-medium text-green-800">({formatCurrency(record.estimatedDeductions)})</span>
                  </div>
                  <div className="pt-2 border-t border-green-300">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-green-900">Taxable Income</span>
                      <span className="font-bold text-green-900">{formatCurrency(record.estimatedTaxableIncome)}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-green-700">
                      Based on current salary & declared investments
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-xs font-semibold text-purple-900 mb-3">TDS Computation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">Tax Rate</span>
                    <span className="font-medium text-purple-900">{record.taxRate}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">Monthly TDS</span>
                    <span className="font-bold text-purple-900">{formatCurrency(record.monthlyTDS)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700">TDS Till Date (FY)</span>
                    <span className="font-bold text-purple-900">{formatCurrency(record.tdsDeductedTillDate)}</span>
                  </div>
                  <div className="pt-2 border-t border-purple-300">
                    <p className="text-xs text-purple-700">
                      {record.monthlyTDS > 0
                        ? 'TDS deducted monthly from salary'
                        : 'Income below taxable limit'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                View Tax Computation Sheet
              </button>
              <button className="px-4 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
                Adjust TDS
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">TDS Calculation Guidelines (FY 2025-26)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="bg-white p-3 rounded">
            <h4 className="text-xs font-bold text-blue-800 mb-2">Income Tax Slabs (Old Regime)</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Up to ₹2,50,000: Nil</li>
              <li>• ₹2,50,001 to ₹5,00,000: 5%</li>
              <li>• ₹5,00,001 to ₹10,00,000: 20%</li>
              <li>• Above ₹10,00,000: 30%</li>
              <li>• Cess: 4% on total tax</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded">
            <h4 className="text-xs font-bold text-blue-800 mb-2">Income Tax Slabs (New Regime)</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Up to ₹3,00,000: Nil</li>
              <li>• ₹3,00,001 to ₹7,00,000: 5%</li>
              <li>• ₹7,00,001 to ₹10,00,000: 10%</li>
              <li>• ₹10,00,001 to ₹12,00,000: 15%</li>
              <li>• ₹12,00,001 to ₹15,00,000: 20%</li>
              <li>• Above ₹15,00,000: 30%</li>
            </ul>
          </div>
        </div>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>TDS:</strong> Tax Deducted at Source by employer on salary income under Section 192</li>
          <li>• <strong>Standard Deduction:</strong> ₹50,000 per annum (₹4,167 per month) available in both regimes</li>
          <li>• <strong>Rebate u/s 87A:</strong> ₹12,500 if total income up to ₹5,00,000 (Old) or ₹7,00,000 (New)</li>
          <li>• <strong>Monthly Calculation:</strong> TDS calculated based on estimated annual income, deducted monthly</li>
          <li>• <strong>Adjustment:</strong> TDS adjusted in February/March based on actual income & investment proofs</li>
          <li>• <strong>Regime Selection:</strong> Employees can choose between old regime (with deductions) or new regime (lower rates, no deductions)</li>
          <li>• <strong>Form 12BB:</strong> Employees submit investment proofs via Form 12BB for TDS adjustment</li>
        </ul>
      </div>
    </div>
  );
}
