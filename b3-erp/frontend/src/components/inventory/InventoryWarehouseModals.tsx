"use client"

import React, { useState } from 'react'
import { X, Plus, Trash2, Warehouse, MapPin, Grid3x3, Package, Edit, CheckCircle, AlertTriangle, Map, Building2, User } from 'lucide-react'

// ==================== INTERFACES ====================

export interface WarehouseData {
  warehouseId: string
  warehouseName: string
  warehouseCode: string
  warehouseType: 'main' | 'distribution' | 'transit' | 'production' | 'cold-storage'
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact: {
    managerName: string
    phone: string
    email: string
  }
  capacity: {
    totalArea: number
    usedArea: number
    unit: 'sqft' | 'sqm'
  }
  status: 'active' | 'inactive' | 'maintenance'
  zones: string[]
  features: string[]
}

export interface ZoneData {
  zoneId: string
  zoneName: string
  zoneCode: string
  warehouseId: string
  zoneType: 'receiving' | 'storage' | 'picking' | 'shipping' | 'quarantine'
  capacity: number
  currentUtilization: number
  temperature?: {
    min: number
    max: number
    controlled: boolean
  }
  bins: BinData[]
  restrictions?: string[]
}

export interface BinData {
  binId: string
  binCode: string
  zoneId: string
  row: string
  rack: string
  level: string
  capacity: number
  currentLoad: number
  status: 'available' | 'occupied' | 'reserved' | 'blocked'
  itemStored?: string
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'in' | 'cm'
  }
}

export interface LocationTransferData {
  transferId: string
  itemCode: string
  itemName: string
  quantity: number
  fromWarehouse: string
  fromZone: string
  fromBin: string
  toWarehouse: string
  toZone: string
  toBin: string
  reason: string
  requestedBy: string
  requestDate: string
  status: 'pending' | 'in-progress' | 'completed'
}

export interface WarehouseLayoutData {
  warehouseId: string
  zones: Array<{
    zoneId: string
    zoneName: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    color: string
  }>
}

// ==================== CREATE WAREHOUSE MODAL ====================

interface CreateWarehouseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: WarehouseData) => void
}

