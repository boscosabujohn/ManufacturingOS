import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Common Masters...');

    // 1. Countries
    const india = await prisma.country.upsert({
        where: { code: 'IN' },
        update: {},
        create: {
            id: 'country-india-id',
            code: 'IN',
            name: 'India',
            phoneCode: '+91',
        },
    });

    const uae = await prisma.country.upsert({
        where: { code: 'AE' },
        update: {},
        create: {
            id: 'country-uae-id',
            code: 'AE',
            name: 'United Arab Emirates',
            phoneCode: '+971',
        },
    });

    // 2. Currencies
    const inr = await prisma.currency.upsert({
        where: { code: 'INR' },
        update: {},
        create: {
            id: 'curr-inr-id',
            code: 'INR',
            name: 'Indian Rupee',
            symbol: '₹',
            symbolNative: '₹',
            decimalDigits: 2,
        },
    });

    const aed = await prisma.currency.upsert({
        where: { code: 'AED' },
        update: {},
        create: {
            id: 'curr-aed-id',
            code: 'AED',
            name: 'United Arab Emirates Dirham',
            symbol: 'AED',
            symbolNative: 'د.إ',
            decimalDigits: 2,
        },
    });

    const usd = await prisma.currency.upsert({
        where: { code: 'USD' },
        update: {},
        create: {
            id: 'curr-usd-id',
            code: 'USD',
            name: 'US Dollar',
            symbol: '$',
            symbolNative: '$',
            decimalDigits: 2,
        },
    });

    // 3. Company
    const mainCompany = await prisma.company.upsert({
        where: { name: 'OptiForge HQ' },
        update: {},
        create: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'OptiForge HQ',
            taxId: 'TAX-001',
            baseCurrencyId: inr.id,
            address: '123 Factory Lane, Industrial Zone',
            email: 'hq@optiforge.com',
            phone: '+91 99999 88888',
        },
    });

    // 4. Branch
    const mainBranch = await prisma.branch.upsert({
        where: { id: 'branch-1-id' },
        update: {},
        create: {
            id: 'branch-1-id',
            name: 'Main Factory Branch',
            companyId: mainCompany.id,
            address: 'Plot A, Sector 5',
        },
    });

    // 5. Departments
    const departments = ['Engineering', 'Finance', 'HR', 'Production', 'Sales', 'Technology'];
    for (const deptName of departments) {
        await prisma.department.upsert({
            where: { name_companyId: { name: deptName, companyId: mainCompany.id } },
            update: {},
            create: {
                name: deptName,
                companyId: mainCompany.id,
                branchId: mainBranch.id,
            },
        });
    }

    // 5.1 Designations
    const designations = [
        { code: 'DES-MGR', name: 'Manager', level: 1, grade: 'G1' },
        { code: 'DES-ENG', name: 'Senior Engineer', level: 2, grade: 'G2' },
        { code: 'DES-SUP', name: 'Production Supervisor', level: 3, grade: 'G3' },
        { code: 'DES-OPR', name: 'Machine Operator', level: 4, grade: 'G4' },
    ];
    const designationIds: Record<string, string> = {};
    for (const des of designations) {
        const d = await prisma.designation.upsert({
            where: { code_companyId: { code: des.code, companyId: mainCompany.id } },
            update: des,
            create: { ...des, companyId: mainCompany.id },
        });
        designationIds[des.code] = d.id;
    }

    // 5.2 Shifts
    const shifts = [
        { code: 'SH-GEN', name: 'General Shift', startTime: '09:00', endTime: '18:00' },
        { code: 'SH-MORN', name: 'Morning Shift', startTime: '06:00', endTime: '14:00' },
        { code: 'SH-EVE', name: 'Evening Shift', startTime: '14:00', endTime: '22:00' },
    ];
    for (const shift of shifts) {
        await prisma.shift.upsert({
            where: { code_companyId: { code: shift.code, companyId: mainCompany.id } },
            update: shift,
            create: { ...shift, companyId: mainCompany.id },
        });
    }

    // 5.3 Holidays
    const currentYear = new Date().getFullYear();
    const holidays = [
        { date: new Date(`${currentYear}-01-01`), name: 'New Year Day', holidayType: 'Public' },
        { date: new Date(`${currentYear}-01-26`), name: 'Republic Day', holidayType: 'Public' },
        { date: new Date(`${currentYear}-08-15`), name: 'Independence Day', holidayType: 'Public' },
        { date: new Date(`${currentYear}-10-02`), name: 'Gandhi Jayanti', holidayType: 'Public' },
    ];
    for (const holiday of holidays) {
        await prisma.holiday.upsert({
            where: { date_companyId: { date: holiday.date, companyId: mainCompany.id } },
            update: holiday,
            create: { ...holiday, companyId: mainCompany.id },
        });
    }

    // 5.4 Employees
    const deptEngineering = await prisma.department.findFirst({ where: { name: 'Engineering', companyId: mainCompany.id } });
    const deptProduction = await prisma.department.findFirst({ where: { name: 'Production', companyId: mainCompany.id } });

    const employees = [
        {
            employeeCode: 'EMP001',
            firstName: 'Rahul',
            lastName: 'Sharma',
            email: 'rahul.sharma@optiforge.com',
            phone: '+91 98765 43210',
            designationId: designationIds['DES-MGR'],
            departmentId: deptEngineering!.id,
            branchId: mainBranch.id,
            joiningDate: new Date('2023-01-15'),
            status: 'Active',
        },
        {
            employeeCode: 'EMP002',
            firstName: 'Priya',
            lastName: 'Patel',
            email: 'priya.patel@optiforge.com',
            phone: '+91 98765 43211',
            designationId: designationIds['DES-ENG'],
            departmentId: deptEngineering!.id,
            branchId: mainBranch.id,
            joiningDate: new Date('2023-03-20'),
            status: 'Active',
        },
        {
            employeeCode: 'EMP003',
            firstName: 'Amit',
            lastName: 'Kumar',
            email: 'amit.kumar@optiforge.com',
            phone: '+91 98765 43212',
            designationId: designationIds['DES-SUP'],
            departmentId: deptProduction!.id,
            branchId: mainBranch.id,
            joiningDate: new Date('2023-06-10'),
            status: 'Active',
        },
    ];

    for (const emp of employees) {
        await prisma.employee.upsert({
            where: { employeeCode_companyId: { employeeCode: emp.employeeCode, companyId: mainCompany.id } },
            update: emp,
            create: { ...emp, companyId: mainCompany.id },
        });
    }

    // 6. Cost Centers
    const costCenters = [
        { code: 'CC-PROD-01', name: 'Production Line 1' },
        { code: 'CC-ADMIN-01', name: 'Administration' },
        { code: 'CC-RD-01', name: 'R&D Lab' },
    ];
    for (const cc of costCenters) {
        await prisma.costCenter.upsert({
            where: { code_companyId: { code: cc.code, companyId: mainCompany.id } },
            update: {},
            create: {
                code: cc.code,
                name: cc.name,
                companyId: mainCompany.id,
            },
        });
    }

    // 7. Plants
    const plants = [
        { code: 'PLT-MH-01', name: 'Maharashtra Main Plant' },
        { code: 'PLT-GJ-01', name: 'Gujarat Assembly Unit' },
    ];
    for (const plant of plants) {
        await prisma.plant.upsert({
            where: { code_companyId: { code: plant.code, companyId: mainCompany.id } },
            update: {},
            create: {
                code: plant.code,
                name: plant.name,
                companyId: mainCompany.id,
                branchId: mainBranch.id,
            },
        });
    }

    // 8. Warehouses
    const warehouses = [
        { code: 'WH-RM-01', name: 'Raw Material Warehouse' },
        { code: 'WH-FG-01', name: 'Finished Goods Warehouse' },
    ];
    for (const wh of warehouses) {
        await prisma.warehouse.upsert({
            where: { code_companyId: { code: wh.code, companyId: mainCompany.id } },
            update: {},
            create: {
                code: wh.code,
                name: wh.name,
                companyId: mainCompany.id,
                branchId: mainBranch.id,
                address: 'Sector 4, Industrial Area',
            },
        });
    }

    // 9. Exchange Rates
    await prisma.exchangeRate.deleteMany({ where: { companyId: mainCompany.id } });
    const exchangeRates = [
        { fromCurrencyId: usd.id, toCurrencyId: inr.id, rate: 83.5, effectiveDate: new Date(), companyId: mainCompany.id },
        { fromCurrencyId: aed.id, toCurrencyId: inr.id, rate: 22.7, effectiveDate: new Date(), companyId: mainCompany.id },
    ];
    for (const er of exchangeRates) {
        await prisma.exchangeRate.create({ data: er });
    }

    // 10. UOMs
    const uoms = [
        { code: 'KG', name: 'Kilogram' },
        { code: 'PCS', name: 'Pieces' },
        { code: 'MTR', name: 'Meter' },
        { code: 'SHT', name: 'Sheet' },
    ];
    for (const uom of uoms) {
        await prisma.uom.upsert({
            where: { code_companyId: { code: uom.code, companyId: mainCompany.id } },
            update: {},
            create: {
                code: uom.code,
                name: uom.name,
                companyId: mainCompany.id,
            },
        });
    }

    // 11. Item Categories
    const categories = ['Electronics', 'Mechanical', 'Raw Materials', 'Finished Goods'];
    const categoryIds: Record<string, string> = {};
    for (const catName of categories) {
        const cat = await prisma.itemCategory.upsert({
            where: { name_companyId: { name: catName, companyId: mainCompany.id } },
            update: {},
            create: {
                name: catName,
                companyId: mainCompany.id,
            },
        });
        categoryIds[catName] = cat.id;
    }

    // 12. Item Groups
    const groups = [
        { name: 'Microchips', category: 'Electronics' },
        { name: 'Steel Sheets', category: 'Raw Materials' },
        { name: 'Assembly Parts', category: 'Finished Goods' },
    ];
    const groupIds: Record<string, string> = {};
    for (const group of groups) {
        const g = await prisma.itemGroup.upsert({
            where: { name_companyId: { name: group.name, companyId: mainCompany.id } },
            update: {},
            create: {
                name: group.name,
                categoryId: categoryIds[group.category],
                companyId: mainCompany.id,
            },
        });
        groupIds[group.name] = g.id;
    }

    // 13. Brands
    const brands = ['Samsung', 'Tata Steel', 'OptiForge'];
    const brandIds: Record<string, string> = {};
    for (const brandName of brands) {
        const b = await prisma.brand.upsert({
            where: { name_companyId: { name: brandName, companyId: mainCompany.id } },
            update: {},
            create: {
                name: brandName,
                companyId: mainCompany.id,
            },
        });
        brandIds[brandName] = b.id;
    }

    // 14. HSN/SAC Codes
    const hsnSacs = [
        { code: 'HSN-8542', description: 'Electronic Integrated Circuits', gstPercentage: 18 },
        { code: 'HSN-7208', description: 'Flat-rolled products of iron or non-alloy steel', gstPercentage: 18 },
    ];
    const hsnIds: Record<string, string> = {};
    for (const hsn of hsnSacs) {
        const h = await prisma.hsnSac.upsert({
            where: { code_companyId: { code: hsn.code, companyId: mainCompany.id } },
            update: {
                description: hsn.description,
                gstPercentage: hsn.gstPercentage,
            },
            create: {
                code: hsn.code,
                description: hsn.description,
                gstPercentage: hsn.gstPercentage,
                companyId: mainCompany.id,
            },
        });
        hsnIds[hsn.code] = h.id;
    }

    // 15. Items
    const kgUom = await prisma.uom.findFirst({ where: { code: 'KG', companyId: mainCompany.id } });
    const pcsUom = await prisma.uom.findFirst({ where: { code: 'PCS', companyId: mainCompany.id } });

    const items = [
        {
            code: 'ITM-STEEL-001',
            name: 'Cold Rolled Steel Sheet',
            itemType: 'RAW_MATERIAL',
            categoryId: categoryIds['Raw Materials'],
            groupId: groupIds['Steel Sheets'],
            uomId: kgUom!.id,
            brandId: brandIds['Tata Steel'],
            hsnSacId: hsnIds['HSN-7208'],
            purchasePrice: 45.0,
            sellingPrice: 0,
            costPrice: 45.0,
        },
        {
            code: 'ITM-CHIP-001',
            name: 'Microcontroller 32-bit',
            itemType: 'RAW_MATERIAL',
            categoryId: categoryIds['Electronics'],
            groupId: groupIds['Microchips'],
            uomId: pcsUom!.id,
            brandId: brandIds['Samsung'],
            hsnSacId: hsnIds['HSN-8542'],
            purchasePrice: 12.5,
            sellingPrice: 0,
            costPrice: 12.5,
        }
    ];

    for (const item of items) {
        await prisma.item.upsert({
            where: { code_companyId: { code: item.code, companyId: mainCompany.id } },
            update: item,
            create: {
                ...item,
                companyId: mainCompany.id,
            },
        });
    }

    // 16. Stakeholder Masters (Customers & Vendors)
    console.log('Seeding Stakeholders...');

    // Customer Categories
    const customerCategories = [
        {
            code: 'CAT-PREM',
            name: 'Premium',
            description: 'High-value customers with excellent payment history',
            level: 'Primary',
            classification: 'Premium',
            status: 'Active',
            criteria: { minRevenue: 1000000, minOrders: 50, minRetention: 24, creditScore: 'A+' },
            benefits: { discountPercent: 20, creditDays: 60, creditLimit: 5000000, prioritySupport: true, freeShipping: true, dedicatedManager: true },
            terms: { paymentTerms: 'Net 60', deliveryPriority: 'High', returnPolicy: '60 days', warrantyExtension: 12 },
            targets: { revenueTarget: 10000000, growthTarget: 25, retentionTarget: 95 },
            metrics: { customerCount: 45, totalRevenue: 125000000, avgOrderValue: 55000, churnRate: 2.5 },
            color: '#8B5CF6'
        },
        {
            code: 'CAT-STD',
            name: 'Standard',
            description: 'Regular customers with consistent purchase patterns',
            level: 'Primary',
            classification: 'Standard',
            status: 'Active',
            criteria: { minRevenue: 100000, minOrders: 10, minRetention: 6, creditScore: 'B' },
            benefits: { discountPercent: 10, creditDays: 30, creditLimit: 500000, prioritySupport: false, freeShipping: false, dedicatedManager: false },
            terms: { paymentTerms: 'Net 30', deliveryPriority: 'Medium', returnPolicy: '30 days' },
            targets: { revenueTarget: 1000000, growthTarget: 15, retentionTarget: 80 },
            metrics: { customerCount: 250, totalRevenue: 75000000, avgOrderValue: 12000, churnRate: 8.5 },
            color: '#3B82F6'
        }
    ];

    const custCatIds: Record<string, string> = {};
    for (const cat of customerCategories) {
        const c = await prisma.customerCategory.upsert({
            where: { code_companyId: { code: cat.code, companyId: mainCompany.id } },
            update: cat,
            create: { ...cat, companyId: mainCompany.id }
        });
        custCatIds[cat.name] = c.id;
    }

    // Customers
    const customers = [
        {
            customerCode: 'CUST001',
            customerName: 'Acme Corporation',
            customerType: 'business',
            status: 'active',
            categoryId: custCatIds['Premium'],
            contactPerson: 'John Smith',
            email: 'john.smith@acme.com',
            phone: '+1-555-123-4567',
            address: { line1: '123 Business Ave', city: 'New York', state: 'NY', country: 'USA', postalCode: '10001' },
            taxInfo: { taxId: '12-3456789', vatNumber: 'US123456789', taxClassification: 'Business' },
            creditInfo: { creditLimit: 50000, paymentTerms: 'Net 30', creditRating: 'excellent' },
            pricing: { priceList: 'Enterprise', discountPercentage: 15, currency: 'USD' },
            salesInfo: { salesRep: 'Alice Johnson', territory: 'Northeast', totalSales: 285000, averageOrderValue: 5500 }
        }
    ];

    for (const cust of customers) {
        await prisma.customer.upsert({
            where: { customerCode_companyId: { customerCode: cust.customerCode, companyId: mainCompany.id } },
            update: cust,
            create: { ...cust, companyId: mainCompany.id }
        });
    }

    // Vendor Categories
    const vendorCategories = ['Hardware', 'Wood Materials', 'Appliances'];
    const vendCatIds: Record<string, string> = {};
    for (const name of vendorCategories) {
        const c = await prisma.vendorCategory.upsert({
            where: { name_companyId: { name, companyId: mainCompany.id } },
            update: { name },
            create: { name, companyId: mainCompany.id }
        });
        vendCatIds[name] = c.id;
    }

    // Vendors
    const vendors = [
        {
            vendorCode: 'VEND001',
            vendorName: 'Premium Hardware Supplies Inc.',
            vendorType: 'supplier',
            status: 'active',
            categoryId: vendCatIds['Hardware'],
            contactPerson: 'Michael Johnson',
            email: 'mjohnson@premiumhardware.com',
            phone: '+1-555-234-5678',
            address: { line1: '789 Industrial Drive', city: 'Atlanta', state: 'GA', country: 'USA', postalCode: '30309' },
            taxInfo: { taxId: '98-7654321', vatNumber: 'US987654321', taxClassification: 'Corporation' },
            paymentInfo: { paymentTerms: 'Net 30', preferredPaymentMethod: 'ACH' },
            qualifications: { certifications: ['ISO 9001'], licenses: ['General Contractor'], qualityRating: 'excellent' },
            supplierInfo: { leadTime: 5, minimumOrderValue: 500, currency: 'USD' },
            performance: { onTimeDelivery: 95, qualityScore: 4.8, totalOrders: 127, totalValue: 485000 }
        }
    ];

    for (const vend of vendors) {
        await prisma.vendor.upsert({
            where: { vendorCode_companyId: { vendorCode: vend.vendorCode, companyId: mainCompany.id } },
            update: vend,
            create: { ...vend, companyId: mainCompany.id }
        });
    }

    // 17. Financial Masters
    console.log('Seeding Financial Masters...');

    // Chart of Accounts
    const accounts = [
        { accountCode: '1000', accountName: 'Assets', accountType: 'asset', isControlAccount: true, level: 1 },
        { accountCode: '1100', accountName: 'Cash', accountType: 'asset', parentCode: '1000', level: 2 },
        { accountCode: '1200', accountName: 'Accounts Receivable', accountType: 'asset', parentCode: '1000', isControlAccount: true, level: 2 },
        { accountCode: '2000', accountName: 'Liabilities', accountType: 'liability', isControlAccount: true, level: 1 },
        { accountCode: '3000', accountName: 'Equity', accountType: 'equity', isControlAccount: true, level: 1 },
        { accountCode: '4000', accountName: 'Revenue', accountType: 'revenue', isControlAccount: true, level: 1 },
        { accountCode: '5000', accountName: 'Expenses', accountType: 'expense', isControlAccount: true, level: 1 },
    ];

    for (const acc of accounts) {
        const { parentCode, ...accData } = acc as any;
        let parentId = null;
        if (parentCode) {
            const parent = await prisma.account.findFirst({ where: { accountCode: parentCode, companyId: mainCompany.id } });
            parentId = parent?.id;
        }
        await prisma.account.upsert({
            where: { accountCode_companyId: { accountCode: acc.accountCode, companyId: mainCompany.id } },
            update: { ...accData, parentId },
            create: { ...accData, parentId, companyId: mainCompany.id }
        });
    }

    // Bank Accounts
    const bankAccounts = [
        {
            bankName: 'HDFC Bank',
            accountNumber: '50200012345678',
            accountType: 'current',
            ifscCode: 'HDFC0001234',
            accountHolderName: 'OptiForge HQ',
            isPrimary: true,
            status: 'active'
        }
    ];

    for (const bank of bankAccounts) {
        await prisma.bankAccount.upsert({
            where: { accountNumber_companyId: { accountNumber: bank.accountNumber, companyId: mainCompany.id } },
            update: bank,
            create: { ...bank, companyId: mainCompany.id }
        });
    }

    // Taxes
    const taxes = [
        { taxCode: 'GST-18', taxName: 'GST 18%', taxType: 'gst', rate: 18, rateType: 'percentage', status: 'active' },
        { taxCode: 'GST-12', taxName: 'GST 12%', taxType: 'gst', rate: 12, rateType: 'percentage', status: 'active' },
        { taxCode: 'GST-5', taxName: 'GST 5%', taxType: 'gst', rate: 5, rateType: 'percentage', status: 'active' },
    ];

    for (const tax of taxes) {
        await prisma.tax.upsert({
            where: { taxCode_companyId: { taxCode: tax.taxCode, companyId: mainCompany.id } },
            update: tax,
            create: { ...tax, companyId: mainCompany.id }
        });
    }

    // Payment Terms
    const paymentTerms = [
        { termCode: 'NET-30', termName: 'Net 30 Days', paymentType: 'days', dueDays: 30, isDefault: true, status: 'active' },
        { termCode: 'IMMEDIATE', termName: 'Immediate', paymentType: 'immediate', dueDays: 0, isDefault: false, status: 'active' },
    ];

    for (const term of paymentTerms) {
        await prisma.paymentTerm.upsert({
            where: { termCode_companyId: { termCode: term.termCode, companyId: mainCompany.id } },
            update: term,
            create: { ...term, companyId: mainCompany.id }
        });
    }

    // Price Lists
    const priceList = await prisma.priceList.upsert({
        where: { priceListCode_companyId: { priceListCode: 'STD-SALES', companyId: mainCompany.id } },
        update: { priceListName: 'Standard Sales' },
        create: {
            priceListCode: 'STD-SALES',
            priceListName: 'Standard Sales',
            effectiveFrom: new Date(),
            companyId: mainCompany.id
        }
    });

    await prisma.priceListItem.createMany({
        data: [
            { priceListId: priceList.id, itemCode: 'ITM-STEEL-001', itemName: 'Cold Rolled Steel Sheet', price: 60.0 },
            { priceListId: priceList.id, itemCode: 'ITM-CHIP-001', itemName: 'Microcontroller 32-bit', price: 20.0 }
        ]
    }).catch(() => { }); // Ignore if already exists for simplicity in seed



    // 18. Geographic Masters - Territories
    console.log('Seeding Territories...');
    const territories = [
        { code: 'WEST-MH-01', name: 'Western Maharashtra Sales' },
        { code: 'SOUTH-KA-01', name: 'South Karnataka Sales' },
        { code: 'NORTH-DL-01', name: 'Delhi NCR Sales' },
        { code: 'EAST-WB-01', name: 'West Bengal Service' },
    ];

    for (const territory of territories) {
        await prisma.territory.upsert({
            where: { code_companyId: { code: territory.code, companyId: mainCompany.id } },
            update: territory,
            create: { ...territory, companyId: mainCompany.id }
        });
    }

    // 19. Manufacturing Masters
    console.log('Seeding Manufacturing Masters...');

    // Work Centers
    const prodDept = await prisma.department.findFirst({ where: { name: 'Production', companyId: mainCompany.id } });
    const kgUoms = await prisma.uom.findFirst({ where: { code: 'KG', companyId: mainCompany.id } });
    const pcsUoms = await prisma.uom.findFirst({ where: { code: 'PCS', companyId: mainCompany.id } });

    const machiningCenter = await prisma.workCenter.upsert({
        where: { code_companyId: { code: 'WC-PRD-001', companyId: mainCompany.id } },
        update: {},
        create: {
            code: 'WC-PRD-001',
            name: 'CNC Machining Center',
            type: 'Production',
            departmentId: prodDept?.id,
            location: 'Factory Floor - Zone A',
            dailyCapacity: 500,
            uomId: pcsUoms?.id,
            efficiency: 85,
            companyId: mainCompany.id
        }
    });

    const assemblyLine = await prisma.workCenter.upsert({
        where: { code_companyId: { code: 'WC-ASM-001', companyId: mainCompany.id } },
        update: {},
        create: {
            code: 'WC-ASM-001',
            name: 'Assembly Line 1',
            type: 'Assembly',
            departmentId: prodDept?.id,
            location: 'Factory Floor - Zone B',
            dailyCapacity: 1000,
            uomId: pcsUoms?.id,
            efficiency: 92,
            companyId: mainCompany.id
        }
    });

    // Machines
    await prisma.machine.upsert({
        where: { machineCode_companyId: { machineCode: 'CNC-001', companyId: mainCompany.id } },
        update: {},
        create: {
            machineCode: 'CNC-001',
            machineName: 'CNC Router Machine',
            description: 'High precision CNC router for cabinet cutting',
            category: 'cutting',
            manufacturer: 'Biesse',
            model: 'Rover A 1632',
            serialNumber: 'BIE-2023-CNC-001',
            capacity: '1600 x 3200 mm',
            power: '9.2 kW',
            dimensions: '4500 x 2800 x 2200 mm',
            weight: 3500,
            workCenterId: machiningCenter.id,
            status: 'operational',
            efficiency: 92,
            utilizationRate: 85,
            companyId: mainCompany.id
        }
    });

    // Operations
    const drillOp = await prisma.operation.upsert({
        where: { code_companyId: { code: 'OP-DRILL-01', companyId: mainCompany.id } },
        update: {},
        create: {
            code: 'OP-DRILL-01',
            name: 'Drilling Operation',
            description: 'Precision drilling for assembly holes',
            workCenterId: machiningCenter.id,
            setupTime: 15,
            runTime: 5,
            companyId: mainCompany.id
        }
    });

    const assembleOp = await prisma.operation.upsert({
        where: { code_companyId: { code: 'OP-ASSY-01', companyId: mainCompany.id } },
        update: {},
        create: {
            code: 'OP-ASSY-01',
            name: 'Main Assembly',
            description: 'Final assembly of components',
            workCenterId: assemblyLine.id,
            setupTime: 30,
            runTime: 45,
            companyId: mainCompany.id
        }
    });

    // Skills
    await prisma.skill.upsert({
        where: { name_companyId: { name: 'CNC Operation', companyId: mainCompany.id } },
        update: {},
        create: {
            name: 'CNC Operation',
            description: 'Operating high-precision CNC machines',
            category: 'Technical',
            companyId: mainCompany.id
        }
    });

    // Tools
    await prisma.tool.upsert({
        where: { code_companyId: { code: 'TOOL-DRL-001', companyId: mainCompany.id } },
        update: {},
        create: {
            code: 'TOOL-DRL-001',
            name: 'High Speed Drill Bit Set',
            category: 'Drilling',
            status: 'Available',
            companyId: mainCompany.id
        }
    });

    // Quality Parameters
    await prisma.qualityParameter.upsert({
        where: { code_companyId: { code: 'QP-DIM-01', companyId: mainCompany.id } },
        update: {},
        create: {
            code: 'QP-DIM-01',
            name: 'Dimensional Accuracy',
            description: 'Measurement error vs design',
            unit: 'mm',
            minValue: -0.1,
            maxValue: 0.1,
            targetValue: 0,
            companyId: mainCompany.id
        }
    });

    // Items for Routing and Batch
    const steelSheet = await prisma.item.findFirst({ where: { code: 'ITM-STEEL-001', companyId: mainCompany.id } });

    if (steelSheet) {
        // Routing
        const steelRouting = await prisma.routing.upsert({
            where: { code_companyId: { code: 'RT-STEEL-01', companyId: mainCompany.id } },
            update: {},
            create: {
                code: 'RT-STEEL-01',
                name: 'Steel Sheet Processing',
                itemId: steelSheet.id,
                isDefault: true,
                companyId: mainCompany.id
            }
        });

        // Routing Step
        await prisma.routingStep.upsert({
            where: { routingId_stepNumber: { routingId: steelRouting.id, stepNumber: 10 } },
            update: {},
            create: {
                stepNumber: 10,
                routingId: steelRouting.id,
                operationId: drillOp.id,
                workCenterId: machiningCenter.id,
                description: 'Pre-drilling holes'
            }
        });

        // Batch
        await prisma.batch.upsert({
            where: { batchNumber_companyId: { batchNumber: 'BAT-2024-001', companyId: mainCompany.id } },
            update: {},
            create: {
                batchNumber: 'BAT-2024-001',
                itemId: steelSheet.id,
                quantity: 1000,
                status: 'In Production',
                manufacturingDate: new Date(),
                companyId: mainCompany.id
            }
        });
    }

    // 20. Kitchen Manufacturing Masters
    console.log('Seeding Kitchen Manufacturing Masters...');

    // Cabinet Types
    const cabinetTypes = [
        {
            code: 'CAB-BASE-600',
            name: 'Standard Base Cabinet 600mm',
            category: 'Base Cabinet',
            subcategory: 'Single Door',
            widthOptions: '450, 600, 750, 900',
            depth: 560,
            height: 720,
            unit: 'mm',
            doors: 1,
            drawers: 0,
            shelves: 1,
            features: ['Soft-close hinges', 'Adjustable legs'],
            materials: ['18mm MR Plywood'],
            finishOptions: ['Laminate', 'PU Paint'],
            hardwareIncluded: ['Hinges', 'Legs', 'Shelf Pins'],
            basePrice: 4500,
            installationType: 'Floor-standing',
            weightCapacity: 100,
            status: 'Active',
            companyId: mainCompany.id
        },
        {
            code: 'CAB-WALL-900',
            name: 'Wall Cabinet 900mm Double Door',
            category: 'Wall Cabinet',
            subcategory: 'Double Door',
            widthOptions: '600, 900, 1200',
            depth: 300,
            height: 720,
            unit: 'mm',
            doors: 2,
            drawers: 0,
            shelves: 2,
            features: ['Adjustable shelves'],
            materials: ['18mm MR Plywood'],
            finishOptions: ['Laminate', 'Veneer'],
            hardwareIncluded: ['Wall hangers', 'Hinges'],
            basePrice: 5200,
            installationType: 'Wall-mounted',
            weightCapacity: 40,
            status: 'Active',
            companyId: mainCompany.id
        }
    ];

    for (const ct of cabinetTypes) {
        await prisma.cabinetType.upsert({
            where: { code_companyId: { code: ct.code, companyId: mainCompany.id } },
            update: ct,
            create: ct
        });
    }

    // Kitchen Hardware
    const kitchenHardware = [
        {
            code: 'HW-HNG-SC',
            name: 'Soft-Close Concealed Hinge',
            category: 'Hinges',
            subcategory: 'Auto-close',
            brand: 'Blum',
            specifications: { material: 'Nickel-plated steel', openingAngle: 110, mountingType: 'Full Overlay' },
            priceMin: 150,
            priceMax: 250,
            warranty: 'Lifetime Warranty',
            installationType: 'Screw-on',
            features: ['3-way adjustment', 'Integrated dampening'],
            stock: 1000,
            reorderLevel: 200,
            status: 'Active',
            companyId: mainCompany.id
        },
        {
            code: 'HW-DRW-TDM',
            name: 'Tandembox Antaro Drawer System',
            category: 'Drawer Slides',
            subcategory: 'Full Extension',
            brand: 'Blum',
            specifications: { loadCapacity: '30kg', length: '500mm', color: 'Silk White' },
            priceMin: 2500,
            priceMax: 3500,
            warranty: '10 Years',
            installationType: 'Bottom-mounted',
            features: ['Smooth running', 'Feather-light glide'],
            stock: 500,
            reorderLevel: 50,
            status: 'Active',
            companyId: mainCompany.id
        }
    ];

    for (const hw of kitchenHardware) {
        await prisma.kitchenHardware.upsert({
            where: { code_companyId: { code: hw.code, companyId: mainCompany.id } },
            update: hw,
            create: hw
        });
    }

    // Kitchen Finishes
    const kitchenFinishes = [
        {
            code: 'FIN-LAM-GLS',
            name: 'High Gloss White Laminate',
            category: 'Laminate',
            subcategory: 'Glossy',
            properties: { texture: 'Smooth', sheen: 'High Gloss', durability: 'High' },
            colors: ['Arctic White', 'Off White'],
            applicationMethod: ['Manual Pressing', 'Post-forming'],
            suitableFor: ['Cabinets', 'Shutters'],
            coverageValue: 32,
            coverageUnit: 'sqft',
            pricePerUnit: 1800,
            maintenance: 'Wipe with damp cloth',
            warranty: '5 Years',
            certifications: ['FSC Certified'],
            status: 'Active',
            companyId: mainCompany.id
        },
        {
            code: 'FIN-PU-MAT',
            name: 'Matte PU Finish',
            category: 'PU Finish',
            subcategory: 'Matte',
            properties: { texture: 'Velvety', sheen: 'Matte', scratchResistance: 'High' },
            colors: ['Charcoal Grey', 'Navy Blue', 'Forest Green'],
            applicationMethod: ['Spray Painting'],
            suitableFor: ['Shutters', 'Panels'],
            coverageValue: 50,
            coverageUnit: 'sqft',
            pricePerUnit: 350,
            maintenance: 'Avoid abrasive cleaners',
            warranty: '3 Years',
            status: 'Active',
            companyId: mainCompany.id
        }
    ];

    for (const kf of kitchenFinishes) {
        await prisma.kitchenFinish.upsert({
            where: { code_companyId: { code: kf.code, companyId: mainCompany.id } },
            update: kf,
            create: kf
        });
    }

    // Material Grades
    const materialGrades = [
        {
            code: 'MAT-PLY-BWP',
            name: 'BWP Marine Grade Plywood',
            category: 'Plywood',
            grade: 'Premium',
            specifications: { thickness: 18, density: 750, moistureContent: 10 },
            qualityStandards: ['IS:710'],
            applications: ['Kitchen Carcass', 'Bathroom Vanities'],
            features: ['Boiling Water Proof', 'Termite Resistant'],
            pricePerUnit: 120,
            unit: 'sqft',
            minOrderQuantity: 10,
            availableSizes: ['8x4 ft', '7x4 ft'],
            supplierRating: 4.8,
            leadTime: '3 Days',
            status: 'Active',
            companyId: mainCompany.id
        },
        {
            code: 'MAT-MDF-HD',
            name: 'High Density Fiberboard (HDF)',
            category: 'HDF',
            grade: 'Standard',
            specifications: { thickness: 12, density: 850 },
            qualityStandards: ['EN 622-5'],
            applications: ['Shutter Cores', 'Decorative Panels'],
            features: ['High Screw Holding', 'Smooth Surface'],
            pricePerUnit: 85,
            unit: 'sqft',
            minOrderQuantity: 50,
            availableSizes: ['8x4 ft'],
            supplierRating: 4.2,
            leadTime: '5 Days',
            status: 'Active',
            companyId: mainCompany.id
        }
    ];

    for (const mg of materialGrades) {
        await prisma.materialGrade.upsert({
            where: { code_companyId: { code: mg.code, companyId: mainCompany.id } },
            update: mg,
            create: mg
        });
    }

    // Kitchen Layouts
    const kitchenLayouts = [
        {
            code: 'LAY-LSHP',
            name: 'Classic L-Shape Layout',
            layoutType: 'L-Shape',
            style: 'Modern',
            dimensions: { length: 3500, width: 2500, unit: 'mm' },
            features: ['Efficient Work Triangle', 'Corner Optimization'],
            cabinetUnits: { base: 6, wall: 4, tall: 1 },
            workTriangle: { sinkToStove: 1800, stoveToFridge: 2100, fridgeToSink: 1500 },
            appliances: ['Hob', 'Chimney', 'Oven'],
            estimatedCost: 250000,
            popularity: 95,
            status: 'Active',
            companyId: mainCompany.id
        },
        {
            code: 'LAY-ISL',
            name: 'Contemporary Island Kitchen',
            layoutType: 'Island',
            style: 'Contemporary',
            dimensions: { length: 5000, width: 4000, unit: 'mm' },
            features: ['Large Prep Area', 'Social Hub'],
            cabinetUnits: { base: 10, wall: 6, island: 1 },
            specifications: { counterHeight: 850, islandDepth: 900 },
            appliances: ['Built-in Hob', 'Designer Chimney', 'Dishwasher'],
            estimatedCost: 550000,
            popularity: 80,
            status: 'Active',
            companyId: mainCompany.id
        }
    ];

    for (const kl of kitchenLayouts) {
        await prisma.kitchenLayout.upsert({
            where: { code_companyId: { code: kl.code, companyId: mainCompany.id } },
            update: kl,
            create: kl
        });
    }

    // Installation Types
    const installationTypes = [
        {
            code: 'INST-MOD',
            name: 'Standard Modular Installation',
            category: 'Modular',
            complexity: 'Moderate',
            requirements: { laborHours: 48, skillLevel: 'Skilled', teamSize: 2 },
            prerequisites: ['Civil work completion', 'Electrical points ready'],
            steps: ['Base cabinet leveling', 'Wall cabinet mounting', 'Shutter alignment', 'Hardware fixing'],
            materials: ['Fasteners', 'Leveling legs', 'Sealants'],
            costMin: 15000,
            costMax: 25000,
            durationValue: 3,
            durationUnit: 'Days',
            warranty: '1 Year Installation Warranty',
            status: 'Active',
            companyId: mainCompany.id
        }
    ];

    for (const it of installationTypes) {
        await prisma.installationType.upsert({
            where: { code_companyId: { code: it.code, companyId: mainCompany.id } },
            update: it,
            create: it
        });
    }

    // Kitchen Appliances
    const kitchenAppliances = [
        {
            code: 'APP-HOB-4B',
            name: '4-Burner Glass Top Hob',
            category: 'Hob',
            subcategory: 'Built-in',
            brand: 'Elica',
            model: 'EGL 644',
            specifications: { burners: 4, ignition: 'Auto', dimensions: '600x520 mm' },
            energyRating: '4 Star',
            color: ['Black Glass'],
            warranty: '2 Years',
            price: 18500,
            installationRequired: true,
            installationCost: 1500,
            status: 'Active',
            companyId: mainCompany.id
        },
        {
            code: 'APP-CHM-90',
            name: '90cm Curved Glass Chimney',
            category: 'Chimney',
            subcategory: 'Wall-mounted',
            brand: 'Faber',
            model: 'Hood Primus Plus',
            specifications: { suction: '1200 m3/h', filterType: 'Baffle', width: '90cm' },
            energyRating: '5 Star',
            color: ['Steel/Black'],
            warranty: '1 Year Comprehensive',
            price: 24000,
            installationRequired: true,
            installationCost: 2000,
            status: 'Active',
            companyId: mainCompany.id
        }
    ];

    for (const app of kitchenAppliances) {
        await prisma.kitchenAppliance.upsert({
            where: { code_companyId: { code: app.code, companyId: mainCompany.id } },
            update: app,
            create: app
        });
    }

    // 21. System Masters
    console.log('Seeding System Masters...');

    // Roles and Permissions
    const adminRole = await prisma.role.upsert({
        where: { roleCode_companyId: { roleCode: 'ADMIN', companyId: mainCompany.id } },
        update: {},
        create: {
            roleCode: 'ADMIN',
            roleName: 'System Administrator',
            category: 'system',
            description: 'Full system access with all permissions',
            companyId: mainCompany.id,
        },
    });

    await prisma.permission.createMany({
        data: [
            { roleId: adminRole.id, module: 'All Modules', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
        ],
    }).catch(() => { });

    const hrMgrRole = await prisma.role.upsert({
        where: { roleCode_companyId: { roleCode: 'HR-MGR', companyId: mainCompany.id } },
        update: {},
        create: {
            roleCode: 'HR-MGR',
            roleName: 'HR Manager',
            category: 'hr',
            description: 'Manages all HR operations',
            companyId: mainCompany.id,
        },
    });

    await prisma.permission.createMany({
        data: [
            { roleId: hrMgrRole.id, module: 'HR - All', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
            { roleId: hrMgrRole.id, module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
        ],
    }).catch(() => { });

    // Users
    const adminUser = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'hashed_password_here', // In real app, this should be hashed
            email: 'admin@optiforge.com',
            fullName: 'System Admin',
            roleId: adminRole.id,
            accessLevel: 'admin',
            companyId: mainCompany.id,
        },
    });

    // Document Types
    const documentTypes = [
        { typeCode: 'AADHAAR', typeName: 'Aadhaar Card', category: 'identity', description: 'Unique Identification Number', isMandatory: true, isVerificationRequired: true },
        { typeCode: 'PAN', typeName: 'PAN Card', category: 'financial', description: 'Tax Registration Number', isMandatory: true, isVerificationRequired: true },
    ];

    for (const dt of documentTypes) {
        await prisma.documentType.upsert({
            where: { typeCode_companyId: { typeCode: dt.typeCode, companyId: mainCompany.id } },
            update: dt,
            create: { ...dt, companyId: mainCompany.id }
        });
    }

    // Number Series
    const numberSeries = [
        {
            seriesCode: 'SO-2025',
            seriesName: 'Sales Order 2025',
            documentType: 'Sales Order',
            module: 'sales',
            prefix: 'SO',
            separator: '-',
            paddingLength: 5,
            includeYear: true,
            currentNumber: 1001,
            startingNumber: 1000,
            endingNumber: 99999,
            resetFrequency: 'yearly',
            defaultSeries: true,
            companyId: mainCompany.id
        },
        {
            seriesCode: 'EMP-SERIES',
            seriesName: 'Employee Series',
            documentType: 'Employee Master',
            module: 'hr',
            prefix: 'EMP',
            separator: '',
            paddingLength: 4,
            currentNumber: 101,
            startingNumber: 1,
            endingNumber: 9999,
            resetFrequency: 'never',
            defaultSeries: true,
            companyId: mainCompany.id
        }
    ];

    for (const ns of numberSeries) {
        await prisma.numberSeries.upsert({
            where: { seriesCode_companyId: { seriesCode: ns.seriesCode, companyId: mainCompany.id } },
            update: ns,
            create: { ...ns, companyId: mainCompany.id }
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
