'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  FileText,
  X,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  IndianRupee,
  Package,
  Calendar,
  Clock,
  Percent,
  Box,
  ListTree,
  AlertCircle,
  CheckCircle,
  Info,
  Upload,
  Copy,
  Grid,
  ArrowUp,
  ArrowDown,
  Indent,
  Outdent,
  Eye,
  Layers,
  DollarSign,
  TrendingUp,
  Link2,
  Factory,
  Settings,
  FileSpreadsheet,
  BookTemplate,
} from 'lucide-react';

interface BOMComponent {
  id: string;
  level: number;
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  uom: string;
  itemType: 'raw_material' | 'component' | 'semi_finished' | 'assembly' | 'purchased_part';
  stockAvailable: number;
  costPerUnit: number;
  extendedCost: number;
  makeOrBuy: 'make' | 'buy';
  scrapPercent: number;
  isRequired: boolean;
  isPhantom: boolean;
  alternatives?: string;
  referenceDesignator?: string;
  assemblyNotes?: string;
  supplierPreference?: string;
  children?: BOMComponent[];
}

interface Product {
  code: string;
  name: string;
  description: string;
  drawingNumber: string;
  uom: string;
  category: string;
}

interface BOM {
  bomNumber: string;
  productCode: string;
  productName: string;
  productDescription: string;
  drawingNumber: string;
  version: string;
  revision: string;
  bomType: 'manufacturing' | 'engineering' | 'planning' | 'costing';
  effectiveDate: string;
  expiryDate: string;
  batchSize: number;
  leadTime: number;
  scrapPercentage: number;
  uom: string;
  components: BOMComponent[];
}

const mockProducts: Product[] = [
  { code: 'PROD-CAB-001', name: 'Premium Kitchen Cabinet - Modular', description: 'High-quality modular kitchen cabinet', drawingNumber: 'DWG-CAB-001-R2', uom: 'Units', category: 'Finished Good' },
  { code: 'PROD-TBL-001', name: 'Stainless Steel Worktable', description: 'Commercial grade worktable', drawingNumber: 'DWG-TBL-001', uom: 'Units', category: 'Finished Good' },
  { code: 'PROD-FURN-001', name: 'Office Steel Furniture', description: 'Modular office furniture', drawingNumber: 'DWG-FURN-001', uom: 'Units', category: 'Finished Good' },
  { code: 'PROD-PANEL-001', name: 'Electrical Control Panel', description: 'Industrial control panel with MCB', drawingNumber: 'DWG-PANEL-001', uom: 'Units', category: 'Finished Good' },
  { code: 'PROD-MOTOR-001', name: 'AC Motor Assembly - 5HP', description: 'Industrial AC motor', drawingNumber: 'DWG-MOTOR-001', uom: 'Units', category: 'Assembly' },
];