export const CreateWarehouseModal: React.FC<CreateWarehouseModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<WarehouseData>({
    warehouseId: `WH-${Date.now()}`,
    warehouseName: '',
    warehouseCode: '',
    warehouseType: 'main',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    contact: {
      managerName: '',
      phone: '',
      email: ''
    },
    capacity: {
      totalArea: 0,
      usedArea: 0,
      unit: 'sqft'
    },
    status: 'active',
    zones: [],
    features: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFeature, setSelectedFeature] = useState('')

  const availableFeatures = [
    'Climate Controlled',
    'Refrigerated Storage',
    'Hazmat Storage',
    'High Security',
    '24/7 Operations',
    'Loading Docks',
    'Rail Access',
    'Automated Systems'
  ]

  const addFeature = () => {
    if (selectedFeature && !formData.features.includes(selectedFeature)) {
      setFormData({ ...formData, features: [...formData.features, selectedFeature] })
      setSelectedFeature('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData({ ...formData, features: formData.features.filter(f => f !== feature) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.warehouseName) newErrors.warehouseName = 'Warehouse name is required'
    if (!formData.warehouseCode) newErrors.warehouseCode = 'Warehouse code is required'
    if (!formData.location.address) newErrors.address = 'Address is required'
    if (!formData.contact.managerName) newErrors.managerName = 'Manager name is required'
    if (!formData.contact.email) newErrors.email = 'Email is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Warehouse className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Create Warehouse</h2>
              <p className="text-sm opacity-90">{formData.warehouseId}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse Name *
                </label>
                <input
                  type="text"
                  value={formData.warehouseName}
                  onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.warehouseName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Main Warehouse"
                />
                {errors.warehouseName && <p className="text-red-500 text-xs mt-1">{errors.warehouseName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse Code *
                </label>
                <input
                  type="text"
                  value={formData.warehouseCode}
                  onChange={(e) => setFormData({ ...formData, warehouseCode: e.target.value.toUpperCase() })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.warehouseCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="WH-001"
                />
                {errors.warehouseCode && <p className="text-red-500 text-xs mt-1">{errors.warehouseCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse Type *
                </label>
                <select
                  value={formData.warehouseType}
                  onChange={(e) => setFormData({ ...formData, warehouseType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="main">Main Warehouse</option>
                  <option value="distribution">Distribution Center</option>
                  <option value="transit">Transit Hub</option>
                  <option value="production">Production Warehouse</option>
                  <option value="cold-storage">Cold Storage</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, state: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={formData.location.zipCode}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, zipCode: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, country: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager Name *
                </label>
                <input
                  type="text"
                  value={formData.contact.managerName}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, managerName: e.target.value } })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.managerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.managerName && <p className="text-red-500 text-xs mt-1">{errors.managerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="manager@company.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Capacity Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Area
                </label>
                <input
                  type="number"
                  value={formData.capacity.totalArea}
                  onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, totalArea: parseFloat(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={formData.capacity.unit}
                  onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, unit: e.target.value as any } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Warehouse Features</h3>
            <div className="flex gap-2 mb-3">
              <select
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Feature</option>
                {availableFeatures.map((feature) => (
                  <option key={feature} value={feature}>{feature}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addFeature}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Create Warehouse
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== CREATE ZONE MODAL ====================

interface CreateZoneModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ZoneData) => void
  warehouseId?: string
}

export const CreateZoneModal: React.FC<CreateZoneModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  warehouseId
}) => {
  const [formData, setFormData] = useState<ZoneData>({
    zoneId: `ZONE-${Date.now()}`,
    zoneName: '',
    zoneCode: '',
    warehouseId: warehouseId || '',
    zoneType: 'storage',
    capacity: 0,
    currentUtilization: 0,
    bins: [],
    restrictions: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [temperatureControlled, setTemperatureControlled] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.zoneName) newErrors.zoneName = 'Zone name is required'
    if (!formData.zoneCode) newErrors.zoneCode = 'Zone code is required'
    if (!formData.warehouseId) newErrors.warehouseId = 'Warehouse is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <Grid3x3 className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Create Zone</h2>
              <p className="text-sm opacity-90">{formData.zoneId}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zone Name *
              </label>
              <input
                type="text"
                value={formData.zoneName}
                onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.zoneName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Zone A"
              />
              {errors.zoneName && <p className="text-red-500 text-xs mt-1">{errors.zoneName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zone Code *
              </label>
              <input
                type="text"
                value={formData.zoneCode}
                onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value.toUpperCase() })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.zoneCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ZONE-A"
              />
              {errors.zoneCode && <p className="text-red-500 text-xs mt-1">{errors.zoneCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse *
              </label>
              <select
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.warehouseId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!!warehouseId}
              >
                <option value="">Select Warehouse</option>
                <option value="WH-001">Main Warehouse</option>
                <option value="WH-002">Production Warehouse</option>
                <option value="WH-003">Finished Goods</option>
              </select>
              {errors.warehouseId && <p className="text-red-500 text-xs mt-1">{errors.warehouseId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zone Type *
              </label>
              <select
                value={formData.zoneType}
                onChange={(e) => setFormData({ ...formData, zoneType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="receiving">Receiving</option>
                <option value="storage">Storage</option>
                <option value="picking">Picking</option>
                <option value="shipping">Shipping</option>
                <option value="quarantine">Quarantine</option>
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Number of pallets or units"
            />
          </div>

          {/* Temperature Control */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={temperatureControlled}
                onChange={(e) => {
                  setTemperatureControlled(e.target.checked)
                  if (!e.target.checked) {
                    const { temperature, ...rest } = formData
                    setFormData(rest as ZoneData)
                  } else {
                    setFormData({ ...formData, temperature: { min: 0, max: 0, controlled: true } })
                  }
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Temperature Controlled Zone</span>
            </label>

            {temperatureControlled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Temperature (°F)
                  </label>
                  <input
                    type="number"
                    value={formData.temperature?.min || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      temperature: { ...formData.temperature!, min: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Temperature (°F)
                  </label>
                  <input
                    type="number"
                    value={formData.temperature?.max || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      temperature: { ...formData.temperature!, max: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="75"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Create Zone
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== CREATE BIN MODAL ====================

interface CreateBinModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BinData) => void
  zoneId?: string
}

export const CreateBinModal: React.FC<CreateBinModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  zoneId
}) => {
  const [formData, setFormData] = useState<BinData>({
    binId: `BIN-${Date.now()}`,
    binCode: '',
    zoneId: zoneId || '',
    row: '',
    rack: '',
    level: '',
    capacity: 0,
    currentLoad: 0,
    status: 'available'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [includeDimensions, setIncludeDimensions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.binCode) newErrors.binCode = 'Bin code is required'
    if (!formData.zoneId) newErrors.zoneId = 'Zone is required'
    if (!formData.row) newErrors.row = 'Row is required'
    if (!formData.rack) newErrors.rack = 'Rack is required'
    if (!formData.level) newErrors.level = 'Level is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Create Bin Location</h2>
              <p className="text-sm opacity-90">{formData.binId}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Zone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zone *
            </label>
            <select
              value={formData.zoneId}
              onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.zoneId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!!zoneId}
            >
              <option value="">Select Zone</option>
              <option value="ZONE-A">Zone A - Storage</option>
              <option value="ZONE-B">Zone B - Picking</option>
              <option value="ZONE-C">Zone C - Receiving</option>
            </select>
            {errors.zoneId && <p className="text-red-500 text-xs mt-1">{errors.zoneId}</p>}
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Row *
              </label>
              <input
                type="text"
                value={formData.row}
                onChange={(e) => setFormData({ ...formData, row: e.target.value.toUpperCase() })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.row ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="A"
              />
              {errors.row && <p className="text-red-500 text-xs mt-1">{errors.row}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rack *
              </label>
              <input
                type="text"
                value={formData.rack}
                onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.rack ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="01"
              />
              {errors.rack && <p className="text-red-500 text-xs mt-1">{errors.rack}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level *
              </label>
              <input
                type="text"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.level ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="01"
              />
              {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bin Code *
              </label>
              <input
                type="text"
                value={formData.binCode || `${formData.row}-${formData.rack}-${formData.level}`}
                onChange={(e) => setFormData({ ...formData, binCode: e.target.value.toUpperCase() })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.binCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="A-01-01"
              />
              {errors.binCode && <p className="text-red-500 text-xs mt-1">{errors.binCode}</p>}
            </div>
          </div>

          {/* Capacity & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Max items"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={includeDimensions}
                onChange={(e) => {
                  setIncludeDimensions(e.target.checked)
                  if (!e.target.checked) {
                    const { dimensions, ...rest } = formData
                    setFormData(rest as BinData)
                  } else {
                    setFormData({ ...formData, dimensions: { length: 0, width: 0, height: 0, unit: 'in' } })
                  }
                }}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Specify Dimensions</span>
            </label>

            {includeDimensions && (
              <div className="grid grid-cols-4 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                  <input
                    type="number"
                    value={formData.dimensions?.length || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions!, length: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                  <input
                    type="number"
                    value={formData.dimensions?.width || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions!, width: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="number"
                    value={formData.dimensions?.height || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions!, height: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={formData.dimensions?.unit || 'in'}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions!, unit: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="in">Inches</option>
                    <option value="cm">CM</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Create Bin
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== VIEW WAREHOUSE DETAILS MODAL ====================

interface ViewWarehouseDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  warehouse: WarehouseData | null
  onEdit?: () => void
  onAddZone?: () => void
}

export const ViewWarehouseDetailsModal: React.FC<ViewWarehouseDetailsModalProps> = ({
  isOpen,
  onClose,
  warehouse,
  onEdit,
  onAddZone
}) => {
  if (!isOpen || !warehouse) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      case 'maintenance': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const utilizationPercentage = warehouse.capacity.totalArea > 0
    ? (warehouse.capacity.usedArea / warehouse.capacity.totalArea) * 100
    : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Warehouse className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">{warehouse.warehouseName}</h2>
              <p className="text-sm opacity-90">{warehouse.warehouseCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status & Type */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(warehouse.status)}`}>
              {warehouse.status.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
              {warehouse.warehouseType.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* Capacity Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-4">Capacity Utilization</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Total Area:</span>
                <span className="font-semibold text-blue-900">{warehouse.capacity.totalArea} {warehouse.capacity.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Used Area:</span>
                <span className="font-semibold text-blue-900">{warehouse.capacity.usedArea} {warehouse.capacity.unit}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${utilizationPercentage}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-900">{utilizationPercentage.toFixed(1)}%</span>
                <span className="text-sm text-blue-700 ml-2">Utilized</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-800">{warehouse.location.address}</p>
              <p className="text-gray-600">
                {warehouse.location.city}, {warehouse.location.state} {warehouse.location.zipCode}
              </p>
              <p className="text-gray-600">{warehouse.location.country}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Manager:</span>
                <span className="font-semibold text-gray-800">{warehouse.contact.managerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-800">{warehouse.contact.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-800">{warehouse.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          {warehouse.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {warehouse.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Zones */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Zones ({warehouse.zones.length})</h3>
              {onAddZone && (
                <button
                  onClick={onAddZone}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Zone
                </button>
              )}
            </div>
            {warehouse.zones.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {warehouse.zones.map((zone, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <Grid3x3 className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-800">{zone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                No zones configured
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Warehouse
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
