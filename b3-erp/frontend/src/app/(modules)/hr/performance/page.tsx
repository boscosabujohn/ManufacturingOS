'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, Edit, Download, ChevronLeft, ChevronRight, Award, TrendingUp, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';

interface PerformanceReview {
  id: string;
  reviewId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewPeriod: string;
  reviewType: 'annual' | 'mid_year' | 'probation' | 'quarterly';
  rating: number;
  ratingLabel: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  reviewer: string;
  goalsSet: number;
  goalsAchieved: number;
  keyAchievements: string[];
  improvementAreas: string[];
  reviewDate: string;
  nextReviewDate: string;
}

const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: 'PR-001',
    reviewId: 'REV-2025-001',
    employeeId: 'B3-001',
    employeeName: 'Rajesh Kumar',
    department: 'Production',
    reviewPeriod: 'Jan-Jun 2025',
    reviewType: 'mid_year',
    rating: 4.5,
    ratingLabel: 'Exceeds Expectations',
    status: 'completed',
    reviewer: 'Priya Sharma',
    goalsSet: 8,
    goalsAchieved: 7,
    keyAchievements: [
      'Improved production efficiency by 15%',
      'Reduced waste by 20%',
      'Successfully led team of 12 workers'
    ],
    improvementAreas: [
      'Time management for project deadlines',
      'Cross-department communication'
    ],
    reviewDate: '2025-07-15',
    nextReviewDate: '2026-01-15',
  },
  {
    id: 'PR-002',
    reviewId: 'REV-2025-002',
    employeeId: 'B3-002',
    employeeName: 'Priya Patel',
    department: 'Engineering',
    reviewPeriod: 'Q3 2025',
    reviewType: 'quarterly',
    rating: 5.0,
    ratingLabel: 'Outstanding',
    status: 'completed',
    reviewer: 'Amit Desai',
    goalsSet: 6,
    goalsAchieved: 6,
    keyAchievements: [
      'Designed 3 new product prototypes',
      'Secured 2 patents for innovative designs',
      'Mentored 4 junior engineers',
      'Completed advanced CAD certification'
    ],
    improvementAreas: [],
    reviewDate: '2025-09-30',
    nextReviewDate: '2025-12-31',
  },
  {
    id: 'PR-003',
    reviewId: 'REV-2025-003',
    employeeId: 'B3-003',
    employeeName: 'Amit Singh',
    department: 'Sales',
    reviewPeriod: 'Q2 2025',
    reviewType: 'quarterly',
    rating: 3.5,
    ratingLabel: 'Meets Expectations',
    status: 'in_progress',
    reviewer: 'Neha Gupta',
    goalsSet: 10,
    goalsAchieved: 7,
    keyAchievements: [
      'Achieved 85% of quarterly sales target',
      'Acquired 15 new clients',
      'Improved client retention rate'
    ],
    improvementAreas: [
      'Need to improve closing rate',
      'Follow-up with leads needs attention',
      'Product knowledge enhancement required'
    ],
    reviewDate: '2025-07-01',
    nextReviewDate: '2025-10-01',
  },
  {
    id: 'PR-004',
    reviewId: 'REV-2025-004',
    employeeId: 'B3-004',
    employeeName: 'Sneha Reddy',
    department: 'Quality Control',
    reviewPeriod: 'Probation Period - 6 months',
    reviewType: 'probation',
    rating: 4.2,
    ratingLabel: 'Exceeds Expectations',
    status: 'pending',
    reviewer: 'Rajesh Kumar',
    goalsSet: 5,
    goalsAchieved: 4,
    keyAchievements: [
      'Quick adaptation to QC procedures',
      'Identified 12 critical defects',
      'Completed all required certifications',
      'Excellent attention to detail'
    ],
    improvementAreas: [
      'Speed up inspection process',
      'Learn advanced testing equipment'
    ],
    reviewDate: '2025-11-01',
    nextReviewDate: '2026-05-01',
  },
  {
    id: 'PR-005',
    reviewId: 'REV-2025-005',
    employeeId: 'B3-005',
    employeeName: 'Vikram Malhotra',
    department: 'IT',
    reviewPeriod: 'Annual Review 2024-2025',
    reviewType: 'annual',
    rating: 4.8,
    ratingLabel: 'Outstanding',
    status: 'completed',
    reviewer: 'Sanjay Verma',
    goalsSet: 12,
    goalsAchieved: 11,
    keyAchievements: [
      'Led successful ERP implementation',
      'Reduced system downtime by 40%',
      'Implemented cybersecurity protocols',
      'Trained 25+ employees on new systems',
      'Automated 8 manual processes'
    ],
    improvementAreas: [
      'Delegation skills can be improved'
    ],
    reviewDate: '2025-06-30',
    nextReviewDate: '2026-06-30',
  },
  {
    id: 'PR-006',
    reviewId: 'REV-2025-006',
    employeeId: 'B3-006',
    employeeName: 'Kavita Nair',
    department: 'HR',
    reviewPeriod: 'Q1 2025',
    reviewType: 'quarterly',
    rating: 2.8,
    ratingLabel: 'Needs Improvement',
    status: 'overdue',
    reviewer: 'Deepak Joshi',
    goalsSet: 8,
    goalsAchieved: 4,
    keyAchievements: [
      'Processed 45 recruitment requests',
      'Organized 2 employee engagement events'
    ],
    improvementAreas: [
      'Missing deadlines consistently',
      'Poor communication with candidates',
      'Incomplete documentation',
      'Time management issues',
      'Need to improve HR policy knowledge'
    ],
    reviewDate: '2025-04-15',
    nextReviewDate: '2025-07-15',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
};

