import { apiClient } from './api/client';

export interface CostCenter {
    id: string;
    code: string;
    name: string;
    companyId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Plant {
    id: string;
    code: string;
    name: string;
    companyId: string;
    branchId?: string;
    branch?: {
        id: string;
        name: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ExchangeRate {
    id: string;
    fromCurrencyId: string;
    fromCurrency: {
        id: string;
        code: string;
        name: string;
    };
    toCurrencyId: string;
    toCurrency: {
        id: string;
        code: string;
        name: string;
    };
    rate: number;
    effectiveDate: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ItemCategory {
    id: string;
    name: string;
    companyId: string;
    isActive: boolean;
}

export interface ItemGroup {
    id: string;
    name: string;
    categoryId: string;
    category?: ItemCategory;
    companyId: string;
    isActive: boolean;
}

export interface Brand {
    id: string;
    name: string;
    companyId: string;
    isActive: boolean;
}

export interface HsnSac {
    id: string;
    code: string;
    description?: string;
    gstPercentage: number;
    companyId: string;
    isActive: boolean;
}

export interface CustomerCategory {
    id: string;
    code: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    level?: string;
    classification?: string;
    status: string;
    criteria?: any;
    benefits?: any;
    terms?: any;
    targets?: any;
    metrics?: any;
}

export interface Customer {
    id: string;
    customerCode: string;
    customerName: string;
    customerType: string;
    status: string;
    categoryId?: string;
    category?: CustomerCategory;
    contactPerson?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    address?: any;
    billingAddress?: any;
    taxInfo?: any;
    creditInfo?: any;
    pricing?: any;
    salesInfo?: any;
}

export interface VendorCategory {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
}

export interface Vendor {
    id: string;
    vendorCode: string;
    vendorName: string;
    vendorType: string;
    status: string;
    categoryId?: string;
    category?: VendorCategory;
    contactPerson?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    address?: any;
    taxInfo?: any;
    paymentInfo?: any;
    qualifications?: any;
    supplierInfo?: any;
    performance?: any;
}

export interface Account {
    id: string;
    accountCode: string;
    accountName: string;
    parentId?: string;
    level: number;
    accountType: string;
    accountSubType?: string;
    status: string;
    description?: string;
    isControlAccount: boolean;
    allowPosting: boolean;
    currency: string;
    taxConfiguration?: any;
    reportingSettings?: any;
    balanceInfo?: any;
    restrictions?: any;
    integration?: any;
}

export interface BankAccount {
    id: string;
    bankName: string;
    branchName?: string;
    accountNumber: string;
    accountType: string;
    ifscCode: string;
    swiftCode?: string;
    micrCode?: string;
    accountHolderName: string;
    currency: string;
    status: string;
    isPrimary: boolean;
    contactDetails?: any;
    bankingDetails?: any;
    onlineAccess?: any;
}

export interface Tax {
    id: string;
    taxCode: string;
    taxName: string;
    taxType: string;
    status: string;
    description?: string;
    rate: number;
    rateType: string;
    taxComponents?: any;
    applicability?: any;
    calculation?: any;
    compliance?: any;
    validity?: any;
    accounting?: any;
}

export interface PaymentTerm {
    id: string;
    termCode: string;
    termName: string;
    description?: string;
    paymentType: string;
    dueDays?: number;
    dueDate?: number;
    installments?: any;
    discountTerms?: any;
    penaltyTerms?: any;
    applicableTo: string;
    isDefault: boolean;
    status: string;
}

export interface PriceListItem {
    id: string;
    itemCode: string;
    itemName: string;
    price: number;
    minQty?: number;
    maxQty?: number;
}

export interface PriceList {
    id: string;
    priceListCode: string;
    priceListName: string;
    description?: string;
    effectiveFrom: string;
    effectiveTo?: string;
    customerCategory: string;
    applicableFor: string;
    pricingMethod: string;
    markupPercentage?: number;
    currency: string;
    includeTax: boolean;
    isDefault: boolean;
    status: string;
    items?: PriceListItem[];
}

export interface Country {
    id: string;
    code: string;
    name: string;
    phoneCode?: string;
    isActive: boolean;
}

export interface State {
    id: string;
    name: string;
    countryId: string;
    isActive: boolean;
}

export interface City {
    id: string;
    name: string;
    stateId: string;
    isActive: boolean;
}

export interface Territory {
    id: string;
    code: string;
    name: string;
    companyId: string;
    isActive: boolean;
}


class CommonMastersService {
    /**
     * Get all cost centers
     */
    async getAllCostCenters(companyId?: string): Promise<CostCenter[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<CostCenter[]>(`/api/v1/common-masters/cost-centers?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all plants
     */
    async getAllPlants(companyId?: string): Promise<Plant[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<Plant[]>(`/api/v1/common-masters/plants?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all exchange rates
     */
    async getAllExchangeRates(companyId?: string): Promise<ExchangeRate[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<ExchangeRate[]>(`/api/v1/common-masters/exchange-rates?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all Item Categories
     */
    async getAllItemCategories(companyId?: string): Promise<ItemCategory[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<ItemCategory[]>(`/api/v1/common-masters/item-categories?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all Item Groups
     */
    async getAllItemGroups(companyId?: string): Promise<ItemGroup[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<ItemGroup[]>(`/api/v1/common-masters/item-groups?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all Brands
     */
    async getAllBrands(companyId?: string): Promise<Brand[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<Brand[]>(`/api/v1/common-masters/brands?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all HSN/SAC Codes
     */
    async getAllHsnSacs(companyId?: string): Promise<HsnSac[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<HsnSac[]>(`/api/v1/common-masters/hsn-sacs?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all customer categories
     */
    async getAllCustomerCategories(companyId?: string): Promise<CustomerCategory[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<CustomerCategory[]>(`/api/v1/common-masters/customer-categories?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all customers
     */
    async getAllCustomers(companyId?: string): Promise<Customer[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<Customer[]>(`/api/v1/common-masters/customers?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all vendor categories
     */
    async getAllVendorCategories(companyId?: string): Promise<VendorCategory[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<VendorCategory[]>(`/api/v1/common-masters/vendor-categories?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all vendors
     */
    async getAllVendors(companyId?: string): Promise<Vendor[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<Vendor[]>(`/api/v1/common-masters/vendors?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all financial accounts
     */
    async getAllAccounts(companyId?: string): Promise<Account[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<Account[]>(`/api/v1/common-masters/accounts?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all bank accounts
     */
    async getAllBankAccounts(companyId?: string): Promise<BankAccount[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<BankAccount[]>(`/api/v1/common-masters/bank-accounts?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all taxes
     */
    async getAllTaxes(companyId?: string): Promise<Tax[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<Tax[]>(`/api/v1/common-masters/taxes?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all payment terms
     */
    async getAllPaymentTerms(companyId?: string): Promise<PaymentTerm[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<PaymentTerm[]>(`/api/v1/common-masters/payment-terms?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all price lists
     */
    async getAllPriceLists(companyId?: string): Promise<PriceList[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<PriceList[]>(`/api/v1/common-masters/price-lists?${params.toString()}`);
        return response.data || [];
    }

    /**
     * Get all countries
     */
    async getAllCountries(): Promise<Country[]> {
        const response = await apiClient.get<Country[]>('/api/v1/common-masters/countries');
        return response.data || [];
    }

    /**
     * Get all states by country
     */
    async getStatesByCountry(countryId: string): Promise<State[]> {
        const response = await apiClient.get<State[]>(`/api/v1/common-masters/states/${countryId}`);
        return response.data || [];
    }

    /**
     * Get all cities by state
     */
    async getCitiesByState(stateId: string): Promise<City[]> {
        const response = await apiClient.get<City[]>(`/api/v1/common-masters/cities/${stateId}`);
        return response.data || [];
    }

    /**
     * Get all territories
     */
    async getAllTerritories(companyId?: string): Promise<Territory[]> {
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        const response = await apiClient.get<Territory[]>(`/api/v1/common-masters/territories?${params.toString()}`);
        return response.data || [];
    }
}


export const commonMastersService = new CommonMastersService();
