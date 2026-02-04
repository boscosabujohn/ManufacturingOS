'use client';

import { useState, useMemo } from 'react';
import { Wrench, Search, AlertCircle, CheckCircle, Clock, Zap, Plus, Filter, ChevronDown, ChevronUp, Lightbulb, Target, BookOpen } from 'lucide-react';

interface TroubleshootingGuide {
  id: string;
  title: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: number; // in minutes
  category: string;
  relatedProducts: string[];
  successRate: number; // percentage
  views: number;
  helpful: number;
  createdDate: string;
  updatedDate: string;
  requiresService: boolean;
}

const mockGuides: TroubleshootingGuide[] = [
  {
    id: '1',
    title: 'Refrigerator Not Cooling - Complete Diagnosis',
    symptoms: [
      'Warm temperature inside refrigerator',
      'Ice cream melting faster than usual',
      'Condensation on walls',
      'Motor running continuously'
    ],
    causes: [
      'Blocked air vents',
      'Dirty condenser coils',
      'Faulty thermostat',
      'Refrigerant leak',
      'Compressor failure'
    ],
    solutions: [
      'Check and clear air vents inside the refrigerator',
      'Clean the condenser coils at the back (unplug first)',
      'Verify temperature setting is correct (3-4°C)',
      'Listen for unusual compressor noise',
      'Check for frost buildup in the freezer section',
      'If problem persists, contact service center'
    ],
    difficulty: 'medium',
    timeEstimate: 15,
    category: 'Refrigeration',
    relatedProducts: ['REF-2025-PRO', 'REF-2024-STD'],
    successRate: 78,
    views: 1245,
    helpful: 234,
    createdDate: '2025-08-15',
    updatedDate: '2025-10-18',
    requiresService: true
  },
  {
    id: '2',
    title: 'Microwave Not Heating - Quick Fix Guide',
    symptoms: [
      'Food not heating',
      'Microwave runs but stays cold',
      'Uneven heating patterns'
    ],
    causes: [
      'Power supply issue',
      'Faulty magnetron',
      'Damaged door seal',
      'High voltage circuit failure'
    ],
    solutions: [
      'Ensure microwave is properly plugged in',
      'Check circuit breaker and reset if needed',
      'Verify door closes properly and seal is intact',
      'Place a glass of water inside and run for 2 minutes - it should heat',
      'If water remains cold, magnetron likely needs replacement',
      'Contact authorized service center'
    ],
    difficulty: 'hard',
    timeEstimate: 10,
    category: 'Cooking',
    relatedProducts: ['MW-QS-2025', 'MW-SMART-2025'],
    successRate: 45,
    views: 892,
    helpful: 145,
    createdDate: '2025-08-10',
    updatedDate: '2025-10-17',
    requiresService: true
  },
  {
    id: '3',
    title: 'Washing Machine Leaking Water',
    symptoms: [
      'Water leaking from bottom',
      'Water leaking from door',
      'Puddles during wash cycle',
      'Error code E2 displayed'
    ],
    causes: [
      'Damaged door seal',
      'Clogged drain hose',
      'Loose inlet hose connection',
      'Crack in tub',
      'Failed pump seal'
    ],
    solutions: [
      'Stop immediately and disconnect power',
      'Check drain hose for kinks or blockages',
      'Tighten inlet hose connections at back',
      'Inspect door gasket for tears or dirt',
      'Clean gasket with damp cloth and dry thoroughly',
      'Run empty wash cycle to test',
      'If still leaking, contact service technician'
    ],
    difficulty: 'easy',
    timeEstimate: 20,
    category: 'Laundry',
    relatedProducts: ['WM-ADV-2025', 'WM-COMPACT-2024'],
    successRate: 68,
    views: 1567,
    helpful: 289,
    createdDate: '2025-08-05',
    updatedDate: '2025-10-16',
    requiresService: true
  },
  {
    id: '4',
    title: 'Dishwasher Not Draining Properly',
    symptoms: [
      'Water pooling at bottom',
      'Dishes still wet after cycle',
      'Gurgling sounds',
      'Foul odor from interior'
    ],
    causes: [
      'Clogged filter',
      'Blocked drain hose',
      'Faulty drain pump',
      'Kinked hose',
      'Food debris in drain'
    ],
    solutions: [
      'Remove and rinse the drain filter',
      'Check drain hose for kinks behind dishwasher',
      'Run a hot cycle with white vinegar (no dishes)',
      'Use a plumbing snake to clear blockage if needed',
      'Ensure drain hose connection is not pinched',
      'Check sink drain is not blocked',
      'If problem persists, pump replacement may be needed'
    ],
    difficulty: 'medium',
    timeEstimate: 25,
    category: 'Dishwashing',
    relatedProducts: ['DW-TROUBLESHOOT', 'DW-SMART-2025'],
    successRate: 72,
    views: 734,
    helpful: 156,
    createdDate: '2025-07-30',
    updatedDate: '2025-10-15',
    requiresService: true
  },
  {
    id: '5',
    title: 'Oven Temperature Fluctuations',
    symptoms: [
      'Uneven cooking inside oven',
      'Food burning on one side',
      'Temperature displayed incorrectly',
      'Oven doesn\'t reach set temperature'
    ],
    causes: [
      'Faulty temperature sensor',
      'Uneven rack placement',
      'Dirty interior affecting heat circulation',
      'Heating element malfunction',
      'Thermostat calibration drift'
    ],
    solutions: [
      'Clean the oven interior to ensure proper air circulation',
      'Check that racks are properly seated',
      'Place oven rack in center position for more even heating',
      'Let oven preheat fully before cooking (15-20 minutes)',
      'Use oven thermometer to verify actual temperature',
      'If significantly off, sensor or heating element may need replacement',
      'Contact technician for calibration or part replacement'
    ],
    difficulty: 'medium',
    timeEstimate: 30,
    category: 'Cooking',
    relatedProducts: ['OVN-2025-PRO', 'OVN-COMPACT-2024'],
    successRate: 65,
    views: 567,
    helpful: 112,
    createdDate: '2025-07-25',
    updatedDate: '2025-10-14',
    requiresService: true
  },
  {
    id: '6',
    title: 'Washing Machine Strange Noises',
    symptoms: [
      'Grinding or squealing sounds',
      'Thumping during spin cycle',
      'Rattling noises',
      'High-pitched beeping'
    ],
    causes: [
      'Foreign object in drum',
      'Worn drum bearing',
      'Unbalanced load',
      'Worn pump impeller',
      'Faulty motor bearing'
    ],
    solutions: [
      'Stop the wash cycle immediately',
      'Check for coins, buttons, or small objects in drum',
      'Inspect drum for visible damage or rust',
      'Ensure load is balanced and not overloaded',
      'Run empty spin cycle to listen for noise',
      'If grinding noise continues, bearing replacement needed',
      'Call technician if noise comes from motor area'
    ],
    difficulty: 'easy',
    timeEstimate: 15,
    category: 'Laundry',
    relatedProducts: ['WM-ADV-2025', 'WM-COMPACT-2024'],
    successRate: 55,
    views: 823,
    helpful: 178,
    createdDate: '2025-07-20',
    updatedDate: '2025-10-13',
    requiresService: true
  },
  {
    id: '7',
    title: 'Refrigerator Ice Maker Not Working',
    symptoms: [
      'No ice production',
      'Ice maker running but no ice',
      'Slow ice production',
      'Ice has strange taste or smell'
    ],
    causes: [
      'Water supply line frozen',
      'Clogged water filter',
      'Low water pressure',
      'Faulty water inlet valve',
      'Ice maker module failure'
    ],
    solutions: [
      'Check water filter - replace if clogged or discolored',
      'Verify main water valve is fully open',
      'Test water supply by holding a glass under dispenser',
      'Ensure water supply line is not kinked',
      'Clean ice maker module with warm water',
      'Check for ice blockage in inlet',
      'Reset ice maker by turning off/on from control panel',
      'If no improvement, inlet valve or module needs replacement'
    ],
    difficulty: 'medium',
    timeEstimate: 20,
    category: 'Refrigeration',
    relatedProducts: ['REF-2025-PRO', 'REF-ICE-2024'],
    successRate: 71,
    views: 656,
    helpful: 134,
    createdDate: '2025-07-15',
    updatedDate: '2025-10-12',
    requiresService: true
  },
  {
    id: '8',
    title: 'Smart Appliance App Connection Issues',
    symptoms: [
      'Cannot connect to WiFi',
      'App shows offline status',
      'Commands not received by appliance',
      'Frequent disconnections'
    ],
    causes: [
      'WiFi network issue',
      'Appliance out of range',
      'Outdated app version',
      'Network authentication issue',
      'Appliance firmware outdated'
    ],
    solutions: [
      'Restart both appliance and WiFi router',
      'Ensure appliance is within WiFi range',
      'Update app to latest version from app store',
      'Forget WiFi on appliance and reconnect',
      'Check WiFi password is entered correctly',
      'Update appliance firmware if available',
      'Verify no MAC address filtering on router',
      'Contact support if connection still fails'
    ],
    difficulty: 'easy',
    timeEstimate: 10,
    category: 'Technology',
    relatedProducts: ['SMART-2025', 'SMART-HUB-2024'],
    successRate: 82,
    views: 945,
    helpful: 267,
    createdDate: '2025-07-10',
    updatedDate: '2025-10-11',
    requiresService: false
  }
];

