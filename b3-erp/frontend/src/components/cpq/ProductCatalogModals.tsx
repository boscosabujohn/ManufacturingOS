'use client';

import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Upload, Package, DollarSign, Tag, Grid3x3, Image as ImageIcon, Copy, Eye, Edit3, Archive } from 'lucide-react';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  basePrice: number;
  status: 'active' | 'inactive' | 'discontinued';
  variants: number;
  lastModified: string;
  image: string;
  description?: string;
  costPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  attributes?: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
}

// Add/Edit Product Modal
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Product) => void;
  product?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    sku: product?.sku || '',
    name: product?.name || '',
    category: product?.category || 'Premium Modular Kitchen',
    basePrice: product?.basePrice || 0,
    costPrice: product?.costPrice || 0,
    minPrice: product?.minPrice || 0,
    maxPrice: product?.maxPrice || 0,
    status: product?.status || 'active',
    variants: product?.variants || 0,
    image: product?.image || '🏠',
    description: product?.description || '',
  });

  const [attributes, setAttributes] = useState(product?.attributes || [
    { id: 'attr-1', name: 'Size', values: ['Small', 'Medium', 'Large'] }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Product = {
      id: product?.id || `PROD-${Date.now()}`,
      sku: formData.sku!,
      name: formData.name!,
      category: formData.category!,
      basePrice: formData.basePrice!,
      status: formData.status!,
      variants: formData.variants!,
      lastModified: new Date().toISOString().split('T')[0],
      image: formData.image!,
      description: formData.description,
      costPrice: formData.costPrice,
      minPrice: formData.minPrice,
      maxPrice: formData.maxPrice,
      attributes,
    };
    onSave(productData);
    onClose();
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { id: `attr-${Date.now()}`, name: '', values: [] }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: string, value: string | string[]) => {
    const updated = [...attributes];
    (updated[index] as any)[field] = value;
    setAttributes(updated);
  };

  if (!isOpen) return null;

  const categories = [
    'Premium Modular Kitchen',
    'Island Kitchen',
    'L-Shaped Kitchen',
    'Parallel Kitchen',
    'Compact Kitchen',
    'Commercial Kitchen',
    'Institutional Kitchen',
    'Builder Package'
  ];

  const emojis = ['🏠', '🏡', '🏘️', '🏚️', '🏢', '🏭', '🏨', '🏗️', '🏛️', '🏪'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{product ? 'Edit' : 'Add'} Product</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Premium Modular Kitchen"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PMK-LUX-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Product description..."
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="6500000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (₹)</label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
                <input
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) => setFormData({ ...formData, minPrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({ ...formData, maxPrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="8000000"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: emoji })}
                  className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                    formData.image === emoji
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Variants</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Variants</label>
              <input
                type="number"
                value={formData.variants}
                onChange={(e) => setFormData({ ...formData, variants: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12"
                min="0"
              />
            </div>

            {/* Attributes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Product Attributes</label>
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Attribute</span>
                </button>
              </div>

              {attributes.map((attr, index) => (
                <div key={attr.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={attr.name}
                        onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Attribute name (e.g., Size)"
                      />
                      <input
                        type="text"
                        value={attr.values.join(', ')}
                        onChange={(e) => handleAttributeChange(index, 'values', e.target.value.split(',').map(v => v.trim()))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Values (comma separated)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{product ? 'Update' : 'Create'} Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Product Details Modal
interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
}

export const ViewProductModal: React.FC<ViewProductModalProps> = ({ isOpen, onClose, product, onEdit }) => {
  if (!isOpen || !product) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-sm opacity-90">{product.sku}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Image */}
          <div className="flex items-center justify-center h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
            <span className="text-8xl">{product.image}</span>
          </div>

          {/* Status and Category */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(product.status)}`}>
              {product.status.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {product.category}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Pricing Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Pricing Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Base Price</p>
                <p className="text-xl font-bold text-blue-900">₹{(product.basePrice / 100000).toFixed(2)}L</p>
              </div>
              {product.costPrice && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-xs text-orange-600 mb-1">Cost Price</p>
                  <p className="text-xl font-bold text-orange-900">₹{(product.costPrice / 100000).toFixed(2)}L</p>
                </div>
              )}
              {product.minPrice && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 mb-1">Min Price</p>
                  <p className="text-xl font-bold text-green-900">₹{(product.minPrice / 100000).toFixed(2)}L</p>
                </div>
              )}
              {product.maxPrice && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1">Max Price</p>
                  <p className="text-xl font-bold text-purple-900">₹{(product.maxPrice / 100000).toFixed(2)}L</p>
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Variants & Configuration</h3>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{product.variants}</span> variant configuration options available
              </p>
            </div>

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700">Product Attributes:</p>
                {product.attributes.map((attr) => (
                  <div key={attr.id} className="p-2 bg-white rounded border border-gray-200">
                    <p className="text-xs font-semibold text-gray-800">{attr.name}:</p>
                    <p className="text-xs text-gray-600">{attr.values.join(', ')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Metadata</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product ID:</span>
                <span className="font-medium text-gray-900">{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Modified:</span>
                <span className="font-medium text-gray-900">{product.lastModified}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(product);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Modal
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    status: [] as string[],
    priceRange: { min: 0, max: 0 },
    categories: [] as string[],
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  const categories = [
    'Premium Modular Kitchen',
    'Island Kitchen',
    'L-Shaped Kitchen',
    'Parallel Kitchen',
    'Compact Kitchen',
    'Commercial Kitchen',
    'Institutional Kitchen',
    'Builder Package'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold">Filter Products</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
            <div className="space-y-2">
              {['active', 'inactive', 'discontinued'].map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, status: [...filters.status, status] });
                      } else {
                        setFilters({ ...filters, status: filters.status.filter(s => s !== status) });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range (₹ Lakhs)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters({ ...filters, priceRange: { ...filters.priceRange, min: parseFloat(e.target.value) }})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters({ ...filters, priceRange: { ...filters.priceRange, max: parseFloat(e.target.value) }})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, categories: [...filters.categories, category] });
                      } else {
                        setFilters({ ...filters, categories: filters.categories.filter(c => c !== category) });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setFilters({ status: [], priceRange: { min: 0, max: 0 }, categories: [] })}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