const reviewTypeColors = {
  annual: 'bg-purple-100 text-purple-700',
  mid_year: 'bg-blue-100 text-blue-700',
  probation: 'bg-orange-100 text-orange-700',
  quarterly: 'bg-teal-100 text-teal-700',
};

const reviewTypeLabels = {
  annual: 'Annual Review',
  mid_year: 'Mid-Year Review',
  probation: 'Probation Review',
  quarterly: 'Quarterly Review',
};

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 3.0) return 'text-orange-600';
  return 'text-red-600';
};

const getRatingStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-current" />);
  }
  if (hasHalfStar && fullStars < 5) {
    stars.push(<Star key="half" className="h-4 w-4 fill-current opacity-50" />);
  }
  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-4 w-4" />);
  }
  return stars;
};

export default function PerformancePage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockPerformanceReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || review.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    pendingReviews: reviews.filter((r) => r.status === 'pending').length,
    completedThisQuarter: reviews.filter((r) => {
      const reviewDate = new Date(r.reviewDate);
      const now = new Date();
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const reviewQuarter = Math.floor(reviewDate.getMonth() / 3);
      return r.status === 'completed' && reviewDate.getFullYear() === now.getFullYear() && reviewQuarter === currentQuarter;
    }).length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    highPerformers: reviews.filter((r) => r.rating >= 4.5).length,
  };

  const departments = Array.from(new Set(reviews.map((r) => r.department)));

  const handleExport = () => {
    alert('Exporting performance report...');
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pendingReviews}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed This Quarter</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.completedThisQuarter}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Avg Rating</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.avgRating}/5.0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">High Performers</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.highPerformers}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee name, review ID, employee ID, reviewer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
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
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviewer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{review.reviewId}</div>
                    <div className="text-xs text-gray-500">Employee: {review.employeeId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{review.employeeName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Goals: {review.goalsAchieved}/{review.goalsSet} achieved
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{review.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{review.reviewPeriod}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Review: {review.reviewDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${reviewTypeColors[review.reviewType]}`}>
                      {reviewTypeLabels[review.reviewType]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <div className={`flex ${getRatingColor(review.rating)}`}>
                        {getRatingStars(review.rating)}
                      </div>
                    </div>
                    <div className={`text-sm font-bold mt-1 ${getRatingColor(review.rating)}`}>
                      {review.rating.toFixed(1)} - {review.ratingLabel}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[review.status]}`}>
                      {statusLabels[review.status]}
                    </span>
                    {review.status === 'overdue' && (
                      <div className="flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                        <span className="text-xs text-red-600">Action required</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{review.reviewer}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Next: {review.nextReviewDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/hr/performance/view/${review.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => router.push(`/hr/performance/edit/${review.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReviews.length)} of{' '}
            {filteredReviews.length} items
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
