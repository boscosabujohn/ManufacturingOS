'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  TrendingUp,
  Link2,
  Package,
  IndianRupee,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight
} from 'lucide-react';
import {
  AnalyticsModal,
  CreateCampaignModal,
  CrossSellOpportunity as CrossSellOpportunityType
} from '@/components/cpq/CrossSellModals';

interface CrossSellOpportunity {
  id: string;
  primaryProduct: {
    code: string;
    name: string;
    category: string;
    value: number;
  };
  suggestedProduct: {
    code: string;
    name: string;
    category: string;
    value: number;
  };
  relationship: 'complement' | 'essential' | 'upgrade' | 'bundle';
  coOccurrenceRate: number;
  avgAdditionalRevenue: number;
  conversionRate: number;
  customersCount: number;
  totalOpportunityValue: number;
  recommendationStrength: 'strong' | 'medium' | 'weak';
  activeCampaigns: number;
  lastUpdated: string;
}

export default function CrossSellPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelationship, setFilterRelationship] = useState<string>('all');
  const [filterStrength, setFilterStrength] = useState<'all' | 'strong' | 'medium' | 'weak'>('all');

  // Modal states
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<CrossSellOpportunity | null>(null);

  const [opportunities, setOpportunities] = useState<CrossSellOpportunity[]>([
    {
      id: '1',
      primaryProduct: {
        code: 'KIT-SINK-001',
        name: 'Premium SS304 Kitchen Sink - Double Bowl',
        category: 'Kitchen Sinks',
        value: 18500
      },
      suggestedProduct: {
        code: 'KIT-FAUC-001',
        name: 'Chrome Finish Kitchen Faucet - Single Lever',
        category: 'Kitchen Faucets',
        value: 8500
      },
      relationship: 'complement',
      coOccurrenceRate: 87.5,
      avgAdditionalRevenue: 8350,
      conversionRate: 76.8,
      customersCount: 142,
      totalOpportunityValue: 1185700,
      recommendationStrength: 'strong',
      activeCampaigns: 3,
      lastUpdated: '2025-10-18'
    },
    {
      id: '2',
      primaryProduct: {
        code: 'KIT-CAB-001',
        name: 'Modular Base Cabinet - 3 Drawer',
        category: 'Kitchen Cabinets',
        value: 28500
      },
      suggestedProduct: {
        code: 'KIT-ACC-001',
        name: 'Modular Kitchen Organizer Set - Premium',
        category: 'Kitchen Accessories',
        value: 12500
      },
      relationship: 'complement',
      coOccurrenceRate: 82.3,
      avgAdditionalRevenue: 11850,
      conversionRate: 79.2,
      customersCount: 167,
      totalOpportunityValue: 1979950,
      recommendationStrength: 'strong',
      activeCampaigns: 2,
      lastUpdated: '2025-10-17'
    },
    {
      id: '3',
      primaryProduct: {
        code: 'KIT-APPL-001',
        name: 'Auto-Clean Kitchen Chimney - 90cm',
        category: 'Kitchen Appliances',
        value: 45000
      },
      suggestedProduct: {
        code: 'KIT-APPL-002',
        name: 'Built-in Microwave Oven - 30L',
        category: 'Kitchen Appliances',
        value: 38500
      },
      relationship: 'bundle',
      coOccurrenceRate: 68.4,
      avgAdditionalRevenue: 36250,
      conversionRate: 64.5,
      customersCount: 98,
      totalOpportunityValue: 3552500,
      recommendationStrength: 'strong',
      activeCampaigns: 1,
      lastUpdated: '2025-10-16'
    },
    {
      id: '4',
      primaryProduct: {
        code: 'KIT-COUNT-001',
        name: 'Granite Countertop - Premium Black Galaxy',
        category: 'Countertops',
        value: 185000
      },
      suggestedProduct: {
        code: 'KIT-SINK-003',
        name: 'Undermount SS Sink - Single Bowl Large',
        category: 'Kitchen Sinks',
        value: 22500
      },
      relationship: 'essential',
      coOccurrenceRate: 94.2,
      avgAdditionalRevenue: 21850,
      conversionRate: 88.7,
      customersCount: 124,
      totalOpportunityValue: 2709400,
      recommendationStrength: 'strong',
      activeCampaigns: 4,
      lastUpdated: '2025-10-19'
    },
    {
      id: '5',
      primaryProduct: {
        code: 'KIT-COOK-001',
        name: 'Professional Cookware Set - 7 Piece',
        category: 'Cookware',
        value: 15500
      },
      suggestedProduct: {
        code: 'KIT-ACC-003',
        name: 'Kitchen Knife Set - German Steel 8 Piece',
        category: 'Kitchen Accessories',
        value: 9500
      },
      relationship: 'complement',
      coOccurrenceRate: 71.8,
      avgAdditionalRevenue: 8950,
      conversionRate: 68.3,
      customersCount: 189,
      totalOpportunityValue: 1691550,
      recommendationStrength: 'medium',
      activeCampaigns: 2,
      lastUpdated: '2025-10-15'
    },
    {
      id: '6',
      primaryProduct: {
        code: 'KIT-FAUC-001',
        name: 'Chrome Finish Kitchen Faucet - Single Lever',
        category: 'Kitchen Faucets',
        value: 8500
      },
      suggestedProduct: {
        code: 'KIT-ACC-004',
        name: 'Water Filter - Under Sink Mount',
        category: 'Kitchen Accessories',
        value: 6800
      },
      relationship: 'complement',
      coOccurrenceRate: 58.9,
      avgAdditionalRevenue: 6350,
      conversionRate: 55.2,
      customersCount: 234,
      totalOpportunityValue: 1485900,
      recommendationStrength: 'medium',
      activeCampaigns: 1,
      lastUpdated: '2025-10-14'
    },
    {
      id: '7',
      primaryProduct: {
        code: 'KIT-CAB-001',
        name: 'Modular Base Cabinet - 3 Drawer',
        category: 'Kitchen Cabinets',
        value: 28500
      },
      suggestedProduct: {
        code: 'KIT-CAB-004',
        name: 'Wall Cabinet - Glass Door Double',
        category: 'Kitchen Cabinets',
        value: 18900
      },
      relationship: 'bundle',
      coOccurrenceRate: 76.5,
      avgAdditionalRevenue: 17850,
      conversionRate: 72.4,
      customersCount: 156,
      totalOpportunityValue: 2784600,
      recommendationStrength: 'strong',
      activeCampaigns: 2,
      lastUpdated: '2025-10-13'
    },
    {
      id: '8',
      primaryProduct: {
        code: 'KIT-APPL-001',
        name: 'Auto-Clean Kitchen Chimney - 90cm',
        category: 'Kitchen Appliances',
        value: 45000
      },
      suggestedProduct: {
        code: 'KIT-APPL-007',
        name: 'Built-in Gas Hob - 4 Burner',
        category: 'Kitchen Appliances',
        value: 28500
      },
      relationship: 'essential',
      coOccurrenceRate: 91.7,
      avgAdditionalRevenue: 27250,
      conversionRate: 85.3,
      customersCount: 145,
      totalOpportunityValue: 3951250,
      recommendationStrength: 'strong',
      activeCampaigns: 3,
      lastUpdated: '2025-10-12'
    },
    {
      id: '9',
      primaryProduct: {
        code: 'KIT-SINK-001',
        name: 'Premium SS304 Kitchen Sink - Double Bowl',
        category: 'Kitchen Sinks',
        value: 18500
      },
      suggestedProduct: {
        code: 'KIT-ACC-005',
        name: 'Sink Drain Basket & Accessories Kit',
        category: 'Kitchen Accessories',
        value: 2500
      },
      relationship: 'essential',
      coOccurrenceRate: 89.3,
      avgAdditionalRevenue: 2350,
      conversionRate: 84.7,
      customersCount: 198,
      totalOpportunityValue: 465300,
      recommendationStrength: 'strong',
      activeCampaigns: 1,
      lastUpdated: '2025-10-11'
    },
    {
      id: '10',
      primaryProduct: {
        code: 'KIT-APPL-002',
        name: 'Built-in Microwave Oven - 30L',
        category: 'Kitchen Appliances',
        value: 38500
      },
      suggestedProduct: {
        code: 'KIT-APPL-008',
        name: 'Microwave Cookware Set - Premium',
        category: 'Kitchen Accessories',
        value: 4500
      },
      relationship: 'complement',
      coOccurrenceRate: 48.2,
      avgAdditionalRevenue: 4150,
      conversionRate: 45.8,
      customersCount: 167,
      totalOpportunityValue: 693050,
      recommendationStrength: 'weak',
      activeCampaigns: 0,
      lastUpdated: '2025-10-10'
    },
    {
      id: '11',
      primaryProduct: {
        code: 'KIT-CAB-001',
        name: 'Modular Base Cabinet - 3 Drawer',
        category: 'Kitchen Cabinets',
        value: 28500
      },
      suggestedProduct: {
        code: 'KIT-CAB-005',
        name: 'Soft-Close Drawer Mechanism Upgrade',
        category: 'Cabinet Hardware',
        value: 5800
      },
      relationship: 'upgrade',
      coOccurrenceRate: 62.5,
      avgAdditionalRevenue: 5450,
      conversionRate: 58.9,
      customersCount: 178,
      totalOpportunityValue: 970100,
      recommendationStrength: 'medium',
      activeCampaigns: 1,
      lastUpdated: '2025-10-09'
    },
    {
      id: '12',
      primaryProduct: {
        code: 'KIT-COUNT-001',
        name: 'Granite Countertop - Premium Black Galaxy',
        category: 'Countertops',
        value: 185000
      },
      suggestedProduct: {
        code: 'KIT-ACC-006',
        name: 'Granite Sealer & Maintenance Kit',
        category: 'Kitchen Accessories',
        value: 3500
      },
      relationship: 'essential',
      coOccurrenceRate: 73.8,
      avgAdditionalRevenue: 3250,
      conversionRate: 69.4,
      customersCount: 142,
      totalOpportunityValue: 461500,
      recommendationStrength: 'medium',
      activeCampaigns: 2,
      lastUpdated: '2025-10-08'
    }
  ]);

  const relationships = ['all', 'complement', 'essential', 'upgrade', 'bundle'];

  // Handlers
  const handleViewAnalytics = (opportunity: CrossSellOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsAnalyticsOpen(true);
  };

  const handleCreateCampaign = (opportunity?: CrossSellOpportunity) => {
    setSelectedOpportunity(opportunity || null);
    setIsCampaignOpen(true);
  };

  const handleSaveCampaign = (campaign: any) => {
    console.log('Campaign saved:', campaign);
    setIsCampaignOpen(false);
    setSelectedOpportunity(null);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch =
      opp.primaryProduct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.suggestedProduct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.primaryProduct.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.suggestedProduct.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRelationship = filterRelationship === 'all' || opp.relationship === filterRelationship;
    const matchesStrength = filterStrength === 'all' || opp.recommendationStrength === filterStrength;

    return matchesSearch && matchesRelationship && matchesStrength;
  });

  const getRelationshipBadge = (relationship: string) => {
    const badges = {
      complement: { color: 'bg-blue-100 text-blue-800', icon: Link2, label: 'Complement' },
      essential: { color: 'bg-red-100 text-red-800', icon: CheckCircle2, label: 'Essential' },
      upgrade: { color: 'bg-purple-100 text-purple-800', icon: TrendingUp, label: 'Upgrade' },
      bundle: { color: 'bg-green-100 text-green-800', icon: Package, label: 'Bundle' }
    };
    return badges[relationship as keyof typeof badges] || badges.complement;
  };

  const getStrengthColor = (strength: string) => {
    const colors = {
      strong: 'text-green-600',
      medium: 'text-orange-600',
      weak: 'text-gray-600'
    };
    return colors[strength as keyof typeof colors] || colors.medium;
  };

  // Summary stats
  const totalOpportunities = opportunities.length;
  const totalValue = opportunities.reduce((sum, o) => sum + o.totalOpportunityValue, 0);
  const avgConversion = opportunities.reduce((sum, o) => sum + o.conversionRate, 0) / totalOpportunities;
  const strongOpportunities = opportunities.filter(o => o.recommendationStrength === 'strong').length;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cross-Sell Opportunities</h1>
            <p className="text-sm text-gray-600">Identify and capitalize on product pairing opportunities</p>
          </div>
        </div>
        <button
          onClick={() => handleCreateCampaign()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total Opportunities</span>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalOpportunities}</div>
          <div className="text-xs text-blue-700 mt-1">{strongOpportunities} strong matches</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Total Value</span>
            <IndianRupee className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">₹{(totalValue / 10000000).toFixed(1)}Cr</div>
          <div className="text-xs text-green-700 mt-1">Revenue potential</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Avg Conversion</span>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{avgConversion.toFixed(1)}%</div>
          <div className="text-xs text-purple-700 mt-1">Success rate</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-900">Active Campaigns</span>
            <Sparkles className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {opportunities.reduce((sum, o) => sum + o.activeCampaigns, 0)}
          </div>
          <div className="text-xs text-orange-700 mt-1">Running now</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search product pairings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRelationship}
            onChange={(e) => setFilterRelationship(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {relationships.map(rel => (
              <option key={rel} value={rel}>
                {rel === 'all' ? 'All Relationships' : rel.charAt(0).toUpperCase() + rel.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterStrength}
            onChange={(e) => setFilterStrength(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Strengths</option>
            <option value="strong">Strong</option>
            <option value="medium">Medium</option>
            <option value="weak">Weak</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => {
          const relInfo = getRelationshipBadge(opp.relationship);
          const RelIcon = relInfo.icon;
          return (
            <div key={opp.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${relInfo.color}`}>
                    <RelIcon className="h-3 w-3" />
                    {relInfo.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`text-sm font-medium ${getStrengthColor(opp.recommendationStrength)}`}>
                      {opp.recommendationStrength.toUpperCase()} Match
                    </div>
                    {opp.activeCampaigns > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Sparkles className="h-3 w-3" />
                        {opp.activeCampaigns} Active Campaign{opp.activeCampaigns > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Pairing */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4">
                  {/* Primary Product */}
                  <div className="md:col-span-2 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="text-xs text-blue-700 mb-1">Primary Product</div>
                        <h4 className="font-semibold text-gray-900">{opp.primaryProduct.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <span>{opp.primaryProduct.code}</span>
                          <span>•</span>
                          <span className="font-medium text-blue-900">₹{opp.primaryProduct.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>

                  {/* Suggested Product */}
                  <div className="md:col-span-2 bg-green-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <div className="text-xs text-green-700 mb-1">Suggested Cross-Sell</div>
                        <h4 className="font-semibold text-gray-900">{opp.suggestedProduct.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <span>{opp.suggestedProduct.code}</span>
                          <span>•</span>
                          <span className="font-medium text-green-900">₹{opp.suggestedProduct.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Co-Occurrence</div>
                    <div className="text-lg font-bold text-gray-900">{opp.coOccurrenceRate.toFixed(1)}%</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Conversion Rate</div>
                    <div className="text-lg font-bold text-green-900">{opp.conversionRate.toFixed(1)}%</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Avg Revenue</div>
                    <div className="text-lg font-bold text-blue-900">₹{(opp.avgAdditionalRevenue / 1000).toFixed(1)}K</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Customers</div>
                    <div className="text-lg font-bold text-purple-900">{opp.customersCount}</div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
                    <div className="text-xs text-orange-700 mb-1">Total Opportunity</div>
                    <div className="text-lg font-bold text-orange-900">₹{(opp.totalOpportunityValue / 100000).toFixed(1)}L</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Last updated: {opp.lastUpdated}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewAnalytics(opp)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      View Analytics
                    </button>
                    <button
                      onClick={() => handleCreateCampaign(opp)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Campaign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredOpportunities.length} of {totalOpportunities} cross-sell opportunities
      </div>

      {/* Modals */}
      {selectedOpportunity && (
        <AnalyticsModal
          isOpen={isAnalyticsOpen}
          onClose={() => {
            setIsAnalyticsOpen(false);
            setSelectedOpportunity(null);
          }}
          opportunity={selectedOpportunity}
        />
      )}

      <CreateCampaignModal
        isOpen={isCampaignOpen}
        onClose={() => {
          setIsCampaignOpen(false);
          setSelectedOpportunity(null);
        }}
        onSave={handleSaveCampaign}
        opportunity={selectedOpportunity || undefined}
      />
    </div>
  );
}
