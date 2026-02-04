'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin,
  Package,
  Truck,
  Box,
  Tag,
  Radio,
  Wifi,
  Clock,
  Search,
  Filter,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Layers,
  Zap,
  Navigation,
  History,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type AssetType = 'material' | 'wip' | 'finished' | 'equipment' | 'container';
export type TrackingMethod = 'rfid' | 'gps' | 'barcode' | 'manual';
export type AssetStatus = 'in-transit' | 'stationary' | 'processing' | 'staging' | 'shipped';

export interface TrackedAsset {
  id: string;
  name: string;
  type: AssetType;
  trackingId: string;
  trackingMethod: TrackingMethod;
  status: AssetStatus;
  location: {
    zone: string;
    x: number;
    y: number;
  };
  lastUpdate: Date;
  destination?: string;
  workOrder?: string;
  quantity?: number;
  unit?: string;
  history: LocationHistoryPoint[];
}

export interface LocationHistoryPoint {
  zone: string;
  x: number;
  y: number;
  timestamp: Date;
}

export interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface AssetTrackingMapProps {
  onAssetClick?: (asset: TrackedAsset) => void;
  onZoneClick?: (zone: Zone) => void;
  refreshInterval?: number;
}

// ============================================================================
// Configuration
// ============================================================================

const assetTypeConfig: Record<AssetType, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}> = {
  material: {
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    label: 'Raw Material',
  },
  wip: {
    icon: Box,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
    label: 'Work in Progress',
  },
  finished: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    label: 'Finished Goods',
  },
  equipment: {
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    label: 'Equipment',
  },
  container: {
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    label: 'Container',
  },
};

const statusConfig: Record<AssetStatus, {
  color: string;
  label: string;
  pulse: boolean;
}> = {
  'in-transit': { color: 'text-blue-600', label: 'In Transit', pulse: true },
  'stationary': { color: 'text-gray-600', label: 'Stationary', pulse: false },
  'processing': { color: 'text-yellow-600', label: 'Processing', pulse: true },
  'staging': { color: 'text-purple-600', label: 'Staging', pulse: false },
  'shipped': { color: 'text-green-600', label: 'Shipped', pulse: false },
};

const trackingMethodIcons: Record<TrackingMethod, React.ElementType> = {
  rfid: Radio,
  gps: Navigation,
  barcode: Tag,
  manual: MapPin,
};

// ============================================================================
// Asset Marker Component
// ============================================================================

function AssetMarker({
  asset,
  isSelected,
  onClick,
  showTrail,
}: {
  asset: TrackedAsset;
  isSelected: boolean;
  onClick: () => void;
  showTrail: boolean;
}) {
  const config = assetTypeConfig[asset.type];
  const status = statusConfig[asset.status];
  const Icon = config.icon;

  return (
    <g>
      {/* Movement trail */}
      {showTrail && asset.history.length > 1 && (
        <polyline
          points={asset.history.map(h => `${h.x}%,${h.y}%`).join(' ')}
          fill="none"
          stroke={config.bgColor.replace('bg-', '')}
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.4"
        />
      )}

      {/* Asset marker */}
      <g
        onClick={onClick}
        className="cursor-pointer"
        style={{ transform: `translate(${asset.location.x}%, ${asset.location.y}%)` }}
      >
        {/* Selection ring */}
        {isSelected && (
          <circle
            cx="0"
            cy="0"
            r="20"
            fill="none"
            stroke={config.bgColor.replace('bg-', '#').replace('-500', '')}
            strokeWidth="3"
            className="animate-ping"
            opacity="0.5"
          />
        )}

        {/* Pulse effect for moving assets */}
        {status.pulse && (
          <circle
            cx="0"
            cy="0"
            r="15"
            fill={config.bgColor.replace('bg-', '#').replace('-500', '')}
            className="animate-ping"
            opacity="0.3"
          />
        )}

        {/* Main marker */}
        <circle
          cx="0"
          cy="0"
          r="12"
          fill={config.bgColor.replace('bg-', '#').replace('-500', '')}
          stroke={isSelected ? '#fff' : 'transparent'}
          strokeWidth="2"
        />

        {/* Icon would go here - simplified for SVG */}
        <circle
          cx="0"
          cy="0"
          r="6"
          fill="#fff"
        />
      </g>
    </g>
  );
}

// ============================================================================
// Zone Overlay Component
// ============================================================================

function ZoneOverlay({
  zone,
  assetCount,
  onClick,
}: {
  zone: Zone;
  assetCount: number;
  onClick: () => void;
}) {
  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect
        x={`${zone.x}%`}
        y={`${zone.y}%`}
        width={`${zone.width}%`}
        height={`${zone.height}%`}
        fill={zone.color}
        opacity="0.2"
        stroke={zone.color}
        strokeWidth="2"
        strokeDasharray="5,5"
        rx="4"
      />
      <text
        x={`${zone.x + zone.width / 2}%`}
        y={`${zone.y + 4}%`}
        fill={zone.color}
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
      >
        {zone.name}
      </text>
      {assetCount > 0 && (
        <g>
          <circle
            cx={`${zone.x + zone.width - 3}%`}
            cy={`${zone.y + 3}%`}
            r="12"
            fill={zone.color}
          />
          <text
            x={`${zone.x + zone.width - 3}%`}
            y={`${zone.y + 3}%`}
            fill="#fff"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {assetCount}
          </text>
        </g>
      )}
    </g>
  );
}

