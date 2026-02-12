import { apiClient } from '../api/client';

// ==================== TypeScript Interfaces ====================

export type ProductStatus = 'active' | 'inactive' | 'discontinued';

export interface CPQProduct {
  id: string;
  companyId: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  basePrice: number;
  currency: string;
  status: ProductStatus;
  isConfigurable: boolean;
  hasOptions: boolean;
  minQuantity: number;
  maxQuantity?: number;
  leadTimeDays: number;
  imageUrl?: string;
  specifications?: Record<string, unknown>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductOption {
  id: string;
  companyId: string;
  productId: string;
  optionGroupName: string;
  optionName: string;
  optionType: 'single_select' | 'multi_select' | 'text' | 'number' | 'boolean';
  isRequired: boolean;
  priceImpact: number;
  priceImpactType: 'fixed' | 'percentage';
  displayOrder: number;
  values?: { value: string; label: string; priceAdjustment?: number }[];
  isActive: boolean;
}

export interface ProductBundle {
  id: string;
  companyId: string;
  bundleSku: string;
  bundleName: string;
  description?: string;
  bundleType: 'fixed' | 'configurable';
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  items: BundleItem[];
}

export interface BundleItem {
  id: string;
  bundleId: string;
  productId: string;
  productName?: string;
  quantity: number;
  isOptional: boolean;
  priceOverride?: number;
  displayOrder: number;
}

export interface ConfigurationRule {
  id: string;
  companyId: string;
  ruleName: string;
  ruleType: 'requires' | 'excludes' | 'recommends' | 'price_adjustment';
  priority: number;
  conditions: Record<string, unknown>;
  actions: Record<string, unknown>;
  isActive: boolean;
}

export interface ProductConfiguration {
  id: string;
  companyId: string;
  productId: string;
  configurationName: string;
  selectedOptions: Record<string, unknown>;
  calculatedPrice: number;
  isValid: boolean;
  validationErrors?: string[];
  createdBy: string;
  createdAt: string;
}

// ==================== Mock Data ====================

const MOCK_PRODUCTS: CPQProduct[] = [
  {
    id: 'prod-001',
    companyId: 'company-001',
    sku: 'CNC-MILL-5X',
    name: '5-Axis CNC Milling Machine',
    description: 'High-precision 5-axis CNC milling machine for complex geometries',
    category: 'CNC Machines',
    subcategory: 'Milling',
    basePrice: 250000,
    currency: 'USD',
    status: 'active',
    isConfigurable: true,
    hasOptions: true,
    minQuantity: 1,
    maxQuantity: 10,
    leadTimeDays: 90,
    specifications: { spindleSpeed: '15000 RPM', travelX: '800mm', travelY: '600mm' },
    tags: ['CNC', 'Milling', 'Precision'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'prod-002',
    companyId: 'company-001',
    sku: 'LATHE-CNC-PRO',
    name: 'CNC Lathe Professional',
    description: 'Professional grade CNC lathe for precision turning',
    category: 'CNC Machines',
    subcategory: 'Lathe',
    basePrice: 85000,
    currency: 'USD',
    status: 'active',
    isConfigurable: true,
    hasOptions: true,
    minQuantity: 1,
    leadTimeDays: 45,
    specifications: { swingOver: '400mm', spindleBore: '65mm' },
    tags: ['CNC', 'Lathe', 'Turning'],
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'prod-003',
    companyId: 'company-001',
    sku: 'ROBOT-WELD-6DOF',
    name: '6-DOF Industrial Welding Robot',
    description: 'Six degree of freedom robotic welding system',
    category: 'Robotics',
    subcategory: 'Welding',
    basePrice: 175000,
    currency: 'USD',
    status: 'active',
    isConfigurable: true,
    hasOptions: true,
    minQuantity: 1,
    leadTimeDays: 60,
    specifications: { reach: '2000mm', payload: '25kg', repeatability: '0.05mm' },
    tags: ['Robot', 'Welding', 'Automation'],
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z',
  },
];

const MOCK_OPTIONS: ProductOption[] = [
  {
    id: 'opt-001',
    companyId: 'company-001',
    productId: 'prod-001',
    optionGroupName: 'Spindle Configuration',
    optionName: 'Spindle Speed',
    optionType: 'single_select',
    isRequired: true,
    priceImpact: 0,
    priceImpactType: 'fixed',
    displayOrder: 1,
    values: [
      { value: '15000', label: '15,000 RPM (Standard)', priceAdjustment: 0 },
      { value: '20000', label: '20,000 RPM (High Speed)', priceAdjustment: 15000 },
      { value: '24000', label: '24,000 RPM (Ultra High Speed)', priceAdjustment: 35000 },
    ],
    isActive: true,
  },
  {
    id: 'opt-002',
    companyId: 'company-001',
    productId: 'prod-001',
    optionGroupName: 'Control System',
    optionName: 'CNC Controller',
    optionType: 'single_select',
    isRequired: true,
    priceImpact: 0,
    priceImpactType: 'fixed',
    displayOrder: 2,
    values: [
      { value: 'fanuc', label: 'FANUC 31i-B5', priceAdjustment: 0 },
      { value: 'siemens', label: 'Siemens 840D sl', priceAdjustment: 8000 },
      { value: 'heidenhain', label: 'Heidenhain TNC 640', priceAdjustment: 12000 },
    ],
    isActive: true,
  },
  {
    id: 'opt-003',
    companyId: 'company-001',
    productId: 'prod-001',
    optionGroupName: 'Accessories',
    optionName: 'Tool Changer',
    optionType: 'single_select',
    isRequired: false,
    priceImpact: 0,
    priceImpactType: 'fixed',
    displayOrder: 3,
    values: [
      { value: '24', label: '24-Tool Carousel', priceAdjustment: 0 },
      { value: '40', label: '40-Tool Magazine', priceAdjustment: 12000 },
      { value: '60', label: '60-Tool Magazine', priceAdjustment: 22000 },
    ],
    isActive: true,
  },
];

const MOCK_BUNDLES: ProductBundle[] = [
  {
    id: 'bundle-001',
    companyId: 'company-001',
    bundleSku: 'MACHINING-CENTER-COMPLETE',
    bundleName: 'Complete Machining Center Package',
    description: 'Full machining center with CNC mill, tooling, and training',
    bundleType: 'fixed',
    basePrice: 295000,
    discountPercentage: 8,
    finalPrice: 271400,
    isActive: true,
    validFrom: '2025-01-01',
    items: [
      { id: 'bi-001', bundleId: 'bundle-001', productId: 'prod-001', quantity: 1, isOptional: false, displayOrder: 1 },
    ],
  },
];

// ==================== Service Class ====================

class CPQProductService {
  private baseUrl = '/cpq/products';

  // Products
  async createProduct(data: Partial<CPQProduct>): Promise<CPQProduct> {
    try {
      const response = await apiClient.post<CPQProduct>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('API Error creating product, using mock data:', error);
      const newProduct: CPQProduct = {
        id: `prod-${Date.now()}`,
        companyId: 'company-001',
        sku: data.sku || `SKU-${Date.now()}`,
        name: data.name || 'New Product',
        category: data.category || 'General',
        basePrice: data.basePrice || 0,
        currency: data.currency || 'USD',
        status: 'active',
        isConfigurable: data.isConfigurable || false,
        hasOptions: data.hasOptions || false,
        minQuantity: data.minQuantity || 1,
        leadTimeDays: data.leadTimeDays || 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as CPQProduct;
      MOCK_PRODUCTS.push(newProduct);
      return newProduct;
    }
  }

  async findAllProducts(filters?: {
    category?: string;
    status?: ProductStatus;
    isConfigurable?: boolean;
  }): Promise<CPQProduct[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.isConfigurable !== undefined) params.append('isConfigurable', String(filters.isConfigurable));
      const response = await apiClient.get<CPQProduct[]>(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching products, using mock data:', error);
      let result = [...MOCK_PRODUCTS];
      if (filters?.category) result = result.filter((p) => p.category === filters.category);
      if (filters?.status) result = result.filter((p) => p.status === filters.status);
      if (filters?.isConfigurable !== undefined) result = result.filter((p) => p.isConfigurable === filters.isConfigurable);
      return result;
    }
  }

  async findProductById(id: string): Promise<CPQProduct> {
    try {
      const response = await apiClient.get<CPQProduct>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching product, using mock data:', error);
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      if (!product) throw new Error(`Product with ID ${id} not found`);
      return product;
    }
  }

  async updateProduct(id: string, data: Partial<CPQProduct>): Promise<CPQProduct> {
    try {
      const response = await apiClient.patch<CPQProduct>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error updating product, using mock data:', error);
      const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (index === -1) throw new Error(`Product with ID ${id} not found`);
      MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...data, updatedAt: new Date().toISOString() };
      return MOCK_PRODUCTS[index];
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('API Error deleting product, using mock data:', error);
      const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (index !== -1) MOCK_PRODUCTS.splice(index, 1);
    }
  }

  // Options
  async findProductOptions(productId: string): Promise<ProductOption[]> {
    try {
      const response = await apiClient.get<ProductOption[]>(`${this.baseUrl}/${productId}/options`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching options, using mock data:', error);
      return MOCK_OPTIONS.filter((o) => o.productId === productId);
    }
  }

  async createOption(productId: string, data: Partial<ProductOption>): Promise<ProductOption> {
    try {
      const response = await apiClient.post<ProductOption>(`${this.baseUrl}/${productId}/options`, data);
      return response.data;
    } catch (error) {
      console.error('API Error creating option, using mock data:', error);
      const newOption: ProductOption = {
        id: `opt-${Date.now()}`,
        companyId: 'company-001',
        productId,
        optionGroupName: data.optionGroupName || 'New Group',
        optionName: data.optionName || 'New Option',
        optionType: data.optionType || 'single_select',
        isRequired: data.isRequired || false,
        priceImpact: data.priceImpact || 0,
        priceImpactType: data.priceImpactType || 'fixed',
        displayOrder: data.displayOrder || MOCK_OPTIONS.length + 1,
        isActive: true,
        ...data,
      } as ProductOption;
      MOCK_OPTIONS.push(newOption);
      return newOption;
    }
  }

  // Bundles
  async findAllBundles(filters?: { isActive?: boolean }): Promise<ProductBundle[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      const response = await apiClient.get<ProductBundle[]>(`/cpq/bundles?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching bundles, using mock data:', error);
      let result = [...MOCK_BUNDLES];
      if (filters?.isActive !== undefined) result = result.filter((b) => b.isActive === filters.isActive);
      return result;
    }
  }

  async findBundleById(id: string): Promise<ProductBundle> {
    try {
      const response = await apiClient.get<ProductBundle>(`/cpq/bundles/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching bundle, using mock data:', error);
      const bundle = MOCK_BUNDLES.find((b) => b.id === id);
      if (!bundle) throw new Error(`Bundle with ID ${id} not found`);
      return bundle;
    }
  }

  async calculateBundlePrice(bundleId: string): Promise<{ basePrice: number; discount: number; finalPrice: number }> {
    try {
      const response = await apiClient.get<{ basePrice: number; discount: number; finalPrice: number }>(
        `/cpq/bundles/${bundleId}/calculate-price`
      );
      return response.data;
    } catch (error) {
      console.error('API Error calculating bundle price, using mock data:', error);
      const bundle = MOCK_BUNDLES.find((b) => b.id === bundleId);
      if (!bundle) throw new Error(`Bundle with ID ${bundleId} not found`);
      return {
        basePrice: bundle.basePrice,
        discount: bundle.basePrice * (bundle.discountPercentage / 100),
        finalPrice: bundle.finalPrice,
      };
    }
  }

  // Configurations
  async validateConfiguration(
    productId: string,
    selectedOptions: Record<string, unknown>
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    try {
      const response = await apiClient.post<{ isValid: boolean; errors: string[]; warnings: string[] }>(
        `${this.baseUrl}/${productId}/validate-configuration`,
        { selectedOptions }
      );
      return response.data;
    } catch (error) {
      console.error('API Error validating configuration, using mock data:', error);
      return { isValid: true, errors: [], warnings: [] };
    }
  }

  async calculateConfigurationPrice(
    productId: string,
    selectedOptions: Record<string, unknown>
  ): Promise<{ basePrice: number; optionsPrice: number; totalPrice: number }> {
    try {
      const response = await apiClient.post<{ basePrice: number; optionsPrice: number; totalPrice: number }>(
        `${this.baseUrl}/${productId}/calculate-price`,
        { selectedOptions }
      );
      return response.data;
    } catch (error) {
      console.error('API Error calculating price, using mock data:', error);
      const product = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (!product) throw new Error(`Product with ID ${productId} not found`);
      return { basePrice: product.basePrice, optionsPrice: 0, totalPrice: product.basePrice };
    }
  }
}

export const cpqProductService = new CPQProductService();
