'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
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
  ChevronUp,
  Link2,
  Copy,
  Eye,
  EyeOff,
  Grid,
  List,
  ArrowUp,
  ArrowDown,
  Indent,
  Outdent,
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
  id: string;
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
];

const mockItems = [
  { code: 'RM-WOOD-PLY-18', name: 'BWP Plywood 18mm', description: 'Boiling Water Proof Plywood', type: 'raw_material', uom: 'Sheets', stock: 120, cost: 1800.00 },
  { code: 'RM-WOOD-PLY-12', name: 'BWP Plywood 12mm', description: 'Thinner plywood', type: 'raw_material', uom: 'Sheets', stock: 80, cost: 1100.00 },
  { code: 'RM-LAMINATE-001', name: 'Decorative Laminate', description: 'High-pressure laminate', type: 'raw_material', uom: 'Sheets', stock: 45, cost: 150.00 },
  { code: 'RM-LAMINATE-002', name: 'Premium Laminate', description: 'High-gloss laminate', type: 'raw_material', uom: 'Sheets', stock: 25, cost: 200.00 },
  { code: 'RM-ADHESIVE-WD', name: 'Wood Adhesive', description: 'Industrial grade wood glue', type: 'raw_material', uom: 'Kg', stock: 25, cost: 250.00 },
  { code: 'RM-EDGEBAND-001', name: 'Edge Banding Tape', description: 'PVC edge banding', type: 'raw_material', uom: 'Meters', stock: 500, cost: 5.00 },
  { code: 'COMP-HINGE-SC', name: 'Soft-Close Hinge', description: 'Hydraulic soft-close hinge', type: 'purchased_part', uom: 'Pieces', stock: 200, cost: 85.00 },
  { code: 'COMP-HANDLE-001', name: 'Cabinet Handle', description: 'Stainless steel C-handle', type: 'purchased_part', uom: 'Piece', stock: 150, cost: 75.00 },
  { code: 'COMP-SCREW-001', name: 'Mounting Screws', description: 'Self-tapping screws', type: 'purchased_part', uom: 'Pieces', stock: 5000, cost: 0.50 },
  { code: 'COMP-LEG-ADJ', name: 'Adjustable Leg', description: 'Height adjustable leg', type: 'purchased_part', uom: 'Pieces', stock: 120, cost: 45.00 },
  { code: 'SFG-DOOR-PANEL', name: 'Door Panel - Laminated', description: 'Pre-laminated door panel', type: 'semi_finished', uom: 'Unit', stock: 30, cost: 950.00 },
  { code: 'ASSY-FRAME-001', name: 'Cabinet Frame Assembly', description: 'Main frame structure', type: 'assembly', uom: 'Unit', stock: 15, cost: 5200.00 },
  { code: 'ASSY-DOOR-001', name: 'Cabinet Door Assembly', description: 'Soft-close door with handle', type: 'assembly', uom: 'Units', stock: 8, cost: 1250.00 },
];

