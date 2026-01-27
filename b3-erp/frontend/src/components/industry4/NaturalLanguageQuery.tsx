'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Package,
  Wrench,
  Users,
  DollarSign,
  Target,
  HelpCircle,
  X,
  ChevronRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Loader2,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface QueryResult {
  id: string;
  query: string;
  answer: string;
  visualType?: 'chart' | 'table' | 'metric' | 'list';
  data?: Record<string, number | string>[] | number;
  insights?: string[];
  relatedQueries?: string[];
  confidence: number;
  timestamp: Date;
}

export interface SuggestedQuery {
  query: string;
  category: string;
  icon: React.ElementType;
}

export interface NaturalLanguageQueryProps {
  onQuerySubmit?: (query: string) => void;
  placeholder?: string;
}

// ============================================================================
// Suggested Queries
// ============================================================================

const suggestedQueries: SuggestedQuery[] = [
  { query: 'Show me defect trends for Line 2 this month', category: 'Quality', icon: Target },
  { query: 'What is the current OEE across all lines?', category: 'Efficiency', icon: BarChart3 },
  { query: 'Which machines need maintenance soon?', category: 'Maintenance', icon: Wrench },
  { query: 'Compare production output week over week', category: 'Production', icon: TrendingUp },
  { query: 'What are the top 5 causes of downtime?', category: 'Analytics', icon: AlertTriangle },
  { query: 'Show inventory levels below reorder point', category: 'Inventory', icon: Package },
  { query: 'Who are the top performing operators?', category: 'Workforce', icon: Users },
  { query: 'What is the cost per unit trend?', category: 'Cost', icon: DollarSign },
];

// ============================================================================
// Query History Item Component
// ============================================================================