// ============================================================================
// Asset List Item Component
// ============================================================================

function AssetListItem({
  asset,
  isSelected,
  onClick,
}: {
  asset: TrackedAsset;
  isSelected: boolean;
  onClick: () => void;
}) {
  const config = assetTypeConfig[asset.type];
  const status = statusConfig[asset.status];
  const Icon = config.icon;
  const TrackingIcon = trackingMethodIcons[asset.trackingMethod];

  const timeSince = () => {
    const seconds = Math.floor((Date.now() - asset.lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded-lg cursor-pointer transition-all
        ${isSelected
          ? 'bg-blue-50 border-2 border-blue-500 dark:bg-blue-900/30'
          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 dark:text-white truncate">{asset.name}</p>
            <TrackingIcon className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{asset.trackingId}</span>
            <span>•</span>
            <span className={status.color}>{status.label}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{asset.location.zone}</p>
          <p className="text-xs text-gray-400">{timeSince()}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}

// ============================================================================
// Asset Detail Panel Component
// ============================================================================

function AssetDetailPanel({
  asset,
  onClose,
}: {
  asset: TrackedAsset;
  onClose: () => void;
}) {
  const config = assetTypeConfig[asset.type];
  const status = statusConfig[asset.status];
  const Icon = config.icon;
  const TrackingIcon = trackingMethodIcons[asset.trackingMethod];

  return (
    <div className="absolute top-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
      <div className={`px-4 py-3 ${config.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-semibold text-white">{asset.name}</h3>
              <p className="text-xs text-white/80">{config.label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <XCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Tracking Info */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrackingIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Tracking ID</p>
              <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">{asset.trackingId}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color} bg-gray-100 dark:bg-gray-600`}>
            {status.label}
          </span>
        </div>

        {/* Current Location */}
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            Current Location
          </p>
          <p className="font-medium text-gray-900 dark:text-white">{asset.location.zone}</p>
          <p className="text-xs text-gray-500">Position: ({asset.location.x.toFixed(1)}, {asset.location.y.toFixed(1)})</p>
        </div>

        {/* Destination */}
        {asset.destination && (
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              Destination
            </p>
            <p className="font-medium text-gray-900 dark:text-white">{asset.destination}</p>
          </div>
        )}

        {/* Work Order */}
        {asset.workOrder && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Work Order</p>
              <p className="font-medium text-blue-600">{asset.workOrder}</p>
            </div>
            {asset.quantity && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {asset.quantity} {asset.unit || 'units'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Movement History */}
        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <History className="w-3.5 h-3.5" />
            Recent Movements
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {asset.history.slice(-5).reverse().map((point, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
              >
                <span className="text-gray-700 dark:text-gray-300">{point.zone}</span>
                <span className="text-gray-400">
                  {point.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Last updated
          </span>
          <span>{asset.lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Asset Tracking Map Component
// ============================================================================

export function AssetTrackingMap({
  onAssetClick,
  onZoneClick,
  refreshInterval = 3000,
}: AssetTrackingMapProps) {
  const [assets, setAssets] = useState<TrackedAsset[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<TrackedAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all');
  const [showTrails, setShowTrails] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize zones
  useEffect(() => {
    const initialZones: Zone[] = [
      { id: 'z1', name: 'Receiving', x: 2, y: 2, width: 20, height: 20, color: '#3b82f6' },
      { id: 'z2', name: 'Raw Material Storage', x: 2, y: 25, width: 20, height: 35, color: '#8b5cf6' },
      { id: 'z3', name: 'Production Floor', x: 25, y: 2, width: 45, height: 55, color: '#f97316' },
      { id: 'z4', name: 'Quality Control', x: 73, y: 2, width: 25, height: 25, color: '#22c55e' },
      { id: 'z5', name: 'Staging Area', x: 2, y: 65, width: 30, height: 32, color: '#eab308' },
      { id: 'z6', name: 'Finished Goods', x: 35, y: 60, width: 30, height: 37, color: '#22c55e' },
      { id: 'z7', name: 'Shipping', x: 68, y: 30, width: 30, height: 67, color: '#06b6d4' },
    ];
    setZones(initialZones);
  }, []);

  // Generate simulated asset data
  const generateAssets = useCallback((): TrackedAsset[] => {
    const types: AssetType[] = ['material', 'wip', 'finished', 'container'];
    const methods: TrackingMethod[] = ['rfid', 'rfid', 'rfid', 'gps', 'barcode'];
    const statuses: AssetStatus[] = ['in-transit', 'stationary', 'processing', 'staging'];
    const zoneNames = ['Receiving', 'Raw Material Storage', 'Production Floor', 'Quality Control', 'Staging Area', 'Finished Goods', 'Shipping'];

    return Array.from({ length: 15 }, (_, i) => {
      const type = types[i % types.length];
      const zone = zoneNames[Math.floor(Math.random() * zoneNames.length)];

      // Generate movement history
      const history: LocationHistoryPoint[] = [];
      for (let j = 0; j < 5; j++) {
        history.push({
          zone: zoneNames[Math.floor(Math.random() * zoneNames.length)],
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          timestamp: new Date(Date.now() - (5 - j) * 10 * 60 * 1000),
        });
      }

      return {
        id: `asset-${i + 1}`,
        name: type === 'material' ? `Material Batch ${i + 1}` :
              type === 'wip' ? `WIP-${1000 + i}` :
              type === 'finished' ? `FG-${2000 + i}` :
              `Container C-${100 + i}`,
        type,
        trackingId: `${methods[i % methods.length].toUpperCase()}-${String(10000 + i).padStart(6, '0')}`,
        trackingMethod: methods[i % methods.length],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: {
          zone,
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
        },
        lastUpdate: new Date(Date.now() - Math.random() * 300000),
        destination: Math.random() > 0.5 ? zoneNames[Math.floor(Math.random() * zoneNames.length)] : undefined,
        workOrder: Math.random() > 0.5 ? `WO-${Math.floor(4000 + Math.random() * 1000)}` : undefined,
        quantity: Math.floor(10 + Math.random() * 90),
        unit: 'units',
        history,
      };
    });
  }, []);

  // Initialize assets
  useEffect(() => {
    setAssets(generateAssets());
    setIsLoading(false);
  }, [generateAssets]);

  // Simulate asset movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        if (asset.status === 'in-transit' || Math.random() > 0.9) {
          const newX = Math.max(5, Math.min(95, asset.location.x + (Math.random() - 0.5) * 10));
          const newY = Math.max(5, Math.min(95, asset.location.y + (Math.random() - 0.5) * 10));

          return {
            ...asset,
            location: {
              ...asset.location,
              x: newX,
              y: newY,
            },
            lastUpdate: new Date(),
            history: [
              ...asset.history.slice(-9),
              { zone: asset.location.zone, x: newX, y: newY, timestamp: new Date() },
            ],
          };
        }
        return asset;
      }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.trackingId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Count assets per zone
  const assetCountByZone = assets.reduce((acc, asset) => {
    acc[asset.location.zone] = (acc[asset.location.zone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAssetSelect = (asset: TrackedAsset) => {
    setSelectedAsset(asset);
    onAssetClick?.(asset);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Asset Tracking Map</h2>
              <p className="text-sm text-cyan-100">{assets.length} assets tracked | GPS & RFID enabled</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Live Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or tracking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AssetType | 'all')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All Types</option>
              {(Object.keys(assetTypeConfig) as AssetType[]).map(type => (
                <option key={type} value={type}>{assetTypeConfig[type].label}</option>
              ))}
            </select>
          </div>

          {/* Trail Toggle */}
          <button
            onClick={() => setShowTrails(!showTrails)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              showTrails
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            Show Trails
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
        {/* Map View */}
        <div className="lg:col-span-3 relative h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <svg className="absolute inset-0 w-full h-full">
            {/* Grid */}
            <defs>
              <pattern id="asset-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#asset-grid)" />

            {/* Zones */}
            {zones.map(zone => (
              <ZoneOverlay
                key={zone.id}
                zone={zone}
                assetCount={assetCountByZone[zone.name] || 0}
                onClick={() => onZoneClick?.(zone)}
              />
            ))}

            {/* Assets */}
            {filteredAssets.map(asset => (
              <AssetMarker
                key={asset.id}
                asset={asset}
                isSelected={selectedAsset?.id === asset.id}
                onClick={() => handleAssetSelect(asset)}
                showTrail={showTrails}
              />
            ))}
          </svg>

          {/* Selected Asset Detail */}
          {selectedAsset && (
            <AssetDetailPanel
              asset={selectedAsset}
              onClose={() => setSelectedAsset(null)}
            />
          )}
        </div>

        {/* Asset List */}
        <div className="border-l border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Tracked Assets ({filteredAssets.length})
            </h3>
          </div>
          <div className="h-[450px] overflow-y-auto p-3 space-y-2">
            {filteredAssets.map(asset => (
              <AssetListItem
                key={asset.id}
                asset={asset}
                isSelected={selectedAsset?.id === asset.id}
                onClick={() => handleAssetSelect(asset)}
              />
            ))}
            {filteredAssets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-10 h-10 mb-2 text-gray-300" />
                <p className="text-sm">No assets match your filter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          {(Object.entries(assetTypeConfig) as [AssetType, typeof assetTypeConfig.material][]).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${config.bgColor}`} />
              <span className="text-gray-600 dark:text-gray-400">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssetTrackingMap;