const mockBOM: BOM = {
  id: 'BOM-001',
  bomNumber: 'BOM-2025-001',
  productCode: 'PROD-CAB-001',
  productName: 'Premium Kitchen Cabinet - Modular',
  productDescription: 'High-quality modular kitchen cabinet with soft-close mechanism',
  drawingNumber: 'DWG-CAB-001-R2',
  version: 'V2.1',
  revision: 'R3',
  bomType: 'manufacturing',
  effectiveDate: '2025-01-15',
  expiryDate: '',
  batchSize: 10,
  leadTime: 7,
  scrapPercentage: 3.5,
  uom: 'Units',
  components: [
    {
      id: '1',
      level: 0,
      itemCode: 'ASSY-FRAME-001',
      itemName: 'Cabinet Frame Assembly',
      description: 'Main frame structure with side panels',
      quantity: 1,
      uom: 'Unit',
      itemType: 'assembly',
      stockAvailable: 15,
      costPerUnit: 5200.00,
      extendedCost: 5200.00,
      makeOrBuy: 'make',
      scrapPercent: 2.0,
      isRequired: true,
      isPhantom: true,
      children: [
        {
          id: '1-1',
          level: 1,
          itemCode: 'RM-WOOD-PLY-18',
          itemName: 'BWP Plywood 18mm',
          description: 'Boiling Water Proof Plywood - Premium Grade',
          quantity: 2.5,
          uom: 'Sheets',
          itemType: 'raw_material',
          stockAvailable: 120,
          costPerUnit: 1800.00,
          extendedCost: 4500.00,
          makeOrBuy: 'buy',
          scrapPercent: 5.0,
          isRequired: true,
          isPhantom: false,
          alternatives: 'RM-WOOD-PLY-19, RM-WOOD-MDF-18',
        },
        {
          id: '1-2',
          level: 1,
          itemCode: 'RM-LAMINATE-001',
          itemName: 'Decorative Laminate',
          description: 'High-pressure laminate - Matte finish',
          quantity: 3,
          uom: 'Sheets',
          itemType: 'raw_material',
          stockAvailable: 45,
          costPerUnit: 150.00,
          extendedCost: 450.00,
          makeOrBuy: 'buy',
          scrapPercent: 8.0,
          isRequired: true,
          isPhantom: false,
        },
      ],
    },
    {
      id: '2',
      level: 0,
      itemCode: 'ASSY-DOOR-001',
      itemName: 'Cabinet Door Assembly',
      description: 'Soft-close door with handle',
      quantity: 2,
      uom: 'Units',
      itemType: 'assembly',
      stockAvailable: 8,
      costPerUnit: 1250.00,
      extendedCost: 2500.00,
      makeOrBuy: 'make',
      scrapPercent: 1.5,
      isRequired: true,
      isPhantom: false,
      children: [
        {
          id: '2-1',
          level: 1,
          itemCode: 'SFG-DOOR-PANEL',
          itemName: 'Door Panel - Laminated',
          description: 'Pre-laminated door panel',
          quantity: 1,
          uom: 'Unit',
          itemType: 'semi_finished',
          stockAvailable: 30,
          costPerUnit: 950.00,
          extendedCost: 950.00,
          makeOrBuy: 'make',
          scrapPercent: 2.0,
          isRequired: true,
          isPhantom: false,
        },
        {
          id: '2-2',
          level: 1,
          itemCode: 'COMP-HINGE-SC',
          itemName: 'Soft-Close Hinge',
          description: 'Hydraulic soft-close hinge',
          quantity: 2,
          uom: 'Pieces',
          itemType: 'purchased_part',
          stockAvailable: 200,
          costPerUnit: 85.00,
          extendedCost: 170.00,
          makeOrBuy: 'buy',
          scrapPercent: 0.5,
          isRequired: true,
          isPhantom: false,
          supplierPreference: 'Hettich India',
        },
      ],
    },
  ],
};

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