const mockItems = [
  { code: 'RM-WOOD-PLY-18', name: 'BWP Plywood 18mm', description: 'Boiling Water Proof Plywood - Premium Grade', type: 'raw_material', uom: 'Sheets', stock: 120, cost: 1800.00 },
  { code: 'RM-WOOD-PLY-12', name: 'BWP Plywood 12mm', description: 'Thinner plywood for door panel', type: 'raw_material', uom: 'Sheets', stock: 80, cost: 1100.00 },
  { code: 'RM-LAMINATE-001', name: 'Decorative Laminate', description: 'High-pressure laminate - Matte finish', type: 'raw_material', uom: 'Sheets', stock: 45, cost: 150.00 },
  { code: 'RM-LAMINATE-002', name: 'Premium Laminate', description: 'High-gloss laminate for doors', type: 'raw_material', uom: 'Sheets', stock: 25, cost: 200.00 },
  { code: 'RM-ADHESIVE-WD', name: 'Wood Adhesive', description: 'Industrial grade wood glue', type: 'raw_material', uom: 'Kg', stock: 25, cost: 250.00 },
  { code: 'RM-EDGEBAND-001', name: 'Edge Banding Tape', description: 'PVC edge banding - 1mm thickness', type: 'raw_material', uom: 'Meters', stock: 500, cost: 5.00 },
  { code: 'RM-STEEL-SHEET', name: 'Steel Sheet - 2mm', description: 'Cold rolled steel sheet', type: 'raw_material', uom: 'Sheets', stock: 50, cost: 2500.00 },
  { code: 'RM-PAINT-ENAMEL', name: 'Enamel Paint', description: 'Industrial enamel paint', type: 'raw_material', uom: 'Liters', stock: 100, cost: 450.00 },
  { code: 'COMP-HINGE-SC', name: 'Soft-Close Hinge', description: 'Hydraulic soft-close hinge - European style', type: 'purchased_part', uom: 'Pieces', stock: 200, cost: 85.00 },
  { code: 'COMP-HANDLE-001', name: 'Cabinet Handle', description: 'Stainless steel C-handle - 128mm', type: 'purchased_part', uom: 'Piece', stock: 150, cost: 75.00 },
  { code: 'COMP-SCREW-001', name: 'Mounting Screws', description: 'Self-tapping screws - 4x16mm', type: 'purchased_part', uom: 'Pieces', stock: 5000, cost: 0.50 },
  { code: 'COMP-LEG-ADJ', name: 'Adjustable Leg', description: 'Height adjustable leg - Stainless steel', type: 'purchased_part', uom: 'Pieces', stock: 120, cost: 45.00 },
  { code: 'COMP-MCB-16A', name: 'MCB 16A', description: 'Miniature Circuit Breaker', type: 'purchased_part', uom: 'Pieces', stock: 80, cost: 250.00 },
  { code: 'COMP-BEARING-6205', name: 'Ball Bearing 6205', description: 'Deep groove ball bearing', type: 'purchased_part', uom: 'Pieces', stock: 150, cost: 180.00 },
  { code: 'SFG-DOOR-PANEL', name: 'Door Panel - Laminated', description: 'Pre-laminated door panel', type: 'semi_finished', uom: 'Unit', stock: 30, cost: 950.00 },
  { code: 'SFG-STEEL-FRAME', name: 'Steel Frame - Welded', description: 'Pre-welded steel frame', type: 'semi_finished', uom: 'Unit', stock: 20, cost: 3500.00 },
  { code: 'ASSY-FRAME-001', name: 'Cabinet Frame Assembly', description: 'Main frame structure with side panels', type: 'assembly', uom: 'Unit', stock: 15, cost: 5200.00 },
  { code: 'ASSY-DOOR-001', name: 'Cabinet Door Assembly', description: 'Soft-close door with handle', type: 'assembly', uom: 'Units', stock: 8, cost: 1250.00 },
];

const mockExistingBOMs = [
  { productCode: 'PROD-CAB-001', productName: 'Premium Kitchen Cabinet - Modular', bomNumber: 'BOM-2025-001', version: 'V2.1' },
  { productCode: 'PROD-TBL-001', productName: 'Stainless Steel Worktable', bomNumber: 'BOM-2025-002', version: 'V1.0' },
];

const itemTypeColors = {
  raw_material: 'bg-orange-100 text-orange-700',
  component: 'bg-blue-100 text-blue-700',
  semi_finished: 'bg-purple-100 text-purple-700',
  assembly: 'bg-teal-100 text-teal-700',
  purchased_part: 'bg-pink-100 text-pink-700',
};

const itemTypeLabels = {
  raw_material: 'Raw Material',
  component: 'Component',
  semi_finished: 'Semi-Finished',
  assembly: 'Assembly',
  purchased_part: 'Purchased Part',
};

const itemTypeFilters = [
  { value: '', label: 'All Types' },
  { value: 'raw_material', label: 'Raw Materials' },
  { value: 'component', label: 'Components' },
  { value: 'semi_finished', label: 'Semi-Finished' },
  { value: 'assembly', label: 'Assemblies' },
  { value: 'purchased_part', label: 'Purchased Parts' },
];

