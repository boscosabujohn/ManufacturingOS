-- CreateTable
CREATE TABLE "core_countries" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_states" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "baseCurrencyId" TEXT,
    "logoUrl" TEXT,
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEliminationEntity" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "cityId" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "branchId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_designations" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER,
    "grade" TEXT,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_cost_centers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_cost_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_plants" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "branchId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_plants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_warehouses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "branchId" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_exchange_rates" (
    "id" TEXT NOT NULL,
    "fromCurrencyId" TEXT NOT NULL,
    "toCurrencyId" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "symbolNative" TEXT,
    "decimalDigits" INTEGER NOT NULL DEFAULT 2,
    "rounding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_uoms" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_uoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_uom_conversions" (
    "id" TEXT NOT NULL,
    "fromUomId" TEXT NOT NULL,
    "toUomId" TEXT NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_uom_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_item_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_item_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_item_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_item_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_hsn_sac" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "gstPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_hsn_sac_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_items" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "itemType" TEXT NOT NULL,
    "categoryId" TEXT,
    "groupId" TEXT,
    "uomId" TEXT NOT NULL,
    "brandId" TEXT,
    "hsnSacId" TEXT,
    "sku" TEXT,
    "purchasePrice" DOUBLE PRECISION DEFAULT 0,
    "sellingPrice" DOUBLE PRECISION DEFAULT 0,
    "costPrice" DOUBLE PRECISION DEFAULT 0,
    "minStockLevel" DOUBLE PRECISION DEFAULT 0,
    "maxStockLevel" DOUBLE PRECISION DEFAULT 0,
    "reorderLevel" DOUBLE PRECISION DEFAULT 0,
    "reorderQuantity" DOUBLE PRECISION DEFAULT 0,
    "isStockable" BOOLEAN NOT NULL DEFAULT true,
    "isSellable" BOOLEAN NOT NULL DEFAULT true,
    "isPurchasable" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_barcodes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_barcodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_customer_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#3B82F6',
    "icon" TEXT,
    "level" TEXT DEFAULT 'Primary',
    "classification" TEXT DEFAULT 'Standard',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "criteria" JSONB,
    "benefits" JSONB,
    "terms" JSONB,
    "targets" JSONB,
    "metrics" JSONB,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_customer_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_customers" (
    "id" TEXT NOT NULL,
    "customerCode" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerType" TEXT NOT NULL DEFAULT 'business',
    "status" TEXT NOT NULL DEFAULT 'active',
    "categoryId" TEXT,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "website" TEXT,
    "address" JSONB,
    "billingAddress" JSONB,
    "taxInfo" JSONB,
    "creditInfo" JSONB,
    "pricing" JSONB,
    "salesInfo" JSONB,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proc_vendor_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proc_vendor_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proc_vendors" (
    "id" TEXT NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "vendorName" TEXT NOT NULL,
    "vendorType" TEXT NOT NULL DEFAULT 'supplier',
    "status" TEXT NOT NULL DEFAULT 'active',
    "categoryId" TEXT,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "website" TEXT,
    "address" JSONB,
    "taxInfo" JSONB,
    "paymentInfo" JSONB,
    "qualifications" JSONB,
    "supplierInfo" JSONB,
    "performance" JSONB,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proc_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_accounts" (
    "id" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "accountType" TEXT NOT NULL,
    "accountSubType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "description" TEXT,
    "isControlAccount" BOOLEAN NOT NULL DEFAULT false,
    "allowPosting" BOOLEAN NOT NULL DEFAULT true,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "taxConfiguration" JSONB,
    "reportingSettings" JSONB,
    "balanceInfo" JSONB,
    "restrictions" JSONB,
    "integration" JSONB,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fin_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_bank_accounts" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "branchName" TEXT,
    "accountNumber" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "swiftCode" TEXT,
    "micrCode" TEXT,
    "accountHolderName" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'active',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "contactDetails" JSONB,
    "bankingDetails" JSONB,
    "onlineAccess" JSONB,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fin_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_taxes" (
    "id" TEXT NOT NULL,
    "taxCode" TEXT NOT NULL,
    "taxName" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "description" TEXT,
    "rate" DOUBLE PRECISION NOT NULL,
    "rateType" TEXT NOT NULL DEFAULT 'percentage',
    "taxComponents" JSONB,
    "applicability" JSONB,
    "calculation" JSONB,
    "compliance" JSONB,
    "validity" JSONB,
    "accounting" JSONB,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fin_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_payment_terms" (
    "id" TEXT NOT NULL,
    "termCode" TEXT NOT NULL,
    "termName" TEXT NOT NULL,
    "description" TEXT,
    "paymentType" TEXT NOT NULL,
    "dueDays" INTEGER,
    "dueDate" INTEGER,
    "installments" JSONB,
    "discountTerms" JSONB,
    "penaltyTerms" JSONB,
    "applicableTo" TEXT NOT NULL DEFAULT 'both',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fin_payment_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_price_lists" (
    "id" TEXT NOT NULL,
    "priceListCode" TEXT NOT NULL,
    "priceListName" TEXT NOT NULL,
    "description" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "customerCategory" TEXT NOT NULL DEFAULT 'all',
    "applicableFor" TEXT NOT NULL DEFAULT 'sales',
    "pricingMethod" TEXT NOT NULL DEFAULT 'fixed',
    "markupPercentage" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "includeTax" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fin_price_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_price_list_items" (
    "id" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "minQty" DOUBLE PRECISION,
    "maxQty" DOUBLE PRECISION,
    "priceListId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fin_price_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_countries_code_key" ON "core_countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "core_companies_name_key" ON "core_companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "core_companies_taxId_key" ON "core_companies"("taxId");

