'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, TrendingUp, DollarSign, Target, Calendar, User, Building2, ChevronLeft, ChevronRight, Phone, Mail, FileText, Video, CheckCircle, X, Download, Upload, Filter, Save, UserPlus, FileSpreadsheet, ArrowUpDown, Check, Trophy, ThumbsDown, MessageSquare } from 'lucide-react';
import { ConfirmDialog, useToast } from '@/components/ui';
import { OpportunityService, Opportunity, MOCK_OPPORTUNITIES } from '@/services/opportunity.service';

// Using MOCK_OPPORTUNITIES from service as fallback

const stageColors = {
  prospecting: 'bg-blue-100 text-blue-700',
  qualification: 'bg-purple-100 text-purple-700',
  proposal: 'bg-yellow-100 text-yellow-700',
  negotiation: 'bg-orange-100 text-orange-700',
  closed_won: 'bg-emerald-100 text-emerald-700',
  closed_lost: 'bg-red-100 text-red-700',
};

const stageLabels = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

const OPPORTUNITY_STAGES: Opportunity['stage'][] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
const ASSIGNED_USERS = ['Sarah Johnson', 'Michael Chen', 'David Park', 'Emily Davis'];

interface SavedFilter {
  id: string;
  name: string;
  filters: {
    stage: string;
    owner: string;
    amountMin: string;
    amountMax: string;
    probabilityMin: string;
    probabilityMax: string;
    closeDateFrom: string;
    closeDateTo: string;
  };
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Enhanced Delete State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);

  // Bulk Operations State
  const [selectedOpportunityIds, setSelectedOpportunityIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkAssignDialog, setShowBulkAssignDialog] = useState(false);
  const [showBulkStageDialog, setShowBulkStageDialog] = useState(false);
  const [bulkAssignUser, setBulkAssignUser] = useState('');
  const [bulkStage, setBulkStage] = useState<Opportunity['stage']>('prospecting');

  // Inline Stage Update State
  const [stageDropdownOpen, setStageDropdownOpen] = useState<string | null>(null);

  // Advanced Filtering State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [amountMinFilter, setAmountMinFilter] = useState<string>('');
  const [amountMaxFilter, setAmountMaxFilter] = useState<string>('');
  const [probabilityMinFilter, setProbabilityMinFilter] = useState<string>('');
  const [probabilityMaxFilter, setProbabilityMaxFilter] = useState<string>('');
  const [closeDateFromFilter, setCloseDateFromFilter] = useState<string>('');
  const [closeDateToFilter, setCloseDateToFilter] = useState<string>('');
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveFilterDialog, setShowSaveFilterDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Import/Export State
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Stage Transition with Reason State
  const [showStageReasonDialog, setShowStageReasonDialog] = useState(false);
  const [stageTransition, setStageTransition] = useState<{
    opportunityId: string;
    newStage: Opportunity['stage'];
  } | null>(null);
  const [winReason, setWinReason] = useState('');
  const [lossReason, setLossReason] = useState('');
  const [competitor, setCompetitor] = useState('');

  // Fetch opportunities data on mount
  useEffect(() => {
    async function fetchOpportunities() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await OpportunityService.getAllOpportunities();
        setOpportunities(data);
      } catch (err) {
        console.error('Failed to fetch opportunities:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch opportunities'));
        // Fallback to mock data
        setOpportunities(MOCK_OPPORTUNITIES);
        addToast({
          title: 'Connection Error',
          message: 'Using cached data. Unable to connect to server.',
          variant: 'warning'
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchOpportunities();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (selectedOpportunityIds.size === 1) {
        const selectedId = Array.from(selectedOpportunityIds)[0];
        const opportunity = opportunities.find(o => o.id === selectedId);

        if (!opportunity) return;

        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            handleDeleteOpportunity(opportunity);
            break;
          case 'e':
            e.preventDefault();
            router.push(`/crm/opportunities/edit/${opportunity.id}`);
            break;
          case 'v':
            e.preventDefault();
            handleViewOpportunity(opportunity);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOpportunityIds, opportunities, router]);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    const matchesOwner = ownerFilter === 'all' || opp.owner === ownerFilter;

    const matchesAmountRange = (() => {
      const min = amountMinFilter ? parseFloat(amountMinFilter) : 0;
      const max = amountMaxFilter ? parseFloat(amountMaxFilter) : Infinity;
      return opp.amount >= min && opp.amount <= max;
    })();

    const matchesProbabilityRange = (() => {
      const min = probabilityMinFilter ? parseFloat(probabilityMinFilter) : 0;
      const max = probabilityMaxFilter ? parseFloat(probabilityMaxFilter) : 100;
      return opp.probability >= min && opp.probability <= max;
    })();

    const matchesCloseDateRange = (() => {
      if (!closeDateFromFilter && !closeDateToFilter) return true;
      const closeDate = new Date(opp.expectedCloseDate);
      const fromDate = closeDateFromFilter ? new Date(closeDateFromFilter) : new Date(0);
      const toDate = closeDateToFilter ? new Date(closeDateToFilter) : new Date('2100-12-31');
      return closeDate >= fromDate && closeDate <= toDate;
    })();

    return matchesSearch && matchesStage && matchesOwner && matchesAmountRange && matchesProbabilityRange && matchesCloseDateRange;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: opportunities.length,
    open: opportunities.filter((o) => !['closed_won', 'closed_lost'].includes(o.stage)).length,
    wonThisMonth: opportunities.filter((o) => {
      if (o.stage !== 'closed_won') return false;
      const closeDate = new Date(o.expectedCloseDate);
      const now = new Date();
      return closeDate.getMonth() === now.getMonth() && closeDate.getFullYear() === now.getFullYear();
    }).length,
    lostThisMonth: opportunities.filter((o) => {
      if (o.stage !== 'closed_lost') return false;
      const closeDate = new Date(o.expectedCloseDate);
      const now = new Date();
      return closeDate.getMonth() === now.getMonth() && closeDate.getFullYear() === now.getFullYear();
    }).length,
    totalPipeline: opportunities
      .filter((o) => !['closed_won', 'closed_lost'].includes(o.stage))
      .reduce((sum, o) => sum + o.amount, 0),
    wonValue: opportunities
      .filter((o) => o.stage === 'closed_won')
      .reduce((sum, o) => sum + o.amount, 0),
  };

  // Enhanced Delete Handler
  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    setOpportunityToDelete(opportunity);
    setShowDeleteDialog(true);
  };

  const confirmDeleteOpportunity = () => {
    if (opportunityToDelete) {
      setOpportunities(opportunities.filter((o) => o.id !== opportunityToDelete.id));
      setShowDeleteDialog(false);
      setOpportunityToDelete(null);
      addToast({
        title: 'Opportunity Deleted',
        message: `${opportunityToDelete.name} has been successfully deleted.`,
        variant: 'success'
      });
    }
  };

  // Bulk Operations Handlers
  const handleSelectOpportunity = (opportunityId: string) => {
    const newSelection = new Set(selectedOpportunityIds);
    if (newSelection.has(opportunityId)) {
      newSelection.delete(opportunityId);
    } else {
      newSelection.add(opportunityId);
    }
    setSelectedOpportunityIds(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedOpportunityIds.size === paginatedOpportunities.length) {
      setSelectedOpportunityIds(new Set());
    } else {
      setSelectedOpportunityIds(new Set(paginatedOpportunities.map(o => o.id)));
    }
  };

  const handleBulkDelete = () => {
    setOpportunities(opportunities.filter(o => !selectedOpportunityIds.has(o.id)));
    setShowBulkDeleteDialog(false);
    addToast({
      title: 'Opportunities Deleted',
      message: `${selectedOpportunityIds.size} opportunities have been successfully deleted.`,
      variant: 'success'
    });
    setSelectedOpportunityIds(new Set());
  };

  const handleBulkAssign = () => {
    if (!bulkAssignUser) return;

    setOpportunities(opportunities.map(opp =>
      selectedOpportunityIds.has(opp.id)
        ? { ...opp, owner: bulkAssignUser }
        : opp
    ));
    setShowBulkAssignDialog(false);
    addToast({
      title: 'Opportunities Assigned',
      message: `${selectedOpportunityIds.size} opportunities have been assigned to ${bulkAssignUser}.`,
      variant: 'success'
    });
    setSelectedOpportunityIds(new Set());
    setBulkAssignUser('');
  };

  const handleBulkStageChange = () => {
    setOpportunities(opportunities.map(opp =>
      selectedOpportunityIds.has(opp.id)
        ? { ...opp, stage: bulkStage }
        : opp
    ));
    setShowBulkStageDialog(false);
    addToast({
      title: 'Stage Updated',
      message: `${selectedOpportunityIds.size} opportunities have been updated to ${stageLabels[bulkStage]}.`,
      variant: 'success'
    });
    setSelectedOpportunityIds(new Set());
  };

  // Inline Stage Update with Reason Capture
  const handleStageClick = (opportunityId: string, newStage: Opportunity['stage']) => {
    // If moving to closed_won or closed_lost, show reason dialog
    if (newStage === 'closed_won' || newStage === 'closed_lost') {
      setStageTransition({ opportunityId, newStage });
      setShowStageReasonDialog(true);
      setStageDropdownOpen(null);
    } else {
      // Direct update for other stages
      handleStageChange(opportunityId, newStage);
    }
  };

  const handleStageChange = (opportunityId: string, newStage: Opportunity['stage'], reason?: string, comp?: string) => {
    setOpportunities(opportunities.map(opp =>
      opp.id === opportunityId
        ? {
            ...opp,
            stage: newStage,
            ...(newStage === 'closed_won' && reason ? { winReason: reason } : {}),
            ...(newStage === 'closed_lost' && reason ? { lossReason: reason, competitor: comp } : {}),
          }
        : opp
    ));
    setStageDropdownOpen(null);
    addToast({
      title: 'Stage Updated',
      message: `Opportunity stage has been updated to ${stageLabels[newStage]}.`,
      variant: 'success'
    });
  };

  const confirmStageTransition = () => {
    if (!stageTransition) return;

    if (stageTransition.newStage === 'closed_won') {
      if (!winReason.trim()) {
        addToast({
          title: 'Validation Error',
          message: 'Please provide a win reason.',
          variant: 'error'
        });
        return;
      }
      handleStageChange(stageTransition.opportunityId, stageTransition.newStage, winReason);
    } else if (stageTransition.newStage === 'closed_lost') {
      if (!lossReason.trim()) {
        addToast({
          title: 'Validation Error',
          message: 'Please provide a loss reason.',
          variant: 'error'
        });
        return;
      }
      handleStageChange(stageTransition.opportunityId, stageTransition.newStage, lossReason, competitor);
    }

    setShowStageReasonDialog(false);
    setStageTransition(null);
    setWinReason('');
    setLossReason('');
    setCompetitor('');
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Account', 'Stage', 'Amount', 'Probability', 'Expected Close Date', 'Owner', 'Created At'];
    const csvData = [
      headers.join(','),
      ...filteredOpportunities.map(opp => [
        opp.name,
        opp.account,
        opp.stage,
        opp.amount,
        opp.probability,
        opp.expectedCloseDate,
        opp.owner,
        opp.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opportunities-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    addToast({
      title: 'Export Successful',
      message: `${filteredOpportunities.length} opportunities exported to CSV.`,
      variant: 'success'
    });
  };

  // Export to Excel
  const handleExportExcel = () => {
    handleExportCSV();
  };

  // Save Filter
  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: {
        stage: stageFilter,
        owner: ownerFilter,
        amountMin: amountMinFilter,
        amountMax: amountMaxFilter,
        probabilityMin: probabilityMinFilter,
        probabilityMax: probabilityMaxFilter,
        closeDateFrom: closeDateFromFilter,
        closeDateTo: closeDateToFilter
      }
    };

    setSavedFilters([...savedFilters, newFilter]);
    setShowSaveFilterDialog(false);
    setFilterName('');
    addToast({
      title: 'Filter Saved',
      message: `Filter "${newFilter.name}" has been saved successfully.`,
      variant: 'success'
    });
  };

  // Load Saved Filter
  const loadSavedFilter = (filter: SavedFilter) => {
    setStageFilter(filter.filters.stage);
    setOwnerFilter(filter.filters.owner);
    setAmountMinFilter(filter.filters.amountMin);
    setAmountMaxFilter(filter.filters.amountMax);
    setProbabilityMinFilter(filter.filters.probabilityMin);
    setProbabilityMaxFilter(filter.filters.probabilityMax);
    setCloseDateFromFilter(filter.filters.closeDateFrom);
    setCloseDateToFilter(filter.filters.closeDateTo);
    addToast({
      title: 'Filter Loaded',
      message: `Filter "${filter.name}" has been applied.`,
      variant: 'info'
    });
  };

  // Clear Filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setStageFilter('all');
    setOwnerFilter('all');
    setAmountMinFilter('');
    setAmountMaxFilter('');
    setProbabilityMinFilter('');
    setProbabilityMaxFilter('');
    setCloseDateFromFilter('');
    setCloseDateToFilter('');
  };

  // Quick Actions
  const handleQuickCall = (opp: Opportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      title: 'Initiating Call',
      message: `Calling contact for ${opp.name}`,
      variant: 'info'
    });
  };

  const handleQuickEmail = (opp: Opportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      title: 'Opening Email',
      message: `Composing email for ${opp.account}`,
      variant: 'info'
    });
  };

  const handleViewQuote = (opp: Opportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      title: 'View Quote',
      message: `Opening quote for ${opp.name}`,
      variant: 'info'
    });
  };

  const handleScheduleMeeting = (opp: Opportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      title: 'Schedule Meeting',
      message: `Scheduling meeting for ${opp.name}`,
      variant: 'info'
    });
  };

  const handleViewOpportunity = (opp: Opportunity) => {
    router.push(`/crm/opportunities/view/${opp.id}`);
  };

  // Get impact analysis for delete
  const getDeleteImpactAnalysis = (opp: Opportunity) => {
    return [
      { label: 'Activities', count: 5 },
      { label: 'Quotes', count: 2 },
      { label: 'Documents', count: 4 },
      { label: 'Related Leads', count: 1 }
    ];
  };

  // Refresh function
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await OpportunityService.getAllOpportunities();
      setOpportunities(data);
      addToast({
        title: 'Refreshed',
        message: 'Opportunity data has been refreshed.',
        variant: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Refresh Failed',
        message: 'Unable to refresh data. Please try again.',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading skeleton on initial load
  if (isLoading && opportunities.length === 0) {
    return (
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 ">
      {/* Stats with Add Button */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Open Opportunities</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.open}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setStageFilter('closed_won')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Won This Month</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.wonThisMonth}</p>
                <p className="text-xs text-green-700 mt-1">${(stats.wonValue / 1000).toFixed(0)}K value</p>
              </div>
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setStageFilter('closed_lost')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Lost This Month</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{stats.lostThisMonth}</p>
                <p className="text-xs text-red-700 mt-1">Pipeline: ${(stats.totalPipeline / 1000).toFixed(0)}K</p>
              </div>
              <ThumbsDown className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/crm/opportunities/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedOpportunityIds.size > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedOpportunityIds.size} opportunit{selectedOpportunityIds.size > 1 ? 'ies' : 'y'} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBulkAssignDialog(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <UserPlus className="h-4 w-4" />
                <span>Assign</span>
              </button>
              <button
                onClick={() => setShowBulkStageDialog(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>Change Stage</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowBulkDeleteDialog(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => setSelectedOpportunityIds(new Set())}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stages</option>
            <option value="prospecting">Prospecting</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </select>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
              showAdvancedFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Advanced</span>
          </button>
          <button
            onClick={() => setShowImportDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          {(ownerFilter !== 'all' || amountMinFilter || amountMaxFilter || probabilityMinFilter || probabilityMaxFilter || closeDateFromFilter || closeDateToFilter) && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X className="h-5 w-5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                <select
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Owners</option>
                  {ASSIGNED_USERS.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount ($)</label>
                <input
                  type="number"
                  value={amountMinFilter}
                  onChange={(e) => setAmountMinFilter(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount ($)</label>
                <input
                  type="number"
                  value={amountMaxFilter}
                  onChange={(e) => setAmountMaxFilter(e.target.value)}
                  placeholder="999999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Probability (%)</label>
                <input
                  type="number"
                  value={probabilityMinFilter}
                  onChange={(e) => setProbabilityMinFilter(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Probability (%)</label>
                <input
                  type="number"
                  value={probabilityMaxFilter}
                  onChange={(e) => setProbabilityMaxFilter(e.target.value)}
                  placeholder="100"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Close Date From</label>
                <input
                  type="date"
                  value={closeDateFromFilter}
                  onChange={(e) => setCloseDateFromFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Close Date To</label>
                <input
                  type="date"
                  value={closeDateToFilter}
                  onChange={(e) => setCloseDateToFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-300">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSaveFilterDialog(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Filter</span>
                </button>

                {savedFilters.length > 0 && (
                  <select
                    onChange={(e) => {
                      const filter = savedFilters.find(f => f.id === e.target.value);
                      if (filter) loadSavedFilter(filter);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Load Saved Filter...</option>
                    {savedFilters.map(filter => (
                      <option key={filter.id} value={filter.id}>{filter.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <span className="text-sm text-gray-600">
                {filteredOpportunities.length} opportunit{filteredOpportunities.length !== 1 ? 'ies' : 'y'} found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOpportunityIds.size === paginatedOpportunities.length && paginatedOpportunities.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account/Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Close</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quick Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedOpportunities.map((opp) => (
              <tr
                key={opp.id}
                className={`hover:bg-gray-50 transition-colors ${selectedOpportunityIds.has(opp.id) ? 'bg-blue-50' : ''}`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOpportunityIds.has(opp.id)}
                    onChange={() => handleSelectOpportunity(opp.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{opp.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{opp.account}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStageDropdownOpen(stageDropdownOpen === opp.id ? null : opp.id);
                      }}
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${stageColors[opp.stage]} hover:opacity-80 transition-opacity cursor-pointer`}
                    >
                      {stageLabels[opp.stage]}
                    </button>

                    {stageDropdownOpen === opp.id && (
                      <div className="absolute z-10 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                        {OPPORTUNITY_STAGES.map(stage => (
                          <button
                            key={stage}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStageClick(opp.id, stage);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                              opp.stage === stage ? 'bg-gray-50 font-semibold' : ''
                            }`}
                          >
                            {stageLabels[stage]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">${opp.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-16">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${opp.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{opp.probability}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{opp.expectedCloseDate}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{opp.owner}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleQuickCall(opp, e)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Call"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleQuickEmail(opp, e)}
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      title="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleViewQuote(opp, e)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="View Quote"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleScheduleMeeting(opp, e)}
                      className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      title="Schedule Meeting"
                    >
                      <Video className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOpportunity(opp);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/crm/opportunities/edit/${opp.id}`);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOpportunity(opp);
                      }}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOpportunities.length)} of {filteredOpportunities.length} items
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
                .filter(page => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
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

      {/* Enhanced Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setOpportunityToDelete(null);
        }}
        onConfirm={confirmDeleteOpportunity}
        title="Delete Opportunity"
        message={`Are you sure you want to delete ${opportunityToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete Opportunity"
        variant="danger"
        impactAnalysis={opportunityToDelete ? getDeleteImpactAnalysis(opportunityToDelete) : undefined}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        isOpen={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Opportunities"
        message={`Are you sure you want to delete ${selectedOpportunityIds.size} opportunit${selectedOpportunityIds.size > 1 ? 'ies' : 'y'}? This action cannot be undone.`}
        confirmLabel="Delete All"
        variant="danger"
      />

      {/* Bulk Assign Dialog */}
      {showBulkAssignDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Opportunities</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign {selectedOpportunityIds.size} opportunit{selectedOpportunityIds.size > 1 ? 'ies' : 'y'} to:
            </p>
            <select
              value={bulkAssignUser}
              onChange={(e) => setBulkAssignUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="">Select User...</option>
              {ASSIGNED_USERS.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowBulkAssignDialog(false);
                  setBulkAssignUser('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAssign}
                disabled={!bulkAssignUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Stage Change Dialog */}
      {showBulkStageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Stage</h3>
            <p className="text-sm text-gray-600 mb-4">
              Change stage for {selectedOpportunityIds.size} opportunit{selectedOpportunityIds.size > 1 ? 'ies' : 'y'} to:
            </p>
            <select
              value={bulkStage}
              onChange={(e) => setBulkStage(e.target.value as Opportunity['stage'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {OPPORTUNITY_STAGES.map(stage => (
                <option key={stage} value={stage}>
                  {stageLabels[stage]}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBulkStageDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkStageChange}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Update Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveFilterDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Filter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Give your filter a name to save it for future use.
            </p>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Filter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowSaveFilterDialog(false);
                  setFilterName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Import Opportunities</h3>
              <button
                onClick={() => setShowImportDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your CSV or Excel file here, or click to browse
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Choose File
              </button>
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">Import Requirements:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>- File must be in CSV or Excel format</li>
                <li>- Required columns: Name, Account, Stage, Amount, Probability</li>
                <li>- Optional columns: Expected Close Date, Owner</li>
                <li>- Maximum 1000 opportunities per import</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Stage Transition with Reason Dialog */}
      {showStageReasonDialog && stageTransition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              {stageTransition.newStage === 'closed_won' ? (
                <Trophy className="h-6 w-6 text-green-600 mr-2" />
              ) : (
                <ThumbsDown className="h-6 w-6 text-red-600 mr-2" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {stageTransition.newStage === 'closed_won' ? 'Mark as Won' : 'Mark as Lost'}
              </h3>
            </div>

            {stageTransition.newStage === 'closed_won' ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Please provide details about why this opportunity was won:
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Win Reason *</label>
                  <textarea
                    value={winReason}
                    onChange={(e) => setWinReason(e.target.value)}
                    placeholder="e.g., Competitive pricing, superior product quality, strong relationship..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Please provide details about why this opportunity was lost:
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loss Reason *</label>
                  <textarea
                    value={lossReason}
                    onChange={(e) => setLossReason(e.target.value)}
                    placeholder="e.g., Price too high, went with competitor, timing not right..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={4}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competitor (Optional)</label>
                  <input
                    type="text"
                    value={competitor}
                    onChange={(e) => setCompetitor(e.target.value)}
                    placeholder="Which competitor did they choose?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowStageReasonDialog(false);
                  setStageTransition(null);
                  setWinReason('');
                  setLossReason('');
                  setCompetitor('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStageTransition}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  stageTransition.newStage === 'closed_won'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {stageTransition.newStage === 'closed_won' ? 'Confirm Win' : 'Confirm Loss'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {selectedOpportunityIds.size === 1 && (
        <div className="fixed bottom-4 left-4 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-1">Keyboard Shortcuts:</p>
          <p>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">D</kbd> to Delete</p>
          <p>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">E</kbd> to Edit</p>
          <p>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">V</kbd> to View</p>
        </div>
      )}
    </div>
  );
}