export default function BOMAddPage() {
  const router = useRouter();
  const [bom, setBom] = useState<BOM>({
    bomNumber: `BOM-2025-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
    productCode: '',
    productName: '',
    productDescription: '',
    drawingNumber: '',
    version: 'V1.0',
    revision: 'R1',
    bomType: 'manufacturing',
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    batchSize: 1,
    leadTime: 0,
    scrapPercentage: 0,
    uom: '',
    components: [],
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [components, setComponents] = useState<BOMComponent[]>([]);
  const [showItemSearch, setShowItemSearch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('');
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedCopyBOM, setSelectedCopyBOM] = useState('');
  const [entryMethod, setEntryMethod] = useState<'manual' | 'copy' | 'import' | 'template'>('manual');

  useEffect(() => {
    // Auto-generate BOM number
    const generateBOMNumber = () => {
      const year = new Date().getFullYear();
      const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      return `BOM-${year}-${random}`;
    };

    setBom(prev => ({ ...prev, bomNumber: generateBOMNumber() }));
  }, []);

  const toggleComponent = (id: string) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedComponents(newExpanded);
  };

  const calculateExtendedCost = (quantity: number, costPerUnit: number): number => {
    return quantity * costPerUnit;
  };

  const calculateTotalCost = (comps: BOMComponent[]): number => {
    let total = 0;
    comps.forEach((comp) => {
      total += comp.extendedCost;
      if (comp.children) {
        total += calculateTotalCost(comp.children);
      }
    });
    return total;
  };

  const calculateMaterialCost = (comps: BOMComponent[]): number => {
    let total = 0;
    comps.forEach((comp) => {
      if (comp.itemType === 'raw_material' || comp.itemType === 'purchased_part') {
        total += comp.extendedCost;
      }
      if (comp.children) {
        total += calculateMaterialCost(comp.children);
      }
    });
    return total;
  };

  const handleProductChange = (productCode: string) => {
    const product = mockProducts.find((p) => p.code === productCode);
    if (product) {
      setSelectedProduct(product);
      setBom({
        ...bom,
        productCode: product.code,
        productName: product.name,
        productDescription: product.description,
        drawingNumber: product.drawingNumber,
        uom: product.uom,
      });
    }
  };

  const handleItemSelect = (componentId: string, item: any) => {
    const updateComponentItem = (comps: BOMComponent[]): BOMComponent[] => {
      return comps.map((comp) => {
        if (comp.id === componentId) {
          const newComp = {
            ...comp,
            itemCode: item.code,
            itemName: item.name,
            description: item.description,
            uom: item.uom,
            itemType: item.type,
            stockAvailable: item.stock,
            costPerUnit: item.cost,
            extendedCost: calculateExtendedCost(comp.quantity, item.cost),
          };
          return newComp;
        }
        if (comp.children) {
          return {
            ...comp,
            children: updateComponentItem(comp.children),
          };
        }
        return comp;
      });
    };

    setComponents(updateComponentItem(components));
    setShowItemSearch(null);
    setSearchQuery('');
    setItemTypeFilter('');
  };

  const handleQuantityChange = (componentId: string, quantity: number) => {
    const updateQuantity = (comps: BOMComponent[]): BOMComponent[] => {
      return comps.map((comp) => {
        if (comp.id === componentId) {
          return {
            ...comp,
            quantity,
            extendedCost: calculateExtendedCost(quantity, comp.costPerUnit),
          };
        }
        if (comp.children) {
          return {
            ...comp,
            children: updateQuantity(comp.children),
          };
        }
        return comp;
      });
    };

    setComponents(updateQuantity(components));
  };

  const handleScrapPercentChange = (componentId: string, scrapPercent: number) => {
    const updateScrap = (comps: BOMComponent[]): BOMComponent[] => {
      return comps.map((comp) => {
        if (comp.id === componentId) {
          return { ...comp, scrapPercent };
        }
        if (comp.children) {
          return {
            ...comp,
            children: updateScrap(comp.children),
          };
        }
        return comp;
      });
    };

    setComponents(updateScrap(components));
  };

  const addComponent = (level: number, parentId?: string) => {
    const newComponent: BOMComponent = {
      id: `new-${Date.now()}-${Math.random()}`,
      level,
      itemCode: '',
      itemName: '',
      description: '',
      quantity: 1,
      uom: '',
      itemType: 'raw_material',
      stockAvailable: 0,
      costPerUnit: 0,
      extendedCost: 0,
      makeOrBuy: 'buy',
      scrapPercent: 0,
      isRequired: true,
      isPhantom: false,
    };

    if (parentId) {
      const addToParent = (comps: BOMComponent[]): BOMComponent[] => {
        return comps.map((comp) => {
          if (comp.id === parentId) {
            return {
              ...comp,
              children: [...(comp.children || []), newComponent],
            };
          }
          if (comp.children) {
            return {
              ...comp,
              children: addToParent(comp.children),
            };
          }
          return comp;
        });
      };
      setComponents(addToParent(components));
      setExpandedComponents(new Set([...expandedComponents, parentId]));
    } else {
      setComponents([...components, newComponent]);
    }
  };

  const removeComponent = (componentId: string) => {
    const removeFromTree = (comps: BOMComponent[]): BOMComponent[] => {
      return comps
        .filter((comp) => comp.id !== componentId)
        .map((comp) => ({
          ...comp,
          children: comp.children ? removeFromTree(comp.children) : undefined,
        }));
    };

    setComponents(removeFromTree(components));
  };

  const checkCircularReference = (components: BOMComponent[], productCode: string): boolean => {
    // Check if any component references the parent product (circular reference)
    for (const comp of components) {
      if (comp.itemCode === productCode) {
        return true;
      }
      if (comp.children && checkCircularReference(comp.children, productCode)) {
        return true;
      }
    }
    return false;
  };

  const checkDuplicateComponents = (components: BOMComponent[]): string[] => {
    const duplicates: string[] = [];
    const seen = new Set<string>();

    const checkDuplicates = (comps: BOMComponent[], level: number) => {
      comps.forEach((comp) => {
        if (comp.itemCode) {
          const key = `${level}-${comp.itemCode}`;
          if (seen.has(key)) {
            duplicates.push(`${comp.itemCode} (Level ${level})`);
          }
          seen.add(key);
        }
        if (comp.children) {
          checkDuplicates(comp.children, level + 1);
        }
      });
    };

    checkDuplicates(components, 0);
    return duplicates;
  };

  const validateBOM = (): boolean => {
    const errors: string[] = [];

    if (!bom.productCode) {
      errors.push('Please select a product');
    }

    if (!bom.version) {
      errors.push('Version is required');
    }

    if (components.length === 0) {
      errors.push('BOM must have at least one component');
    }

    // Check circular references
    if (checkCircularReference(components, bom.productCode)) {
      errors.push('Circular reference detected: Component cannot include the parent product');
    }

    // Check duplicates
    const duplicates = checkDuplicateComponents(components);
    if (duplicates.length > 0) {
      errors.push(`Duplicate components detected at same level: ${duplicates.join(', ')}`);
    }

    const validateComponents = (comps: BOMComponent[]) => {
      comps.forEach((comp) => {
        if (!comp.itemCode) {
          errors.push(`Component at level ${comp.level} is missing item code`);
        }
        if (comp.quantity <= 0) {
          errors.push(`${comp.itemCode || 'Unknown'}: Quantity must be greater than 0`);
        }
        if (comp.scrapPercent < 0 || comp.scrapPercent > 100) {
          errors.push(`${comp.itemCode || 'Unknown'}: Scrap percentage must be between 0 and 100`);
        }
        if (comp.children) {
          validateComponents(comp.children);
        }
      });
    };

    validateComponents(components);

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = (status: 'draft' | 'submit' | 'activate') => {
    if (validateBOM()) {
      console.log('Saving BOM with status:', status, { ...bom, components });
      router.push('/production/bom');
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      router.push('/production/bom');
    }
  };

  const handleCopyFromExisting = () => {
    if (selectedCopyBOM) {
      // In real implementation, fetch BOM data and copy components
      console.log('Copying from BOM:', selectedCopyBOM);
      setShowCopyModal(false);
      // Add sample components for demo
      addComponent(0);
    }
  };

  const handleImportFromExcel = () => {
    // Placeholder for Excel import
    alert('Excel import functionality: Select an Excel file with BOM structure');
  };

  const renderComponentRow = (component: BOMComponent, parentId?: string): JSX.Element[] => {
    const isExpanded = expandedComponents.has(component.id);
    const hasChildren = component.children && component.children.length > 0;
    const isSearching = showItemSearch === component.id;

    const filteredItems = mockItems.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !itemTypeFilter || item.type === itemTypeFilter;
      return matchesSearch && matchesType;
    });

    const rows: JSX.Element[] = [
      <tr key={component.id} className="hover:bg-gray-50 border-b border-gray-200">
        <td className="px-3 py-2">
          <div className="flex items-center space-x-2" style={{ paddingLeft: `${component.level * 24}px` }}>
            {hasChildren ? (
              <button
                onClick={() => toggleComponent(component.id)}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
            ) : (
              <span className="w-5"></span>
            )}
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              {component.level}
            </span>
          </div>
        </td>
        <td className="px-3 py-2">
          <div className="relative">
            {!component.itemCode ? (
              <button
                onClick={() => setShowItemSearch(component.id)}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-left text-sm text-gray-500 hover:bg-blue-50 hover:border-blue-400 flex items-center justify-between"
              >
                <span>Click to select item...</span>
                <Search className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="font-mono text-sm font-semibold text-gray-900">{component.itemCode}</div>
                  <div className="text-xs text-gray-600">{component.itemName}</div>
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${itemTypeColors[component.itemType]}`}>
                    {itemTypeLabels[component.itemType]}
                  </span>
                </div>
                <button
                  onClick={() => setShowItemSearch(component.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Search className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            )}

            {isSearching && (
              <div className="absolute top-full left-0 mt-1 w-[32rem] bg-white border border-gray-300 rounded-lg shadow-xl z-20">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by code or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={() => {
                        setShowItemSearch(null);
                        setSearchQuery('');
                        setItemTypeFilter('');
                      }}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <select
                    value={itemTypeFilter}
                    onChange={(e) => setItemTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {itemTypeFilters.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => handleItemSelect(component.id, item)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-mono text-sm font-semibold text-gray-900">{item.code}</div>
                            <div className="text-sm text-gray-700 mt-0.5">{item.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${itemTypeColors[item.type as keyof typeof itemTypeColors]}`}>
                                {itemTypeLabels[item.type as keyof typeof itemTypeLabels]}
                              </span>
                              <span className="text-xs text-gray-600">Stock: <span className="font-semibold">{item.stock}</span></span>
                              <span className="text-xs text-gray-600">UOM: <span className="font-semibold">{item.uom}</span></span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center text-lg font-bold text-green-700">
                              <IndianRupee className="h-4 w-4" />
                              <span>{item.cost.toFixed(2)}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">per {item.uom}</div>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No items found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </td>
        <td className="px-3 py-2">
          <input
            type="number"
            value={component.quantity}
            onChange={(e) => handleQuantityChange(component.id, parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0"
          />
        </td>
        <td className="px-3 py-2 text-center">
          <span className="text-sm text-gray-700">{component.uom || '-'}</span>
        </td>
        <td className="px-3 py-2">
          <input
            type="number"
            value={component.scrapPercent}
            onChange={(e) => handleScrapPercentChange(component.id, parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.1"
            min="0"
            max="100"
          />
        </td>
        <td className="px-3 py-2 text-center">
          <span className={`text-sm font-semibold ${component.stockAvailable > 0 ? 'text-green-700' : 'text-red-700'}`}>
            {component.stockAvailable}
          </span>
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center justify-end text-gray-900 text-sm">
            <IndianRupee className="h-3.5 w-3.5" />
            <span>{component.costPerUnit.toFixed(2)}</span>
          </div>
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center justify-end text-blue-900 font-semibold text-sm">
            <IndianRupee className="h-4 w-4" />
            <span>{component.extendedCost.toFixed(2)}</span>
          </div>
        </td>
        <td className="px-3 py-2">
          <select
            value={component.makeOrBuy}
            onChange={(e) => {
              const updateMakeOrBuy = (comps: BOMComponent[]): BOMComponent[] => {
                return comps.map((comp) => {
                  if (comp.id === component.id) {
                    return { ...comp, makeOrBuy: e.target.value as 'make' | 'buy' };
                  }
                  if (comp.children) {
                    return { ...comp, children: updateMakeOrBuy(comp.children) };
                  }
                  return comp;
                });
              };
              setComponents(updateMakeOrBuy(components));
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="make">Make</option>
            <option value="buy">Buy</option>
          </select>
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center space-x-1">
            {component.level < 3 && (
              <button
                onClick={() => addComponent(component.level + 1, component.id)}
                className="p-1 hover:bg-blue-100 rounded text-blue-600"
               
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => removeComponent(component.id)}
              className="p-1 hover:bg-red-100 rounded text-red-600"
             
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>,
    ];

    if (isExpanded && hasChildren && component.children) {
      component.children.forEach((child) => {
        rows.push(...renderComponentRow(child, component.id));
      });
    }

    return rows;
  };

  const totalCost = calculateTotalCost(components);
  const materialCost = calculateMaterialCost(components);
  const laborCost = totalCost * 0.15; // Estimated 15% of total
  const overheadCost = totalCost * 0.10; // Estimated 10% of total
  const scrapCost = (materialCost * bom.scrapPercentage) / 100;
  const grandTotal = totalCost + laborCost + overheadCost + scrapCost;
  const suggestedPrice30 = grandTotal * 1.3;
  const suggestedPrice40 = grandTotal * 1.4;

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/production/bom')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to BOM List</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Bill of Materials</h1>
              <p className="text-sm text-gray-500 mt-1">BOM Number: <span className="font-semibold text-gray-700">{bom.bomNumber}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSave('draft')}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FileText className="h-4 w-4" />
              <span>Save as Draft</span>
            </button>
            <button
              onClick={() => handleSave('submit')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Submit for Approval</span>
            </button>
            <button
              onClick={() => handleSave('activate')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              <span>Activate</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Please fix the following errors:</h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* BOM Details Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Package className="h-5 w-5 text-blue-600" />
          <span>BOM Header Information</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Product Selection */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Product <span className="text-red-500">*</span>
            </label>
            <select
              value={bom.productCode}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a product to create BOM --</option>
              {mockProducts.map((product) => (
                <option key={product.code} value={product.code}>
                  {product.code} - {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* BOM Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">BOM Type</label>
            <select
              value={bom.bomType}
              onChange={(e) => setBom({ ...bom, bomType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="manufacturing">Manufacturing BOM</option>
              <option value="engineering">Engineering BOM</option>
              <option value="planning">Planning BOM (MRP)</option>
              <option value="costing">Costing BOM</option>
            </select>
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input
              type="text"
              value={bom.version}
              onChange={(e) => setBom({ ...bom, version: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="V1.0, V1.1, etc."
            />
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
            <input
              type="date"
              value={bom.effectiveDate}
              onChange={(e) => setBom({ ...bom, effectiveDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Batch Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Size (Standard Lot)</label>
            <input
              type="number"
              value={bom.batchSize}
              onChange={(e) => setBom({ ...bom, batchSize: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
              min="1"
            />
          </div>

          {/* Lead Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Lead Time (days)</label>
            <input
              type="number"
              value={bom.leadTime}
              onChange={(e) => setBom({ ...bom, leadTime: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="7"
              min="0"
            />
          </div>

          {/* Scrap Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scrap Percentage (Expected Waste)</label>
            <input
              type="number"
              value={bom.scrapPercentage}
              onChange={(e) => setBom({ ...bom, scrapPercentage: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3.5"
              step="0.1"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Product Details (Auto-populated) */}
        {selectedProduct && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Product Details (Auto-populated)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-medium text-blue-700">Product Code:</span>{' '}
                <span className="text-blue-900 font-semibold">{selectedProduct.code}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Product Name:</span>{' '}
                <span className="text-blue-900 font-semibold">{selectedProduct.name}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Drawing No:</span>{' '}
                <span className="text-blue-900 font-semibold">{selectedProduct.drawingNumber}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Category:</span>{' '}
                <span className="text-blue-900 font-semibold">{selectedProduct.category}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">UOM:</span>{' '}
                <span className="text-blue-900 font-semibold">{selectedProduct.uom}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Description:</span>{' '}
                <span className="text-blue-900">{selectedProduct.description}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Component Entry Methods */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="h-5 w-5 text-purple-600" />
          <span>Component Entry Methods</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setEntryMethod('manual');
              addComponent(0);
            }}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              entryMethod === 'manual'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <Plus className="h-6 w-6 text-blue-600 mb-2" />
            <div className="font-semibold text-gray-900">Manual Entry</div>
            <div className="text-xs text-gray-600 mt-1">Add components one by one</div>
          </button>

          <button
            onClick={() => {
              setEntryMethod('copy');
              setShowCopyModal(true);
            }}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              entryMethod === 'copy'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
            }`}
          >
            <Copy className="h-6 w-6 text-green-600 mb-2" />
            <div className="font-semibold text-gray-900">Copy from Existing</div>
            <div className="text-xs text-gray-600 mt-1">Select product to copy from</div>
          </button>

          <button
            onClick={() => {
              setEntryMethod('import');
              handleImportFromExcel();
            }}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              entryMethod === 'import'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            <Upload className="h-6 w-6 text-purple-600 mb-2" />
            <div className="font-semibold text-gray-900">Import from Excel</div>
            <div className="text-xs text-gray-600 mt-1">Bulk upload BOM structure</div>
          </button>

          <button
            onClick={() => {
              setEntryMethod('template');
              alert('Template functionality: Select from common assembly templates');
            }}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              entryMethod === 'template'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-orange-300 hover:bg-gray-50'
            }`}
          >
            <BookTemplate className="h-6 w-6 text-orange-600 mb-2" />
            <div className="font-semibold text-gray-900">Use Template</div>
            <div className="text-xs text-gray-600 mt-1">Common assembly templates</div>
          </button>
        </div>
      </div>

      {/* Components Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <ListTree className="h-5 w-5 text-green-600" />
            <span>Multi-Level Component Table</span>
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              <span>{showPreview ? 'Hide' : 'Preview'} Tree</span>
            </button>
            <button
              onClick={() => addComponent(0)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Component</span>
            </button>
          </div>
        </div>

        {components.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No components added yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add Component" to start building your BOM</p>
            <button
              onClick={() => addComponent(0)}
              className="mt-4 flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Component</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase">Level</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase">Item Code & Details</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase">Qty/Unit</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase">UOM</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase">Scrap %</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase">Stock</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 uppercase">Cost/Unit</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 uppercase">Extended</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase">Make/Buy</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {components.map((component) => renderComponentRow(component))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cost Summary Section */}
      {components.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <IndianRupee className="h-5 w-5 text-green-600" />
            <span>Cost Summary & Pricing</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
              <h4 className="text-md font-bold text-gray-900 mb-4">Cost Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Material Cost:</span>
                  <div className="flex items-center text-lg font-bold text-gray-900">
                    <IndianRupee className="h-4 w-4" />
                    <span>{materialCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Labor Cost (Est.):</span>
                  <div className="flex items-center text-lg font-bold text-gray-900">
                    <IndianRupee className="h-4 w-4" />
                    <span>{laborCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Overhead (Est.):</span>
                  <div className="flex items-center text-lg font-bold text-gray-900">
                    <IndianRupee className="h-4 w-4" />
                    <span>{overheadCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Scrap Cost ({bom.scrapPercentage}%):</span>
                  <div className="flex items-center text-lg font-bold text-orange-700">
                    <IndianRupee className="h-4 w-4" />
                    <span>{scrapCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 rounded-lg border border-green-300">
                  <span className="text-md font-bold text-green-800">Total Product Cost:</span>
                  <div className="flex items-center text-2xl font-bold text-green-800">
                    <IndianRupee className="h-6 w-6" />
                    <span>{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Pricing */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
              <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Suggested Selling Price (with margin)</span>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-green-200">
                  <span className="text-sm font-medium text-gray-700">Total Cost:</span>
                  <div className="flex items-center text-lg font-bold text-gray-900">
                    <IndianRupee className="h-4 w-4" />
                    <span>{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-green-200">
                  <span className="text-sm font-medium text-gray-700">Price with 30% Margin:</span>
                  <div className="flex items-center text-lg font-bold text-blue-700">
                    <IndianRupee className="h-4 w-4" />
                    <span>{suggestedPrice30.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-green-200">
                  <span className="text-sm font-medium text-gray-700">Price with 40% Margin:</span>
                  <div className="flex items-center text-lg font-bold text-green-700">
                    <IndianRupee className="h-4 w-4" />
                    <span>{suggestedPrice40.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-xs text-green-800 bg-green-100 p-3 rounded mt-3 border border-green-300">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  Recommended selling price based on standard margin. Adjust based on market conditions.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy from Existing Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Copy from Existing BOM</h3>
              <p className="text-sm text-gray-600 mt-1">Select a product to copy BOM structure from</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {mockExistingBOMs.map((item) => (
                  <label
                    key={item.bomNumber}
                    className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="copyBOM"
                      value={item.bomNumber}
                      checked={selectedCopyBOM === item.bomNumber}
                      onChange={(e) => setSelectedCopyBOM(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.productName}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.productCode} • {item.bomNumber} • {item.version}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyFromExisting}
                disabled={!selectedCopyBOM}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Copy BOM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