-- CreateIndex
CREATE UNIQUE INDEX "core_departments_name_companyId_key" ON "core_departments"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_cost_centers_code_companyId_key" ON "core_cost_centers"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_plants_code_companyId_key" ON "core_plants"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_warehouses_code_companyId_key" ON "core_warehouses"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_currencies_code_key" ON "core_currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "core_uoms_code_companyId_key" ON "core_uoms"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_item_categories_name_companyId_key" ON "core_item_categories"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_item_groups_name_companyId_key" ON "core_item_groups"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_brands_name_companyId_key" ON "core_brands"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_hsn_sac_code_companyId_key" ON "core_hsn_sac"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_items_code_companyId_key" ON "core_items"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "core_barcodes_code_companyId_key" ON "core_barcodes"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "crm_customer_categories_code_companyId_key" ON "crm_customer_categories"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "crm_customers_customerCode_companyId_key" ON "crm_customers"("customerCode", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "proc_vendor_categories_name_companyId_key" ON "proc_vendor_categories"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "proc_vendors_vendorCode_companyId_key" ON "proc_vendors"("vendorCode", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "fin_accounts_accountCode_companyId_key" ON "fin_accounts"("accountCode", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "fin_bank_accounts_accountNumber_companyId_key" ON "fin_bank_accounts"("accountNumber", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "fin_taxes_taxCode_companyId_key" ON "fin_taxes"("taxCode", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "fin_payment_terms_termCode_companyId_key" ON "fin_payment_terms"("termCode", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "fin_price_lists_priceListCode_companyId_key" ON "fin_price_lists"("priceListCode", "companyId");

-- AddForeignKey
ALTER TABLE "core_states" ADD CONSTRAINT "core_states_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "core_countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_cities" ADD CONSTRAINT "core_cities_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "core_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_companies" ADD CONSTRAINT "core_companies_baseCurrencyId_fkey" FOREIGN KEY ("baseCurrencyId") REFERENCES "core_currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_branches" ADD CONSTRAINT "core_branches_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_branches" ADD CONSTRAINT "core_branches_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "core_cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_departments" ADD CONSTRAINT "core_departments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_departments" ADD CONSTRAINT "core_departments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "core_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_designations" ADD CONSTRAINT "core_designations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_cost_centers" ADD CONSTRAINT "core_cost_centers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_plants" ADD CONSTRAINT "core_plants_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_plants" ADD CONSTRAINT "core_plants_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "core_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_warehouses" ADD CONSTRAINT "core_warehouses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_warehouses" ADD CONSTRAINT "core_warehouses_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "core_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_exchange_rates" ADD CONSTRAINT "core_exchange_rates_fromCurrencyId_fkey" FOREIGN KEY ("fromCurrencyId") REFERENCES "core_currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_exchange_rates" ADD CONSTRAINT "core_exchange_rates_toCurrencyId_fkey" FOREIGN KEY ("toCurrencyId") REFERENCES "core_currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_exchange_rates" ADD CONSTRAINT "core_exchange_rates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_uoms" ADD CONSTRAINT "core_uoms_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_uom_conversions" ADD CONSTRAINT "core_uom_conversions_fromUomId_fkey" FOREIGN KEY ("fromUomId") REFERENCES "core_uoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_uom_conversions" ADD CONSTRAINT "core_uom_conversions_toUomId_fkey" FOREIGN KEY ("toUomId") REFERENCES "core_uoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_uom_conversions" ADD CONSTRAINT "core_uom_conversions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_item_categories" ADD CONSTRAINT "core_item_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_item_groups" ADD CONSTRAINT "core_item_groups_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "core_item_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_item_groups" ADD CONSTRAINT "core_item_groups_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_brands" ADD CONSTRAINT "core_brands_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_hsn_sac" ADD CONSTRAINT "core_hsn_sac_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_items" ADD CONSTRAINT "core_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "core_item_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_items" ADD CONSTRAINT "core_items_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "core_item_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_items" ADD CONSTRAINT "core_items_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "core_uoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_items" ADD CONSTRAINT "core_items_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "core_brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_items" ADD CONSTRAINT "core_items_hsnSacId_fkey" FOREIGN KEY ("hsnSacId") REFERENCES "core_hsn_sac"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_items" ADD CONSTRAINT "core_items_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_barcodes" ADD CONSTRAINT "core_barcodes_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "core_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_barcodes" ADD CONSTRAINT "core_barcodes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_customer_categories" ADD CONSTRAINT "crm_customer_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_customers" ADD CONSTRAINT "crm_customers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "crm_customer_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_customers" ADD CONSTRAINT "crm_customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proc_vendor_categories" ADD CONSTRAINT "proc_vendor_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proc_vendors" ADD CONSTRAINT "proc_vendors_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "proc_vendor_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proc_vendors" ADD CONSTRAINT "proc_vendors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_accounts" ADD CONSTRAINT "fin_accounts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "fin_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_accounts" ADD CONSTRAINT "fin_accounts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_bank_accounts" ADD CONSTRAINT "fin_bank_accounts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_taxes" ADD CONSTRAINT "fin_taxes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_payment_terms" ADD CONSTRAINT "fin_payment_terms_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_price_lists" ADD CONSTRAINT "fin_price_lists_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "core_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_price_list_items" ADD CONSTRAINT "fin_price_list_items_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "fin_price_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
