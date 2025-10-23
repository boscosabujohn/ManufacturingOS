'use client';

import React, { useState } from 'react';
import { Repeat, Plus, Search, Eye, Edit3, Calculator, ArrowRightLeft, CheckCircle, AlertTriangle } from 'lucide-react';

interface UOMConversion {
  id: string;
  fromUOM: string;
  toUOM: string;
  conversionFactor: number;
  conversionFormula?: string;
  category: string;
  isReversible: boolean;
  
  validationRules?: {
    minQuantity?: number;
    maxQuantity?: number;
    decimalPlaces?: number;
  };
  
  usageContext?: {
    applicableFor: 'all' | 'specific-items' | 'specific-categories';
    items?: string[];
    categories?: string[];
  };
  
  status: 'active' | 'inactive';
  effectiveFrom: string;
  effectiveTo?: string;
  
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

const UOMConversionMaster: React.FC = () => {
  const [conversions, setConversions] = useState<UOMConversion[]>([
    {
      id: '1',
      fromUOM: 'Cubic Meter',
      toUOM: 'Cubic Feet',
      conversionFactor: 35.3147,
      conversionFormula: '1 m³ = 35.3147 ft³',
      category: 'Volume',
      isReversible: true,
      validationRules: {
        minQuantity: 0.001,
        decimalPlaces: 4
      },
      usageContext: {
        applicableFor: 'specific-categories',
        categories: ['Timber', 'Wood Products']
      },
      status: 'active',
      effectiveFrom: '2024-01-01',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      fromUOM: 'Kilogram',
      toUOM: 'Gram',
      conversionFactor: 1000,
      conversionFormula: '1 kg = 1000 g',
      category: 'Weight',
      isReversible: true,
      validationRules: {
        minQuantity: 0.001,
        decimalPlaces: 3
      },
      usageContext: {
        applicableFor: 'all'
      },
      status: 'active',
      effectiveFrom: '2024-01-01',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      fromUOM: 'Meter',
      toUOM: 'Feet',
      conversionFactor: 3.28084,
      conversionFormula: '1 m = 3.28084 ft',
      category: 'Length',
      isReversible: true,
      validationRules: {
        minQuantity: 0.01,
        decimalPlaces: 4
      },
      usageContext: {
        applicableFor: 'all'
      },
      status: 'active',
      effectiveFrom: '2024-01-01',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '4',
      fromUOM: 'Sheet',
      toUOM: 'Square Meter',
      conversionFactor: 2.9768,
      conversionFormula: '1 Sheet (8x4 ft) = 2.9768 m²',
      category: 'Area',
      isReversible: false,
      validationRules: {
        decimalPlaces: 4
      },
      usageContext: {
        applicableFor: 'specific-categories',
        categories: ['Plywood', 'Laminates', 'MDF']
      },
      status: 'active',
      effectiveFrom: '2024-01-01',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '5',
      fromUOM: 'Box',
      toUOM: 'Pieces',
      conversionFactor: 100,
      conversionFormula: '1 Box = 100 Pieces',
      category: 'Packaging',
      isReversible: true,
      validationRules: {
        decimalPlaces: 0
      },
      usageContext: {
        applicableFor: 'specific-items',
        items: ['SCREW-001', 'NAIL-001', 'HINGE-001']
      },
      status: 'active',
      effectiveFrom: '2024-01-01',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '6',
      fromUOM: 'Running Meter',
      toUOM: 'Pieces',
      conversionFactor: 1,
      conversionFormula: '1 RM = X Pieces (depends on cutting length)',
      category: 'Length-to-Quantity',
      isReversible: false,
      validationRules: {
        decimalPlaces: 2
      },
      usageContext: {
        applicableFor: 'specific-categories',
        categories: ['Edge Banding', 'Profiles']
      },
      status: 'active',
      effectiveFrom: '2024-01-01',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [calculatorMode, setCalculatorMode] = useState(false);
  const [calcFromUOM, setCalcFromUOM] = useState('');
  const [calcToUOM, setCalcToUOM] = useState('');
  const [calcValue, setCalcValue] = useState<number>(1);
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const categories = Array.from(new Set(conversions.map(c => c.category)));

  const filteredConversions = conversions.filter(c => {
    const matchesSearch = c.fromUOM.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.toUOM.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const performCalculation = () => {
    const conversion = conversions.find(c => 
      c.fromUOM === calcFromUOM && c.toUOM === calcToUOM && c.status === 'active'
    );
    if (conversion) {
      setCalcResult(calcValue * conversion.conversionFactor);
    } else {
      // Check for reverse conversion
      const reverseConversion = conversions.find(c => 
        c.toUOM === calcFromUOM && c.fromUOM === calcToUOM && c.isReversible && c.status === 'active'
      );
      if (reverseConversion) {
        setCalcResult(calcValue / reverseConversion.conversionFactor);
      } else {
        setCalcResult(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Repeat className="w-8 h-8 text-indigo-600" />
                UOM Conversion Master
              </h1>
              <p className="text-gray-600 mt-2">Manage unit of measure conversion rules</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setCalculatorMode(!calculatorMode)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                {calculatorMode ? 'Close' : 'Calculator'}
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Conversion
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculator Mode */}
        {calculatorMode && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow-sm p-6 mb-6 border border-indigo-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              UOM Conversion Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={calcValue}
                  onChange={(e) => setCalcValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From UOM</label>
                <select
                  value={calcFromUOM}
                  onChange={(e) => setCalcFromUOM(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  {Array.from(new Set(conversions.flatMap(c => [c.fromUOM, c.toUOM]))).sort().map(uom => (
                    <option key={uom} value={uom}>{uom}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To UOM</label>
                <select
                  value={calcToUOM}
                  onChange={(e) => setCalcToUOM(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  {Array.from(new Set(conversions.flatMap(c => [c.fromUOM, c.toUOM]))).sort().map(uom => (
                    <option key={uom} value={uom}>{uom}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={performCalculation}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate
              </button>
            </div>
            {calcResult !== null && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-lg font-semibold text-gray-900">
                  {calcValue} {calcFromUOM} = <span className="text-indigo-600">{calcResult.toFixed(4)} {calcToUOM}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conversions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{conversions.length}</p>
              </div>
              <Repeat className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {conversions.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reversible</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {conversions.filter(c => c.isReversible).length}
                </p>
              </div>
              <ArrowRightLeft className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
              </div>
              <Repeat className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Conversions List */}
        <div className="space-y-4">
          {filteredConversions.map(conversion => (
            <div key={conversion.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {conversion.fromUOM} → {conversion.toUOM}
                    </h3>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {conversion.category}
                    </span>
                    {conversion.isReversible && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3" />
                        Reversible
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      conversion.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {conversion.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-mono bg-gray-50 inline-block px-3 py-1 rounded">
                    {conversion.conversionFormula}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Conversion Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Conversion Factor</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Factor:</span>
                      <span className="font-medium text-indigo-600 text-lg">{conversion.conversionFactor}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      1 {conversion.fromUOM} = {conversion.conversionFactor} {conversion.toUOM}
                    </div>
                  </div>
                </div>

                {/* Validation Rules */}
                {conversion.validationRules && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Validation Rules</h4>
                    <div className="space-y-1 text-sm">
                      {conversion.validationRules.minQuantity !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Qty:</span>
                          <span className="font-medium">{conversion.validationRules.minQuantity}</span>
                        </div>
                      )}
                      {conversion.validationRules.maxQuantity !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Qty:</span>
                          <span className="font-medium">{conversion.validationRules.maxQuantity}</span>
                        </div>
                      )}
                      {conversion.validationRules.decimalPlaces !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Decimals:</span>
                          <span className="font-medium">{conversion.validationRules.decimalPlaces}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Usage Context */}
                {conversion.usageContext && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Usage Context</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applicable For:</span>
                        <span className="font-medium capitalize">{conversion.usageContext.applicableFor.replace('-', ' ')}</span>
                      </div>
                      {conversion.usageContext.categories && conversion.usageContext.categories.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Categories:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {conversion.usageContext.categories.map((cat, index) => (
                              <span key={index} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {conversion.usageContext.items && conversion.usageContext.items.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Items: {conversion.usageContext.items.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Effective Date */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Effective From: <span className="font-medium">{new Date(conversion.effectiveFrom).toLocaleDateString()}</span>
                    </span>
                    {conversion.effectiveTo && (
                      <span className="text-gray-600">
                        To: <span className="font-medium">{new Date(conversion.effectiveTo).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500">
                    Created by {conversion.createdBy} on {new Date(conversion.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredConversions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversions found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UOMConversionMaster;
