'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Send,
  TrendingUp,
  FileText,
  CheckCircle,
  Award,
} from 'lucide-react';

interface RFP {
  id: string;
  rfpNumber: string;
  clientName: string;
  projectTitle: string;
  industry: 'manufacturing' | 'construction' | 'automotive' | 'pharma' | 'energy' | 'electronics';
  submissionDate: string;
  closingDate: string;
  estimatedValue: number;
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'won' | 'lost';
  salesOwner: string;
  requirementDetails: string;
  technicalSpecs: string;
  commercialTerms: string;
  competitorInfo: string;
  winProbability: number;
}

const mockRFPs: RFP[] = [
  {
    id: '1',
    rfpNumber: 'RFP-2025-001',
    clientName: 'Tata Steel Limited',
    projectTitle: 'Manufacturing Process Automation System',
    industry: 'manufacturing',
    submissionDate: '2025-01-15',
    closingDate: '2025-02-28',
    estimatedValue: 8500000,
    status: 'submitted',
    salesOwner: 'Rajesh Kumar',
    requirementDetails: 'Complete automation solution for steel rolling mill',
    technicalSpecs: 'PLC-based control system with SCADA integration',
    commercialTerms: 'Payment in 3 milestones, 90 days credit',
    competitorInfo: 'Siemens, ABB competing',
    winProbability: 75,
  },
  {
    id: '2',
    rfpNumber: 'RFP-2025-002',
    clientName: 'Larsen & Toubro Construction',
    projectTitle: 'Smart Building Management System',
    industry: 'construction',
    submissionDate: '2025-01-20',
    closingDate: '2025-03-15',
    estimatedValue: 6200000,
    status: 'under_review',
    salesOwner: 'Priya Sharma',
    requirementDetails: 'Integrated BMS for commercial complex',
    technicalSpecs: 'IoT-enabled sensors with cloud monitoring',
    commercialTerms: 'BOT model with 5-year AMC',
    competitorInfo: 'Honeywell, Johnson Controls',
    winProbability: 60,
  },
  {
    id: '3',
    rfpNumber: 'RFP-2025-003',
    clientName: 'Mahindra & Mahindra Auto',
    projectTitle: 'Assembly Line Robotics Integration',
    industry: 'automotive',
    submissionDate: '2025-01-10',
    closingDate: '2025-02-20',
    estimatedValue: 12500000,
    status: 'shortlisted',
    salesOwner: 'Amit Patel',
    requirementDetails: 'Robotic welding and painting systems',
    technicalSpecs: '6-axis industrial robots with vision systems',
    commercialTerms: 'Turnkey project with training included',
    competitorInfo: 'Fanuc, KUKA in competition',
    winProbability: 85,
  },
  {
    id: '4',
    rfpNumber: 'RFP-2025-004',
    clientName: 'Sun Pharma Industries',
    projectTitle: 'Pharmaceutical Manufacturing Equipment',
    industry: 'pharma',
    submissionDate: '2025-02-01',
    closingDate: '2025-03-30',
    estimatedValue: 15000000,
    status: 'draft',
    salesOwner: 'Sneha Reddy',
    requirementDetails: 'Clean room equipment and packaging line',
    technicalSpecs: 'FDA compliant systems with validation',
    commercialTerms: 'Fixed price with performance guarantee',
    competitorInfo: 'GEA, Bosch Packaging',
    winProbability: 50,
  },
  {
    id: '5',
    rfpNumber: 'RFP-2025-005',
    clientName: 'Reliance Energy Limited',
    projectTitle: 'Power Plant Control & Monitoring System',
    industry: 'energy',
    submissionDate: '2024-12-15',
    closingDate: '2025-01-31',
    estimatedValue: 22000000,
    status: 'won',
    salesOwner: 'Vikram Singh',
    requirementDetails: 'DCS and safety systems for thermal plant',
    technicalSpecs: 'Redundant architecture with cybersecurity',
    commercialTerms: '4 milestone payments, 2-year warranty',
    competitorInfo: 'Beat Schneider Electric and Emerson',
    winProbability: 100,
  },
  {
    id: '6',
    rfpNumber: 'RFP-2024-089',
    clientName: 'Bharat Electronics Limited',
    projectTitle: 'PCB Manufacturing Line Upgrade',
    industry: 'electronics',
    submissionDate: '2024-11-20',
    closingDate: '2024-12-31',
    estimatedValue: 4500000,
    status: 'lost',
    salesOwner: 'Anita Desai',
    requirementDetails: 'SMT line with optical inspection',
    technicalSpecs: 'High-speed pick and place machines',
    commercialTerms: 'Competitive pricing with training',
    competitorInfo: 'Lost to Juki Corporation on price',
    winProbability: 0,
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  submitted: 'bg-blue-100 text-blue-700 border-blue-300',
  under_review: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  shortlisted: 'bg-purple-100 text-purple-700 border-purple-300',
  won: 'bg-green-100 text-green-700 border-green-300',
  lost: 'bg-red-100 text-red-700 border-red-300',
};

const industryOptions = [
  { value: '', label: 'All Industries' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'construction', label: 'Construction' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'pharma', label: 'Pharmaceutical' },
  { value: 'energy', label: 'Energy' },
  { value: 'electronics', label: 'Electronics' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export default function RFPPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRFPs = mockRFPs.filter((rfp) => {
    const matchesSearch =
      rfp.rfpNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || rfp.status === statusFilter;
    const matchesIndustry = !industryFilter || rfp.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const totalPages = Math.ceil(filteredRFPs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRFPs = filteredRFPs.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    activeRFPs: mockRFPs.filter((r) => ['submitted', 'under_review', 'shortlisted'].includes(r.status)).length,
    underReview: mockRFPs.filter((r) => r.status === 'under_review').length,
    won: mockRFPs.filter((r) => r.status === 'won').length,
    winRate: Math.round(
      (mockRFPs.filter((r) => r.status === 'won').length /
        mockRFPs.filter((r) => ['won', 'lost'].includes(r.status)).length) *
        100
    ),
  };

  const handleExport = () => {
    console.log('Exporting RFP report...');
  };

  const handleView = (id: string) => {
    console.log('Viewing RFP:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Editing RFP:', id);
  };

  const handleSubmit = (id: string) => {
    console.log('Submitting RFP:', id);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats with Export Button */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active RFPs</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.activeRFPs}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.underReview}</p>
              </div>
              <Filter className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Won RFPs</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.won}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Win Rate</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.winRate}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by RFP number, client, or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {industryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-24rem)]">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    RFP Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Project Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Closing Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estimated Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sales Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRFPs.map((rfp) => (
                  <tr key={rfp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{rfp.rfpNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{rfp.clientName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{rfp.projectTitle}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 capitalize">{rfp.industry}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(rfp.submissionDate).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(rfp.closingDate).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{(rfp.estimatedValue / 100000).toFixed(2)}L
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          statusColors[rfp.status]
                        }`}
                      >
                        {rfp.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{rfp.salesOwner}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(rfp.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(rfp.id)}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {rfp.status === 'draft' && (
                          <button
                            onClick={() => handleSubmit(rfp.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Submit"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRFPs.length)} of{' '}
                {filteredRFPs.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
