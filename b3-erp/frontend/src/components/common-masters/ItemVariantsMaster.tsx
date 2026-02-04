'use client';

import React, { useState } from 'react';
import { Package, Plus, Search, Eye, Edit3, Copy, Grid3x3, RefreshCw, Tag, Image } from 'lucide-react';

interface VariantAttribute {
  attributeName: string;
  attributeValue: string;
  displayOrder: number;
}

interface ItemVariant {
  id: string;
  baseItemCode: string;
  baseItemName: string;
  variantCode: string;
  variantName: string;
  sku: string;
  status: 'active' | 'inactive' | 'discontinued';
  
  attributes: VariantAttribute[];
  
  pricing: {
    costPrice: number;
    sellingPrice: number;
    mrp: number;
    discount?: number;
    priceVariance?: number;
  };
  
  inventory: {
    currentStock: number;
    minStock: number;
    maxStock: number;
    reorderLevel: number;
    uom: string;
  };
  
  physical: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    packageSize?: string;
  };
  
  images?: string[];
  barcode?: string;
  isDefault: boolean;
  
  createdBy: string;
  createdAt: string;
}

const ItemVariantsMaster: React.FC = () => {
  const [variants, setVariants] = useState<ItemVariant[]>([
    {
      id: '1',
      baseItemCode: 'KIT-CAB-001',
      baseItemName: 'Kitchen Wall Cabinet',
      variantCode: 'KIT-CAB-001-WHT-24',
      variantName: 'Kitchen Wall Cabinet - White - 24 inch',
      sku: 'SKU-KIT-WHT-24',
      status: 'active',
      attributes: [
        { attributeName: 'Color', attributeValue: 'White', displayOrder: 1 },
        { attributeName: 'Size', attributeValue: '24 inch', displayOrder: 2 },
        { attributeName: 'Material', attributeValue: 'MDF', displayOrder: 3 }
      ],
      pricing: {
        costPrice: 8500,
        sellingPrice: 12000,
        mrp: 14000,
        discount: 14.3,
        priceVariance: 0
      },
      inventory: {
        currentStock: 45,
        minStock: 10,
        maxStock: 100,
        reorderLevel: 15,
        uom: 'PCS'
      },
      physical: {
        weight: 25,
        dimensions: {
          length: 610,
          width: 305,
          height: 610,
          unit: 'mm'
        },
        packageSize: 'Medium'
      },
      images: ['white-24-front.jpg', 'white-24-side.jpg'],
      barcode: '8901234567890',
      isDefault: true,
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      baseItemCode: 'KIT-CAB-001',
      baseItemName: 'Kitchen Wall Cabinet',
      variantCode: 'KIT-CAB-001-WHT-30',
      variantName: 'Kitchen Wall Cabinet - White - 30 inch',
      sku: 'SKU-KIT-WHT-30',
      status: 'active',
      attributes: [
        { attributeName: 'Color', attributeValue: 'White', displayOrder: 1 },
        { attributeName: 'Size', attributeValue: '30 inch', displayOrder: 2 },
        { attributeName: 'Material', attributeValue: 'MDF', displayOrder: 3 }
      ],
      pricing: {
        costPrice: 10000,
        sellingPrice: 14500,
        mrp: 17000,
        discount: 14.7,
        priceVariance: 2500
      },
      inventory: {
        currentStock: 32,
        minStock: 8,
        maxStock: 80,
        reorderLevel: 12,
        uom: 'PCS'
      },
      physical: {
        weight: 32,
        dimensions: {
          length: 762,
          width: 305,
          height: 610,
          unit: 'mm'
        },
        packageSize: 'Large'
      },
      barcode: '8901234567891',
      isDefault: false,
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      baseItemCode: 'KIT-CAB-001',
      baseItemName: 'Kitchen Wall Cabinet',
      variantCode: 'KIT-CAB-001-OAK-24',
      variantName: 'Kitchen Wall Cabinet - Oak - 24 inch',
      sku: 'SKU-KIT-OAK-24',
      status: 'active',
      attributes: [
        { attributeName: 'Color', attributeValue: 'Oak Finish', displayOrder: 1 },
        { attributeName: 'Size', attributeValue: '24 inch', displayOrder: 2 },
        { attributeName: 'Material', attributeValue: 'Plywood', displayOrder: 3 }
      ],
      pricing: {
        costPrice: 11000,
        sellingPrice: 16500,
        mrp: 19000,
        discount: 13.2,
        priceVariance: 4500
      },
      inventory: {
        currentStock: 28,
        minStock: 10,
        maxStock: 100,
        reorderLevel: 15,
        uom: 'PCS'
      },
      physical: {
        weight: 28,
        dimensions: {
          length: 610,
          width: 305,
          height: 610,
          unit: 'mm'
        },
        packageSize: 'Medium'
      },
      barcode: '8901234567892',
      isDefault: false,
      createdBy: 'admin',
      createdAt: '2024-01-16T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [groupBy, setGroupBy] = useState<'none' | 'base-item' | 'attribute'>('base-item');

  const filteredVariants = variants.filter(v =>
    v.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.variantCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedVariants = groupBy === 'base-item' 
    ? filteredVariants.reduce((acc, variant) => {
        const key = variant.baseItemCode;
        if (!acc[key]) acc[key] = [];
        acc[key].push(variant);
        return acc;
      }, {} as Record<string, ItemVariant[]>)
    : { 'All Variants': filteredVariants };

  const totalInventoryValue = variants.reduce((sum, v) => sum + (v.inventory.currentStock * v.pricing.costPrice), 0);
  const avgSellingPrice = variants.reduce((sum, v) => sum + v.pricing.sellingPrice, 0) / variants.length;

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-600" />
                Item Variants Master
              </h1>
              <p className="text-gray-600 mt-2">Manage product variations and SKUs</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Bulk Create
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Sync Stock
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search variants, SKU, or base item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="none">No Grouping</option>
              <option value="base-item">Group by Base Item</option>
              <option value="attribute">Group by Attribute</option>
            </select>
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
              >
                <Package className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Variants</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{variants.length}</p>
              </div>
              <Package className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Variants</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {variants.filter(v => v.status === 'active').length}
                </p>
              </div>
              <Tag className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stock Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(totalInventoryValue / 100000).toFixed(1)}L</p>
              </div>
              <Package className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Selling Price</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{avgSellingPrice.toFixed(0)}</p>
              </div>
              <Tag className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {variants.filter(v => v.inventory.currentStock <= v.inventory.reorderLevel).length}
                </p>
              </div>
              <Package className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Variants Display */}
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {Object.entries(groupedVariants).map(([groupName, groupVariants]) => (
              <div key={groupName} className="bg-white rounded-lg shadow-sm p-3">
                {groupBy !== 'none' && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {groupVariants[0]?.baseItemName || groupName}
                  </h3>
                )}
                <div className="space-y-2">
                  {groupVariants.map(variant => (
                    <div key={variant.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{variant.variantName}</h4>
                            {variant.isDefault && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">Default</span>
                            )}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              variant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {variant.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{variant.variantCode} • SKU: {variant.sku}</p>
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
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                            <Copy className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">Copy</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                        {/* Attributes */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Attributes</p>
                          <div className="flex flex-wrap gap-1">
                            {variant.attributes.map((attr, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {attr.attributeName}: {attr.attributeValue}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Pricing */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pricing</p>
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cost:</span>
                              <span className="font-medium">₹{variant.pricing.costPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Selling:</span>
                              <span className="font-medium text-green-600">₹{variant.pricing.sellingPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">MRP:</span>
                              <span className="font-medium">₹{variant.pricing.mrp.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Inventory */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Inventory</p>
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stock:</span>
                              <span className={`font-medium ${
                                variant.inventory.currentStock <= variant.inventory.reorderLevel 
                                  ? 'text-red-600' 
                                  : 'text-gray-900'
                              }`}>
                                {variant.inventory.currentStock} {variant.inventory.uom}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Min:</span>
                              <span className="font-medium">{variant.inventory.minStock}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Reorder:</span>
                              <span className="font-medium">{variant.inventory.reorderLevel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Physical */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Physical</p>
                          <div className="text-sm">
                            {variant.physical.weight && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-medium">{variant.physical.weight} kg</span>
                              </div>
                            )}
                            {variant.physical.dimensions && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Size:</span>
                                <span className="font-medium text-xs">
                                  {variant.physical.dimensions.length}×{variant.physical.dimensions.width}×{variant.physical.dimensions.height}
                                </span>
                              </div>
                            )}
                            {variant.barcode && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Barcode:</span>
                                <span className="font-medium text-xs">{variant.barcode}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVariants.map(variant => (
              <div key={variant.id} className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{variant.variantName}</h4>
                    <p className="text-sm text-gray-600">{variant.sku}</p>
                  </div>
                  <Image className="w-8 h-8 text-gray-300" />
                </div>
                
                <div className="space-y-2 mb-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{variant.inventory.currentStock} {variant.inventory.uom}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">₹{variant.pricing.sellingPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {variant.attributes.slice(0, 2).map((attr, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {attr.attributeValue}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    View
                  </button>
                  <button className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemVariantsMaster;
