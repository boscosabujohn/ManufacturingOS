'use client'

import { useState } from 'react'
import {
  Package,
  Search,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SparePart {
  id: string
  name: string
  partNumber: string
  category: string
  price: number
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
  stockLevel: number
  compatibility: string[]
  leadTime: string
  image: string
}

export default function SparePartsCatalog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  const parts: SparePart[] = [
    {
      id: 'P-101',
      name: 'Hydraulic Seal Kit (Series 500)',
      partNumber: 'SK-HP500-01',
      category: 'Seals & Gaskets',
      price: 1250,
      stockStatus: 'In Stock',
      stockLevel: 45,
      compatibility: ['HP-500', 'HP-300'],
      leadTime: '24 Hours',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'P-102',
      name: 'CNC Spindle Cooling Fan',
      partNumber: 'FAN-CNC-350',
      category: 'Cooling Systems',
      price: 3400,
      stockStatus: 'Low Stock',
      stockLevel: 3,
      compatibility: ['CM-350', 'CM-500'],
      leadTime: '48 Hours',
      image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'P-103',
      name: 'Main Control Board V2.0',
      partNumber: 'PCB-CP1000-M',
      category: 'Electronics',
      price: 45000,
      stockStatus: 'In Stock',
      stockLevel: 12,
      compatibility: ['CP-1000'],
      leadTime: '3-5 Days',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'P-104',
      name: 'Conveyor Drive Roller',
      partNumber: 'ROL-CS200-DR',
      category: 'Mechanical',
      price: 8900,
      stockStatus: 'Out of Stock',
      stockLevel: 0,
      compatibility: ['CS-200'],
      leadTime: '10 Days',
      image: 'https://images.unsplash.com/photo-1531287702811-e6ff7b9b24d3?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'P-105',
      name: 'Emergency Stop Button Assembly',
      partNumber: 'E-STOP-UNV',
      category: 'Safety',
      price: 750,
      stockStatus: 'In Stock',
      stockLevel: 150,
      compatibility: ['All Series'],
      leadTime: 'Same Day',
      image: 'https://images.unsplash.com/photo-1517404212738-1.png'
    }
  ]

  const handleOneClickOrder = (partName: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Processing requisition...',
        success: `Requisition raised for ${partName}! Check your email for approval status.`,
        error: 'Failed to process order.',
      }
    )
    setCartCount(prev => prev + 1)
  }

  const filteredParts = parts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-rose-600" />
              Spare Parts Catalog
            </h1>
            <p className="text-gray-600 mt-2">Genuine parts with direct ordering and compatibility tracking</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Part name or number..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="relative p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredParts.map((part) => (
            <div key={part.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${part.stockStatus === 'In Stock' ? 'bg-green-500 text-white' :
                      part.stockStatus === 'Low Stock' ? 'bg-amber-500 text-white' :
                        'bg-gray-500 text-white'
                    }`}>
                    {part.stockStatus}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 space-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{part.category}</p>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors leading-tight">
                    {part.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Part #: {part.partNumber}</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg">
                  <Info className="h-3 w-3 text-blue-500" />
                  <span>Compatible with: {part.compatibility.join(', ')}</span>
                </div>

                <div className="pt-2 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-gray-900">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(part.price)}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <ArrowRight className="h-3 w-3" />
                      {part.leadTime} Lead
                    </span>
                  </div>
                  <button
                    onClick={() => handleOneClickOrder(part.name)}
                    disabled={part.stockStatus === 'Out of Stock'}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${part.stockStatus === 'Out of Stock'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95'
                      }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                    One-Click Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-10 text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-4xl font-black leading-tight">Consolidated Parts Management</h2>
            <p className="text-slate-400 text-lg">
              Manage inventory across multiple sites, track usage patterns, and automate reordering for critical components.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-rose-600 rounded-2xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20">
                View Inventory Analytics
              </button>
              <button className="px-8 py-4 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700 transition-colors border border-slate-700">
                Bulk Requisition
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-10 pointer-events-none">
            <Package className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  )
}