export default function BOMEditPage() {
  const router = useRouter();
  const params = useParams();
  const [bom, setBom] = useState<BOM>(mockBOM);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(mockProducts[0]);
  const [components, setComponents] = useState<BOMComponent[]>(mockBOM.components);
  const [showItemSearch, setShowItemSearch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set(['1', '2']));
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

  const handleItemSelect = (componentId: string, item: any, parentComponent?: BOMComponent) => {
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
      id: `new-${Date.now()}`,
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

  const indentComponent = (componentId: string) => {
    // Move component one level deeper (increase indent)
    // Find previous sibling and make this a child of it
    // This is a simplified version - full implementation would need more logic
    console.log('Indent component:', componentId);
  };

  const outdentComponent = (componentId: string) => {
    // Move component one level up (decrease indent)
    // Make this a sibling of its current parent
    console.log('Outdent component:', componentId);
  };

  const moveComponentUp = (componentId: string) => {
    // Move component up in the list
    console.log('Move up:', componentId);
  };

  const moveComponentDown = (componentId: string) => {
    // Move component down in the list
    console.log('Move down:', componentId);
  };

  const validateBOM = (): boolean => {
    const errors: string[] = [];

    if (!bom.productCode) {
      errors.push('Please select a product');
    }

    if (components.length === 0) {
      errors.push('BOM must have at least one component');
    }

    const validateComponents = (comps: BOMComponent[]) => {
      comps.forEach((comp) => {
        if (!comp.itemCode) {
          errors.push(`Component at level ${comp.level} is missing item code`);
        }
        if (comp.quantity <= 0) {
          errors.push(`${comp.itemCode}: Quantity must be greater than 0`);
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

  const handleSave = () => {
    if (validateBOM()) {
      // Save BOM logic here
      console.log('Saving BOM:', { ...bom, components });
      router.push('/production/bom');
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push('/production/bom');
    }
  };

  const renderComponentRow = (component: BOMComponent, parentId?: string): JSX.Element[] => {
    const isExpanded = expandedComponents.has(component.id);
    const hasChildren = component.children && component.children.length > 0;
    const isSearching = showItemSearch === component.id;

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-sm text-gray-500 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>Select item...</span>
                <Search className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="font-mono text-sm font-semibold text-gray-900">{component.itemCode}</div>
                  <div className="text-xs text-gray-600">{component.itemName}</div>
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
              <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {mockItems
                    .filter(
                      (item) =>
                        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <button
                        key={item.code}
                        onClick={() => handleItemSelect(component.id, item)}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0"
                      >
                        <div className="font-mono text-sm font-semibold text-gray-900">{item.code}</div>
                        <div className="text-xs text-gray-600">{item.name}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${itemTypeColors[item.type as keyof typeof itemTypeColors]}`}>
                            {itemTypeLabels[item.type as keyof typeof itemTypeLabels]}
                          </span>
                          <span className="text-xs text-gray-500">Stock: {item.stock}</span>
                        </div>
                      </button>
                    ))}
                </div>
                <div className="p-2 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowItemSearch(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Close
                  </button>
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
        <td className="px-3 py-2">
          <span className="text-sm text-gray-700">{component.uom}</span>
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
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.isRequired}
                onChange={(e) => {
                  const updateRequired = (comps: BOMComponent[]): BOMComponent[] => {
                    return comps.map((comp) => {
                      if (comp.id === component.id) {
                        return { ...comp, isRequired: e.target.checked };
                      }
                      if (comp.children) {
                        return { ...comp, children: updateRequired(comp.children) };
                      }
                      return comp;
                    });
                  };
                  setComponents(updateRequired(components));
                }}
                className="mr-1"
              />
              <span className="text-xs text-gray-600">Req</span>
            </label>
            <label className="flex items-center ml-2">
              <input
                type="checkbox"
                checked={component.isPhantom}
                onChange={(e) => {
                  const updatePhantom = (comps: BOMComponent[]): BOMComponent[] => {
                    return comps.map((comp) => {
                      if (comp.id === component.id) {
                        return { ...comp, isPhantom: e.target.checked };
                      }
                      if (comp.children) {
                        return { ...comp, children: updatePhantom(comp.children) };
                      }
                      return comp;
                    });
                  };
                  setComponents(updatePhantom(components));
                }}
                className="mr-1"
              />
              <span className="text-xs text-gray-600">Phantom</span>
            </label>
          </div>
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
              onClick={() => moveComponentUp(component.id)}
              className="p-1 hover:bg-gray-200 rounded text-gray-600"
             
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => moveComponentDown(component.id)}
              className="p-1 hover:bg-gray-200 rounded text-gray-600"
             
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
            {component.level > 0 && (
              <button
                onClick={() => outdentComponent(component.id)}
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
               
              >
                <Outdent className="h-3.5 w-3.5" />
              </button>
            )}
            {component.level < 3 && (
              <button
                onClick={() => indentComponent(component.id)}
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
               
              >
                <Indent className="h-3.5 w-3.5" />
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
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <ListTree className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Bill of Materials</h1>
              <p className="text-sm text-gray-500 mt-1">{bom.bomNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product <span className="text-red-500">*</span>
            </label>
            <select
              value={bom.productCode}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Product</option>
              {mockProducts.map((product) => (
                <option key={product.code} value={product.code}>
                  {product.code} - {product.name}
                </option>
              ))}
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
              placeholder="V1.0"
            />
          </div>

          {/* Revision */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Revision</label>
            <input
              type="text"
              value={bom.revision}
              onChange={(e) => setBom({ ...bom, revision: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="R1"
            />
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
              <option value="planning">Planning BOM</option>
              <option value="costing">Costing BOM</option>
            </select>
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

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={bom.expiryDate}
              onChange={(e) => setBom({ ...bom, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Batch Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Size</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (days)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Scrap Percentage (%)</label>
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
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Product Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-blue-700">Name:</span>{' '}
                <span className="text-blue-900">{selectedProduct.name}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Drawing No:</span>{' '}
                <span className="text-blue-900">{selectedProduct.drawingNumber}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Category:</span>{' '}
                <span className="text-blue-900">{selectedProduct.category}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">UOM:</span>{' '}
                <span className="text-blue-900">{selectedProduct.uom}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Components Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <ListTree className="h-5 w-5 text-green-600" />
            <span>Multi-Level Component Tree</span>
          </h3>
          <button
            onClick={() => addComponent(0)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Component</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Level</th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Item Code</th>
                <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">Quantity</th>
                <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">UOM</th>
                <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">Scrap %</th>
                <th className="px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Cost/Unit</th>
                <th className="px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Extended</th>
                <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">Make/Buy</th>
                <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">Properties</th>
                <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component) => renderComponentRow(component))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan={6} className="px-3 py-3 text-right">
                  <span className="text-lg font-bold text-gray-900">Total Cost:</span>
                </td>
                <td colSpan={4} className="px-3 py-3">
                  <div className="flex items-center text-xl font-bold text-green-700">
                    <IndianRupee className="h-5 w-5" />
                    <span>{calculateTotalCost(components).toFixed(2)}</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Helper Text */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-semibold text-gray-900 mb-1">Tips:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Use the + button next to a component to add child components (sub-assemblies)</li>
                <li>Use arrow buttons to reorder components</li>
                <li>Use indent/outdent buttons to change component levels</li>
                <li>Check "Phantom" for intermediate assemblies that don't go to stock</li>
                <li>Uncheck "Required" for optional components</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