function QueryHistoryItem({
  result,
  onClick,
}: {
  result: QueryResult;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs text-gray-500">
          {result.timestamp.toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm text-gray-900 dark:text-white truncate">{result.query}</p>
    </button>
  );
}

// ============================================================================
// Result Card Component
// ============================================================================

function ResultCard({
  result,
  onFeedback,
  onCopy,
  onRelatedQuery,
}: {
  result: QueryResult;
  onFeedback?: (helpful: boolean) => void;
  onCopy?: () => void;
  onRelatedQuery?: (query: string) => void;
}) {
  const renderVisualization = () => {
    if (!result.data) return null;

    switch (result.visualType) {
      case 'metric':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(result.data) && result.data.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-indigo-600">{Object.values(item)[1]}</p>
                <p className="text-sm text-gray-500">{Object.values(item)[0]}</p>
              </div>
            ))}
          </div>
        );

      case 'chart':
        // Simplified bar chart visualization
        return (
          <div className="h-48 flex items-end gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {Array.isArray(result.data) && result.data.map((item, index) => {
              const value = Number(Object.values(item)[1]);
              const dataArray = result.data as Record<string, number | string>[];
              const maxValue = Math.max(...dataArray.map((d: Record<string, number | string>) => Number(Object.values(d)[1])));
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-indigo-500 rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 truncate w-full text-center">
                    {Object.values(item)[0]}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {Array.isArray(result.data) && result.data[0] && Object.keys(result.data[0]).map((key, index) => (
                    <th key={index} className="px-4 py-2 text-left text-gray-500 font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(result.data) && result.data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-100 dark:border-gray-700/50">
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 text-gray-900 dark:text-white">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'list':
        return (
          <ul className="space-y-2">
            {Array.isArray(result.data) && result.data.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">{Object.values(item).join(': ')}</span>
              </li>
            ))}
          </ul>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Query */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{result.query}</span>
        </div>
      </div>

      {/* Answer */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white">{result.answer}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">Confidence: {result.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Visualization */}
        {result.data && (
          <div className="mb-4">
            {renderVisualization()}
          </div>
        )}

        {/* Insights */}
        {result.insights && result.insights.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Key Insights
            </h4>
            <ul className="space-y-1">
              {result.insights.map((insight, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Queries */}
        {result.relatedQueries && result.relatedQueries.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Related Questions
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.relatedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => onRelatedQuery?.(query)}
                  className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {result.timestamp.toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Copy answer"
          >
            <Copy className="w-4 h-4 text-gray-400" />
          </button>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          <span className="text-xs text-gray-500">Helpful?</span>
          <button
            onClick={() => onFeedback?.(true)}
            className="p-1.5 hover:bg-green-100 rounded transition-colors"
          >
            <ThumbsUp className="w-4 h-4 text-gray-400 hover:text-green-600" />
          </button>
          <button
            onClick={() => onFeedback?.(false)}
            className="p-1.5 hover:bg-red-100 rounded transition-colors"
          >
            <ThumbsDown className="w-4 h-4 text-gray-400 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Natural Language Query Component
// ============================================================================

export function NaturalLanguageQuery({
  onQuerySubmit,
  placeholder = 'Ask anything about your production data...',
}: NaturalLanguageQueryProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate AI response
  const processQuery = (queryText: string): QueryResult => {
    const lowerQuery = queryText.toLowerCase();

    // Simulated responses based on query content
    if (lowerQuery.includes('defect') || lowerQuery.includes('quality')) {
      return {
        id: Date.now().toString(),
        query: queryText,
        answer: 'Based on the analysis of Line 2 production data for this month, the overall defect rate is 1.8%, which is 0.2% below target. There has been a 15% improvement compared to last month.',
        visualType: 'chart',
        data: [
          { Week: 'Week 1', Rate: 2.1 },
          { Week: 'Week 2', Rate: 1.9 },
          { Week: 'Week 3', Rate: 1.7 },
          { Week: 'Week 4', Rate: 1.5 },
        ],
        insights: [
          'Defect rate has decreased consistently week-over-week',
          'Welding-related defects reduced by 40% after process adjustment',
          'Highest defects occur during shift changes',
        ],
        relatedQueries: [
          'What are the main causes of defects?',
          'Compare Line 2 with other lines',
          'Show defect trends by operator',
        ],
        confidence: 94,
        timestamp: new Date(),
      };
    }

    if (lowerQuery.includes('oee') || lowerQuery.includes('efficiency')) {
      return {
        id: Date.now().toString(),
        query: queryText,
        answer: 'Current Overall Equipment Effectiveness (OEE) across all production lines is 82.4%. This breaks down to 89% Availability, 94% Performance, and 98.5% Quality.',
        visualType: 'metric',
        data: [
          { Metric: 'Overall OEE', Value: '82.4%' },
          { Metric: 'Availability', Value: '89%' },
          { Metric: 'Performance', Value: '94%' },
          { Metric: 'Quality', Value: '98.5%' },
        ],
        insights: [
          'OEE is 2.4% above the industry benchmark',
          'Availability is the main limiting factor',
          'Line 3 has the highest OEE at 87%',
        ],
        relatedQueries: [
          'What is causing availability losses?',
          'Show OEE trend for the last quarter',
          'Which line has the lowest OEE?',
        ],
        confidence: 96,
        timestamp: new Date(),
      };
    }

    if (lowerQuery.includes('maintenance') || lowerQuery.includes('machine')) {
      return {
        id: Date.now().toString(),
        query: queryText,
        answer: 'Based on predictive maintenance analysis, 3 machines are flagged for maintenance within the next 7 days. CNC Mill #3 is the highest priority due to detected bearing wear.',
        visualType: 'table',
        data: [
          { Machine: 'CNC Mill #3', Issue: 'Bearing wear', Priority: 'High', 'Due In': '2 days' },
          { Machine: 'Press #1', Issue: 'Hydraulic pressure', Priority: 'Medium', 'Due In': '5 days' },
          { Machine: 'Lathe #2', Issue: 'Calibration', Priority: 'Low', 'Due In': '7 days' },
        ],
        insights: [
          'Early maintenance can prevent $45,000 in unplanned downtime',
          'CNC Mill #3 has shown 15% efficiency drop',
          'Preventive maintenance compliance is at 94%',
        ],
        relatedQueries: [
          'What is the maintenance history for CNC Mill #3?',
          'Show spare parts availability',
          'Calculate maintenance cost savings',
        ],
        confidence: 88,
        timestamp: new Date(),
      };
    }

    if (lowerQuery.includes('downtime')) {
      return {
        id: Date.now().toString(),
        query: queryText,
        answer: 'Analysis of downtime records shows the top 5 causes accounting for 78% of total downtime hours this month.',
        visualType: 'chart',
        data: [
          { Cause: 'Setup/Changeover', Hours: 45 },
          { Cause: 'Material Shortage', Hours: 32 },
          { Cause: 'Equipment Failure', Hours: 28 },
          { Cause: 'Quality Issues', Hours: 18 },
          { Cause: 'Operator Unavailable', Hours: 12 },
        ],
        insights: [
          'Setup time has increased 20% due to new product introduction',
          'Material shortages are primarily from Supplier A',
          'Equipment failures decreased 35% after PM implementation',
        ],
        relatedQueries: [
          'How can we reduce setup time?',
          'Show downtime by shift',
          'Compare with last month',
        ],
        confidence: 91,
        timestamp: new Date(),
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      query: queryText,
      answer: `I've analyzed your query about "${queryText}". Based on the available data, here's a summary of relevant metrics and trends. For more specific insights, try asking about defects, OEE, maintenance, or downtime.`,
      visualType: 'list',
      data: [
        { Item: 'Production output is on target' },
        { Item: 'Quality metrics are within specification' },
        { Item: 'No critical alerts at this time' },
        { Item: 'All systems operating normally' },
      ],
      relatedQueries: [
        'Show production summary',
        'What are the current alerts?',
        'Display KPI dashboard',
      ],
      confidence: 72,
      timestamp: new Date(),
    };
  };

  // Handle submit
  const handleSubmit = async (queryText?: string) => {
    const finalQuery = queryText || query;
    if (!finalQuery.trim()) return;

    setIsLoading(true);
    onQuerySubmit?.(finalQuery);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = processQuery(finalQuery);
    setResults(prev => [result, ...prev]);
    setHistory(prev => [result, ...prev.slice(0, 9)]);
    setQuery('');
    setIsLoading(false);
  };

  // Handle suggested query click
  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    handleSubmit(suggestedQuery);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Ask AI Analytics</h2>
              <p className="text-sm text-violet-100">Natural language query for your data</p>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <Clock className="w-5 h-5" />
            <span className="text-sm">History</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-400'}`}
              title="Voice input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || !query.trim()}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Suggested Queries */}
        {results.length === 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.slice(0, 4).map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(suggestion.query)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {suggestion.query}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* History Panel */}
      {showHistory && history.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs text-gray-500 font-medium">Recent Queries</span>
              <button
                onClick={() => setHistory([])}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            {history.map(result => (
              <QueryHistoryItem
                key={result.id}
                result={result}
                onClick={() => handleSuggestedQuery(result.query)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-gray-600">Analyzing your query...</span>
            </div>
          </div>
        )}

        {results.map(result => (
          <ResultCard
            key={result.id}
            result={result}
            onFeedback={(helpful) => console.log('Feedback:', result.id, helpful)}
            onCopy={() => navigator.clipboard.writeText(result.answer)}
            onRelatedQuery={handleSuggestedQuery}
          />
        ))}

        {!isLoading && results.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-indigo-300" />
            <p className="text-gray-500 font-medium">Ask me anything about your production data</p>
            <p className="text-sm text-gray-400 mt-1">
              I can analyze defects, OEE, maintenance needs, and more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NaturalLanguageQuery;