export default function TroubleshootingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'views'>('helpful');

  const categories = ['Refrigeration', 'Cooking', 'Laundry', 'Dishwashing', 'Technology'];
  const difficulties = ['easy', 'medium', 'hard'];

  const filteredGuides = useMemo(() => {
    let filtered = mockGuides.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort
    if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    } else if (sortBy === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    } else {
      filtered.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const stats = {
    total: mockGuides.length,
    easy: mockGuides.filter(g => g.difficulty === 'easy').length,
    medium: mockGuides.filter(g => g.difficulty === 'medium').length,
    hard: mockGuides.filter(g => g.difficulty === 'hard').length,
    avgSuccessRate: (mockGuides.reduce((sum, g) => sum + g.successRate, 0) / mockGuides.length).toFixed(0)
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="h-8 w-8 text-emerald-600" />
            Troubleshooting Guide
          </h1>
          <p className="text-gray-600 mt-1">Diagnose and resolve common appliance issues</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus className="h-5 w-5" />
          New Guide
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Guides</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Easy</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.easy}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.medium}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hard</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.hard}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Success</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.avgSuccessRate}%</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by symptom, issue, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard / Requires Service</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="helpful">Most Helpful</option>
                <option value="views">Most Viewed</option>
                <option value="recent">Recently Updated</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Guides */}
      <div className="space-y-4">
        {filteredGuides.map((guide) => (
          <div key={guide.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === guide.id ? null : guide.id)}
              className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                    {guide.difficulty.toUpperCase()}
                  </span>
                  {guide.requiresService && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">May Need Service</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{guide.symptoms.slice(0, 2).join(' • ')}</p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{guide.category}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {guide.timeEstimate} min
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {guide.successRate}% success
                  </div>
                  <div className="text-gray-500">{guide.views} views</div>
                </div>
              </div>

              <div className="ml-6">
                {expandedId === guide.id ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </button>

            {expandedId === guide.id && (
              <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Common Symptoms
                  </h4>
                  <ul className="space-y-2">
                    {guide.symptoms.map((symptom, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">•</span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    Possible Causes
                  </h4>
                  <ul className="space-y-2">
                    {guide.causes.map((cause, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-emerald-600" />
                    Step-by-Step Solutions
                  </h4>
                  <ol className="space-y-2">
                    {guide.solutions.map((solution, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-3">
                        <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">{idx + 1}</span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-2"><strong>Related Products:</strong></p>
                  <div className="flex flex-wrap gap-2">
                    {guide.relatedProducts.map(product => (
                      <span key={product} className="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Was this helpful?</p>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Yes ({guide.helpful})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredGuides.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <Wrench className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">No troubleshooting guides found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
