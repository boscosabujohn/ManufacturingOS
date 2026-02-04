'use client';

import { useState, useMemo } from 'react';

interface ROIInputs {
  employees: number;
  averageSalary: number;
  inventoryValue: number;
  monthlyOrders: number;
  manualProcessHours: number;
  errorRate: number;
  inventoryShrinkage: number;
}

interface ROIResults {
  annualSavings: number;
  laborSavings: number;
  inventorySavings: number;
  errorReduction: number;
  productivityGain: number;
  paybackMonths: number;
  threeYearROI: number;
}

const defaultInputs: ROIInputs = {
  employees: 50,
  averageSalary: 50000,
  inventoryValue: 500000,
  monthlyOrders: 500,
  manualProcessHours: 20,
  errorRate: 5,
  inventoryShrinkage: 3,
};

const IMPLEMENTATION_COST = 75000;
const ANNUAL_LICENSE_COST = 24000;

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>(defaultInputs);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo<ROIResults>(() => {
    // Labor savings from automation (30% efficiency gain)
    const laborSavings =
      inputs.employees * inputs.averageSalary * 0.3 * (inputs.manualProcessHours / 160);

    // Inventory savings from reduced shrinkage (50% reduction)
    const inventorySavings = inputs.inventoryValue * (inputs.inventoryShrinkage / 100) * 0.5;

    // Error reduction savings (70% fewer errors)
    const errorCost = inputs.monthlyOrders * 12 * 50 * (inputs.errorRate / 100);
    const errorReduction = errorCost * 0.7;

    // Productivity gain from better visibility
    const productivityGain = inputs.employees * inputs.averageSalary * 0.05;

    const annualSavings = laborSavings + inventorySavings + errorReduction + productivityGain;

    // ROI calculations
    const totalFirstYearCost = IMPLEMENTATION_COST + ANNUAL_LICENSE_COST;
    const netFirstYearSavings = annualSavings - totalFirstYearCost;
    const paybackMonths = totalFirstYearCost / (annualSavings / 12);

    // 3-year ROI
    const threeYearSavings = annualSavings * 3;
    const threeYearCost = IMPLEMENTATION_COST + ANNUAL_LICENSE_COST * 3;
    const threeYearROI = ((threeYearSavings - threeYearCost) / threeYearCost) * 100;

    return {
      annualSavings,
      laborSavings,
      inventorySavings,
      errorReduction,
      productivityGain,
      paybackMonths,
      threeYearROI,
    };
  }, [inputs]);

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className=" p-3 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">ROI Calculator</h2>
      <p className="text-gray-600 mb-8">
        Calculate your potential return on investment with ManufacturingOS ERP
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Your Organization
          </h3>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Employees
              </label>
              <input
                type="number"
                value={inputs.employees}
                onChange={(e) => handleInputChange('employees', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Annual Salary ($)
              </label>
              <input
                type="number"
                value={inputs.averageSalary}
                onChange={(e) => handleInputChange('averageSalary', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Inventory Value ($)
              </label>
              <input
                type="number"
                value={inputs.inventoryValue}
                onChange={(e) => handleInputChange('inventoryValue', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Orders Processed
              </label>
              <input
                type="number"
                value={inputs.monthlyOrders}
                onChange={(e) => handleInputChange('monthlyOrders', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-8">
            Current Pain Points
          </h3>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours/Week on Manual Processes
              </label>
              <input
                type="number"
                value={inputs.manualProcessHours}
                onChange={(e) => handleInputChange('manualProcessHours', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Error Rate (%)
              </label>
              <input
                type="number"
                value={inputs.errorRate}
                onChange={(e) => handleInputChange('errorRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inventory Shrinkage (%)
              </label>
              <input
                type="number"
                value={inputs.inventoryShrinkage}
                onChange={(e) => handleInputChange('inventoryShrinkage', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
          </div>

          <button
            onClick={() => setShowResults(true)}
            className="w-full mt-6 px-3 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Calculate ROI
          </button>
        </div>

        {/* Results Section */}
        <div className={`space-y-3 ${showResults ? '' : 'opacity-50'}`}>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Your Potential Savings
          </h3>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">Annual Savings</p>
              <p className="text-4xl font-bold text-green-700">
                {formatCurrency(results.annualSavings)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Labor Cost Savings</span>
              <span className="font-semibold">{formatCurrency(results.laborSavings)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Inventory Savings</span>
              <span className="font-semibold">{formatCurrency(results.inventorySavings)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Error Reduction Savings</span>
              <span className="font-semibold">{formatCurrency(results.errorReduction)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Productivity Gains</span>
              <span className="font-semibold">{formatCurrency(results.productivityGain)}</span>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Investment Analysis</h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-sm text-blue-600">Payback Period</p>
                <p className="text-2xl font-bold text-blue-700">
                  {results.paybackMonths.toFixed(1)} months
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <p className="text-sm text-purple-600">3-Year ROI</p>
                <p className="text-2xl font-bold text-purple-700">
                  {results.threeYearROI.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            <p>* Calculations based on industry averages and typical implementation outcomes.</p>
            <p>* Actual results may vary based on your specific situation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ROICalculator;
