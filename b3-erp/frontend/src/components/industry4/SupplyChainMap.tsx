'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Truck,
  Ship,
  Plane,
  Package,
  Factory,
  AlertTriangle,
  Clock,
  TrendingUp,
  Eye,
  Filter,
  RefreshCw,
  ChevronRight,
  Navigation,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type ShipmentStatus = 'in-transit' | 'delayed' | 'on-time' | 'delivered' | 'pending';
export type TransportMode = 'truck' | 'ship' | 'air' | 'rail';
export type LocationType = 'supplier' | 'warehouse' | 'factory' | 'distribution-center' | 'port';

export interface GeoLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  origin: GeoLocation;
  destination: GeoLocation;
  currentLocation: GeoLocation;
  transportMode: TransportMode;
  status: ShipmentStatus;
  progress: number;
  estimatedArrival: string;
  actualArrival?: string;
  contents: string;
  quantity: number;
  value: number;
  carrier: string;
  trackingNumber: string;
}

export interface SupplyNode {
  id: string;
  name: string;
  type: LocationType;
  location: GeoLocation;
  status: 'active' | 'warning' | 'critical' | 'inactive';
  activeShipments: number;
  throughput: number;
  reliability: number;
}

export interface SupplyChainMapProps {
  onShipmentClick?: (shipment: Shipment) => void;
  onNodeClick?: (node: SupplyNode) => void;
  refreshInterval?: number;
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockNodes = (): SupplyNode[] => [
  {
    id: 'node-1',
    name: 'Shanghai Manufacturing Hub',
    type: 'supplier',
    location: { lat: 31.23, lng: 121.47, name: 'Shanghai', country: 'China' },
    status: 'active',
    activeShipments: 12,
    throughput: 94,
    reliability: 97,
  },
  {
    id: 'node-2',
    name: 'Munich Distribution Center',
    type: 'distribution-center',
    location: { lat: 48.14, lng: 11.58, name: 'Munich', country: 'Germany' },
    status: 'active',
    activeShipments: 8,
    throughput: 98,
    reliability: 99,
  },
  {
    id: 'node-3',
    name: 'Los Angeles Port',
    type: 'port',
    location: { lat: 33.75, lng: -118.19, name: 'Los Angeles', country: 'USA' },
    status: 'warning',
    activeShipments: 15,
    throughput: 78,
    reliability: 85,
  },
  {
    id: 'node-4',
    name: 'Tokyo Warehouse',
    type: 'warehouse',
    location: { lat: 35.68, lng: 139.76, name: 'Tokyo', country: 'Japan' },
    status: 'active',
    activeShipments: 6,
    throughput: 92,
    reliability: 96,
  },
  {
    id: 'node-5',
    name: 'Main Factory',
    type: 'factory',
    location: { lat: 40.71, lng: -74.01, name: 'New York', country: 'USA' },
    status: 'active',
    activeShipments: 22,
    throughput: 96,
    reliability: 98,
  },
  {
    id: 'node-6',
    name: 'São Paulo Supplier',
    type: 'supplier',
    location: { lat: -23.55, lng: -46.63, name: 'São Paulo', country: 'Brazil' },
    status: 'critical',
    activeShipments: 3,
    throughput: 65,
    reliability: 72,
  },
  {
    id: 'node-7',
    name: 'Rotterdam Hub',
    type: 'port',
    location: { lat: 51.92, lng: 4.48, name: 'Rotterdam', country: 'Netherlands' },
    status: 'active',
    activeShipments: 18,
    throughput: 95,
    reliability: 97,
  },
  {
    id: 'node-8',
    name: 'Singapore Logistics',
    type: 'distribution-center',
    location: { lat: 1.35, lng: 103.82, name: 'Singapore', country: 'Singapore' },
    status: 'active',
    activeShipments: 14,
    throughput: 99,
    reliability: 99,
  },
];

const generateMockShipments = (): Shipment[] => [
  {
    id: 'ship-1',
    orderId: 'PO-2024-001234',
    origin: { lat: 31.23, lng: 121.47, name: 'Shanghai', country: 'China' },
    destination: { lat: 40.71, lng: -74.01, name: 'New York', country: 'USA' },
    currentLocation: { lat: 35.68, lng: -140.0, name: 'Pacific Ocean', country: 'International Waters' },
    transportMode: 'ship',
    status: 'in-transit',
    progress: 65,
    estimatedArrival: '2024-12-15',
    contents: 'Electronic Components',
    quantity: 5000,
    value: 125000,
    carrier: 'Maersk Line',
    trackingNumber: 'MAEU1234567',
  },
  {
    id: 'ship-2',
    orderId: 'PO-2024-001235',
    origin: { lat: 48.14, lng: 11.58, name: 'Munich', country: 'Germany' },
    destination: { lat: 40.71, lng: -74.01, name: 'New York', country: 'USA' },
    currentLocation: { lat: 52.52, lng: -30.0, name: 'Atlantic Ocean', country: 'International Waters' },
    transportMode: 'air',
    status: 'on-time',
    progress: 80,
    estimatedArrival: '2024-12-08',
    contents: 'Precision Tools',
    quantity: 200,
    value: 45000,
    carrier: 'Lufthansa Cargo',
    trackingNumber: 'LH8765432',
  },
  {
    id: 'ship-3',
    orderId: 'PO-2024-001236',
    origin: { lat: -23.55, lng: -46.63, name: 'São Paulo', country: 'Brazil' },
    destination: { lat: 40.71, lng: -74.01, name: 'New York', country: 'USA' },
    currentLocation: { lat: 10.0, lng: -60.0, name: 'Caribbean Sea', country: 'International Waters' },
    transportMode: 'ship',
    status: 'delayed',
    progress: 45,
    estimatedArrival: '2024-12-20',
    contents: 'Raw Materials',
    quantity: 15000,
    value: 78000,
    carrier: 'MSC',
    trackingNumber: 'MSCU9876543',
  },
  {
    id: 'ship-4',
    orderId: 'PO-2024-001237',
    origin: { lat: 35.68, lng: 139.76, name: 'Tokyo', country: 'Japan' },
    destination: { lat: 33.75, lng: -118.19, name: 'Los Angeles', country: 'USA' },
    currentLocation: { lat: 40.0, lng: -150.0, name: 'Pacific Ocean', country: 'International Waters' },
    transportMode: 'ship',
    status: 'in-transit',
    progress: 72,
    estimatedArrival: '2024-12-12',
    contents: 'Semiconductors',
    quantity: 10000,
    value: 350000,
    carrier: 'Evergreen',
    trackingNumber: 'EGLV2345678',
  },
  {
    id: 'ship-5',
    orderId: 'PO-2024-001238',
    origin: { lat: 1.35, lng: 103.82, name: 'Singapore', country: 'Singapore' },
    destination: { lat: 51.92, lng: 4.48, name: 'Rotterdam', country: 'Netherlands' },
    currentLocation: { lat: 12.0, lng: 60.0, name: 'Indian Ocean', country: 'International Waters' },
    transportMode: 'ship',
    status: 'on-time',
    progress: 55,
    estimatedArrival: '2024-12-18',
    contents: 'Assembly Parts',
    quantity: 8000,
    value: 92000,
    carrier: 'CMA CGM',
    trackingNumber: 'CMAU3456789',
  },
];

// ============================================================================
// Helper Components
// ============================================================================

function TransportIcon({ mode, className }: { mode: TransportMode; className?: string }) {
  switch (mode) {
    case 'ship':
      return <Ship className={className} />;
    case 'air':
      return <Plane className={className} />;
    case 'truck':
      return <Truck className={className} />;
    case 'rail':
      return <Navigation className={className} />;
    default:
      return <Package className={className} />;
  }
}

function LocationIcon({ type, className }: { type: LocationType; className?: string }) {
  switch (type) {
    case 'factory':
      return <Factory className={className} />;
    case 'supplier':
      return <Package className={className} />;
    case 'port':
      return <Ship className={className} />;
    default:
      return <MapPin className={className} />;
  }
}

function StatusBadge({ status }: { status: ShipmentStatus }) {
  const colors = {
    'in-transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'delayed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'on-time': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'delivered': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
}

// ============================================================================
// World Map Component (SVG-based)
// ============================================================================

function WorldMapCanvas({
  nodes,
  shipments,
  selectedShipment,
  onShipmentClick,
  onNodeClick,
}: {
  nodes: SupplyNode[];
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  onShipmentClick: (shipment: Shipment) => void;
  onNodeClick: (node: SupplyNode) => void;
}) {
  // Convert lat/lng to SVG coordinates (simple equirectangular projection)
  const toSvgCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  // Calculate path between two points
  const calculatePath = (start: GeoLocation, end: GeoLocation, current: GeoLocation) => {
    const s = toSvgCoords(start.lat, start.lng);
    const e = toSvgCoords(end.lat, end.lng);
    const c = toSvgCoords(current.lat, current.lng);
    return { start: s, end: e, current: c };
  };

  const nodeColors = {
    active: '#22c55e',
    warning: '#f59e0b',
    critical: '#ef4444',
    inactive: '#9ca3af',
  };

  const shipmentColors = {
    'in-transit': '#3b82f6',
    'delayed': '#ef4444',
    'on-time': '#22c55e',
    'delivered': '#9ca3af',
    'pending': '#f59e0b',
  };

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full bg-slate-900 rounded-lg">
      {/* Simplified world map background */}
      <defs>
        <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="400" fill="url(#oceanGradient)" />

      {/* Simplified continent outlines */}
      <g opacity="0.3" fill="#475569" stroke="#64748b" strokeWidth="0.5">
        {/* North America */}
        <path d="M50,80 L180,60 L200,100 L220,80 L240,100 L200,160 L160,200 L100,180 L80,140 Z" />
        {/* South America */}
        <path d="M140,220 L180,200 L200,260 L180,340 L140,360 L120,300 L130,240 Z" />
        {/* Europe */}
        <path d="M340,80 L420,60 L440,100 L420,120 L380,140 L340,120 Z" />
        {/* Africa */}
        <path d="M360,160 L440,140 L460,200 L440,280 L380,320 L340,280 L350,200 Z" />
        {/* Asia */}
        <path d="M460,60 L620,40 L680,80 L700,140 L660,180 L580,200 L500,180 L460,140 L480,100 Z" />
        {/* Australia */}
        <path d="M620,260 L700,240 L720,280 L700,320 L640,320 L620,300 Z" />
      </g>

      {/* Grid lines */}
      <g stroke="#334155" strokeWidth="0.3" opacity="0.5">
        {[0, 80, 160, 240, 320, 400].map(y => (
          <line key={`h-${y}`} x1="0" y1={y} x2="800" y2={y} />
        ))}
        {[0, 100, 200, 300, 400, 500, 600, 700, 800].map(x => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="400" />
        ))}
      </g>

      {/* Shipment routes */}
      {shipments.map(shipment => {
        const path = calculatePath(shipment.origin, shipment.destination, shipment.currentLocation);
        const isSelected = selectedShipment?.id === shipment.id;
        const color = shipmentColors[shipment.status];

        return (
          <g key={shipment.id}>
            {/* Route line */}
            <line
              x1={path.start.x}
              y1={path.start.y}
              x2={path.end.x}
              y2={path.end.y}
              stroke={color}
              strokeWidth={isSelected ? 3 : 1.5}
              strokeDasharray={isSelected ? 'none' : '4,4'}
              opacity={isSelected ? 1 : 0.6}
            />

            {/* Traveled portion */}
            <line
              x1={path.start.x}
              y1={path.start.y}
              x2={path.current.x}
              y2={path.current.y}
              stroke={color}
              strokeWidth={isSelected ? 3 : 2}
              opacity={1}
            />

            {/* Current position marker */}
            <g
              transform={`translate(${path.current.x}, ${path.current.y})`}
              onClick={() => onShipmentClick(shipment)}
              className="cursor-pointer"
              filter={isSelected ? 'url(#glow)' : undefined}
            >
              <circle r={isSelected ? 12 : 8} fill={color} opacity="0.3">
                <animate attributeName="r" values={isSelected ? '12;16;12' : '8;12;8'} dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r={isSelected ? 8 : 5} fill={color} />
              {shipment.status === 'delayed' && (
                <circle r="10" fill="none" stroke="#ef4444" strokeWidth="2">
                  <animate attributeName="r" values="10;18;10" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          </g>
        );
      })}

      {/* Supply chain nodes */}
      {nodes.map(node => {
        const coords = toSvgCoords(node.location.lat, node.location.lng);
        const color = nodeColors[node.status];

        return (
          <g
            key={node.id}
            transform={`translate(${coords.x}, ${coords.y})`}
            onClick={() => onNodeClick(node)}
            className="cursor-pointer"
          >
            <circle r="15" fill={color} opacity="0.2" />
            <circle r="10" fill={color} opacity="0.4" />
            <circle r="6" fill={color} />

            {/* Node label */}
            <text
              y="22"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="8"
              fontWeight="500"
            >
              {node.location.name}
            </text>

            {/* Active shipments badge */}
            {node.activeShipments > 0 && (
              <g transform="translate(8, -8)">
                <circle r="8" fill="#6366f1" />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="7"
                  fontWeight="bold"
                >
                  {node.activeShipments}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// Shipment Details Panel
// ============================================================================

function ShipmentDetailsPanel({
  shipment,
  onClose,
}: {
  shipment: Shipment;
  onClose: () => void;
}) {
  return (
    <Card className="absolute right-4 top-4 w-80 z-10 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TransportIcon mode={shipment.transportMode} className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-sm">{shipment.orderId}</CardTitle>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <StatusBadge status={shipment.status} />
          <span className="text-sm text-gray-500">{shipment.progress}% complete</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              shipment.status === 'delayed' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${shipment.progress}%` }}
          />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">From:</span>
            <span className="font-medium">{shipment.origin.name}, {shipment.origin.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">To:</span>
            <span className="font-medium">{shipment.destination.name}, {shipment.destination.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Contents:</span>
            <span className="font-medium">{shipment.contents}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Quantity:</span>
            <span className="font-medium">{shipment.quantity.toLocaleString()} units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Value:</span>
            <span className="font-medium text-green-600">${shipment.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">ETA:</span>
            <span className={`font-medium ${shipment.status === 'delayed' ? 'text-red-600' : ''}`}>
              {shipment.estimatedArrival}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Carrier:</span>
            <span className="font-medium">{shipment.carrier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tracking:</span>
            <span className="font-medium font-mono text-xs">{shipment.trackingNumber}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Track
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Node Details Panel
// ============================================================================

function NodeDetailsPanel({
  node,
  onClose,
}: {
  node: SupplyNode;
  onClose: () => void;
}) {
  const statusColors = {
    active: 'text-green-600',
    warning: 'text-amber-600',
    critical: 'text-red-600',
    inactive: 'text-gray-500',
  };

  return (
    <Card className="absolute left-4 top-4 w-72 z-10 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LocationIcon type={node.type} className={`w-5 h-5 ${statusColors[node.status]}`} />
            <CardTitle className="text-sm">{node.name}</CardTitle>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{node.location.name}, {node.location.country}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p className="text-xs text-gray-500">Active Shipments</p>
            <p className="text-lg font-bold text-blue-600">{node.activeShipments}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p className="text-xs text-gray-500">Throughput</p>
            <p className="text-lg font-bold text-green-600">{node.throughput}%</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Reliability Score</span>
            <span className="font-medium">{node.reliability}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                node.reliability >= 90 ? 'bg-green-500' :
                node.reliability >= 75 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${node.reliability}%` }}
            />
          </div>
        </div>

        <Button size="sm" className="w-full">
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Summary Stats
// ============================================================================

function MapStats({ shipments }: { shipments: Shipment[] }) {
  const inTransit = shipments.filter(s => s.status === 'in-transit').length;
  const delayed = shipments.filter(s => s.status === 'delayed').length;
  const totalValue = shipments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="absolute bottom-4 left-4 right-4 flex gap-4 z-10">
      <Card className="flex-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardContent className="py-2 px-4 flex items-center gap-3">
          <Truck className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">In Transit</p>
            <p className="font-bold">{inTransit} shipments</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardContent className="py-2 px-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-xs text-gray-500">Delayed</p>
            <p className="font-bold text-red-600">{delayed} shipments</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardContent className="py-2 px-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="font-bold text-green-600">${(totalValue / 1000).toFixed(0)}K</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function SupplyChainMap({
  onShipmentClick,
  onNodeClick,
  refreshInterval = 30000,
}: SupplyChainMapProps) {
  const [nodes, setNodes] = useState<SupplyNode[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedNode, setSelectedNode] = useState<SupplyNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Initial load
    setNodes(generateMockNodes());
    setShipments(generateMockShipments());
    setIsLoading(false);

    // Refresh interval
    const interval = setInterval(() => {
      setShipments(generateMockShipments());
      setLastUpdated(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleShipmentClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setSelectedNode(null);
    onShipmentClick?.(shipment);
  };

  const handleNodeClick = (node: SupplyNode) => {
    setSelectedNode(node);
    setSelectedShipment(null);
    onNodeClick?.(node);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[500px] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Global Supply Chain Visibility
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4" />
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[500px]">
          <WorldMapCanvas
            nodes={nodes}
            shipments={shipments}
            selectedShipment={selectedShipment}
            onShipmentClick={handleShipmentClick}
            onNodeClick={handleNodeClick}
          />

          {selectedShipment && (
            <ShipmentDetailsPanel
              shipment={selectedShipment}
              onClose={() => setSelectedShipment(null)}
            />
          )}

          {selectedNode && (
            <NodeDetailsPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}

          <MapStats shipments={shipments} />
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-medium">Transport:</span>
            <div className="flex items-center gap-1">
              <Ship className="w-4 h-4 text-blue-500" />
              <span>Sea</span>
            </div>
            <div className="flex items-center gap-1">
              <Plane className="w-4 h-4 text-blue-500" />
              <span>Air</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>Ground</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-medium">Status:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>In Transit</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>On Time</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Delayed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
