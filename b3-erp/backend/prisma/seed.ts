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
        },
        {
            code: 'ITM-PLY-001',
            name: 'BWP Marine Plywood 18mm',
            itemType: 'RAW_MATERIAL',
            categoryId: categoryIds['Raw Materials'],
            groupId: groupIds['Steel Sheets'],
            uomId: pcsUom!.id,
            brandId: brandIds['OptiForge'],
            hsnSacId: hsnIds['HSN-7208'],
            purchasePrice: 2400.0,
            sellingPrice: 0,
            costPrice: 2400.0,
        },
        {
            code: 'ITM-HNG-001',
            name: 'Blum Soft-Close Hinge',
            itemType: 'RAW_MATERIAL',
            categoryId: categoryIds['Mechanical'],
            groupId: groupIds['Assembly Parts'],
            uomId: pcsUom!.id,
            brandId: brandIds['OptiForge'],
            hsnSacId: hsnIds['HSN-8542'],
            purchasePrice: 180.0,
            sellingPrice: 250.0,
            costPrice: 180.0,
        },
        {
            code: 'ITM-DRW-001',
            name: 'Tandembox Drawer System 500mm',
            itemType: 'RAW_MATERIAL',
            categoryId: categoryIds['Mechanical'],
            groupId: groupIds['Assembly Parts'],
            uomId: pcsUom!.id,
            brandId: brandIds['OptiForge'],
            hsnSacId: hsnIds['HSN-8542'],
            purchasePrice: 2800.0,
            sellingPrice: 3500.0,
            costPrice: 2800.0,
        },
        {
            code: 'ITM-LAM-001',
            name: 'High Gloss Laminate Sheet 8x4',
            itemType: 'RAW_MATERIAL',
            categoryId: categoryIds['Raw Materials'],
            groupId: groupIds['Steel Sheets'],
            uomId: pcsUom!.id,
            brandId: brandIds['OptiForge'],
            hsnSacId: hsnIds['HSN-7208'],
            purchasePrice: 1800.0,
            sellingPrice: 0,
            costPrice: 1800.0,
        },
        {
            code: 'ITM-CAB-001',
            name: 'Base Cabinet 600mm Complete',
            itemType: 'FINISHED_GOODS',
            categoryId: categoryIds['Finished Goods'],
            groupId: groupIds['Assembly Parts'],
            uomId: pcsUom!.id,
            brandId: brandIds['OptiForge'],
            hsnSacId: hsnIds['HSN-8542'],
            purchasePrice: 0,
            sellingPrice: 8500.0,
            costPrice: 5200.0,
        },
        {
            code: 'ITM-CAB-002',
            name: 'Wall Cabinet 900mm Double Door',
            itemType: 'FINISHED_GOODS',
            categoryId: categoryIds['Finished Goods'],
            groupId: groupIds['Assembly Parts'],
            uomId: pcsUom!.id,
            brandId: brandIds['OptiForge'],
            hsnSacId: hsnIds['HSN-8542'],
            purchasePrice: 0,
            sellingPrice: 9500.0,
            costPrice: 5800.0,
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
        },
        {
            customerCode: 'CUST002',
            customerName: 'GlobalTech Industries',
            customerType: 'business',
            status: 'active',
            categoryId: custCatIds['Premium'],
            contactPerson: 'Sarah Williams',
            email: 'sarah.w@globaltech.com',
            phone: '+1-555-234-5678',
            address: { line1: '456 Tech Park', city: 'San Francisco', state: 'CA', country: 'USA', postalCode: '94102' },
            taxInfo: { taxId: '45-6789012', vatNumber: 'US456789012', taxClassification: 'Business' },
            creditInfo: { creditLimit: 75000, paymentTerms: 'Net 45', creditRating: 'excellent' },
            pricing: { priceList: 'Enterprise', discountPercentage: 20, currency: 'USD' },
            salesInfo: { salesRep: 'Bob Chen', territory: 'West', totalSales: 420000, averageOrderValue: 8500 }
        },
        {
            customerCode: 'CUST003',
            customerName: 'Metro Kitchen Solutions',
            customerType: 'business',
            status: 'active',
            categoryId: custCatIds['Standard'],
            contactPerson: 'Rajesh Kumar',
            email: 'rajesh@metrokitchen.in',
            phone: '+91-9876543210',
            address: { line1: 'Plot 12, MIDC', city: 'Mumbai', state: 'Maharashtra', country: 'India', postalCode: '400093' },
            taxInfo: { taxId: 'GSTIN12345', vatNumber: 'IN123456789', taxClassification: 'Business' },
            creditInfo: { creditLimit: 2500000, paymentTerms: 'Net 30', creditRating: 'good' },
            pricing: { priceList: 'Standard', discountPercentage: 10, currency: 'INR' },
            salesInfo: { salesRep: 'Priya Sharma', territory: 'West', totalSales: 5200000, averageOrderValue: 125000 }
        },
        {
            customerCode: 'CUST004',
            customerName: 'Dubai Interiors LLC',
            customerType: 'business',
            status: 'active',
            categoryId: custCatIds['Premium'],
            contactPerson: 'Ahmed Hassan',
            email: 'ahmed@dubaiinteriors.ae',
            phone: '+971-50-1234567',
            address: { line1: 'Business Bay Tower', city: 'Dubai', state: 'Dubai', country: 'UAE', postalCode: '00000' },
            taxInfo: { taxId: 'TRN100123456', vatNumber: 'AE100123456', taxClassification: 'Business' },
            creditInfo: { creditLimit: 200000, paymentTerms: 'Net 60', creditRating: 'excellent' },
            pricing: { priceList: 'Premium', discountPercentage: 15, currency: 'AED' },
            salesInfo: { salesRep: 'Fatima Ali', territory: 'Middle East', totalSales: 850000, averageOrderValue: 35000 }
        },
        {
            customerCode: 'CUST005',
            customerName: 'Home Decor Bangalore',
            customerType: 'business',
            status: 'active',
            categoryId: custCatIds['Standard'],
            contactPerson: 'Venkat Rao',
            email: 'venkat@homedecorblr.com',
            phone: '+91-9845123456',
            address: { line1: '45 Commercial Street', city: 'Bangalore', state: 'Karnataka', country: 'India', postalCode: '560001' },
            taxInfo: { taxId: 'GSTIN67890', vatNumber: 'IN678901234', taxClassification: 'Business' },
            creditInfo: { creditLimit: 1500000, paymentTerms: 'Net 30', creditRating: 'good' },
            pricing: { priceList: 'Standard', discountPercentage: 8, currency: 'INR' },
            salesInfo: { salesRep: 'Amit Verma', territory: 'South', totalSales: 3800000, averageOrderValue: 95000 }
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
        },
        {
            vendorCode: 'VEND002',
            vendorName: 'Blum India Pvt Ltd',
            vendorType: 'supplier',
            status: 'active',
            categoryId: vendCatIds['Hardware'],
            contactPerson: 'Suresh Menon',
            email: 'suresh.menon@blum.in',
            phone: '+91-22-12345678',
            address: { line1: 'Andheri Industrial Estate', city: 'Mumbai', state: 'Maharashtra', country: 'India', postalCode: '400059' },
            taxInfo: { taxId: 'GSTIN11111', vatNumber: 'IN111111111', taxClassification: 'Corporation' },
            paymentInfo: { paymentTerms: 'Net 45', preferredPaymentMethod: 'NEFT' },
            qualifications: { certifications: ['ISO 9001', 'ISO 14001'], licenses: ['Authorized Distributor'], qualityRating: 'excellent' },
            supplierInfo: { leadTime: 7, minimumOrderValue: 25000, currency: 'INR' },
            performance: { onTimeDelivery: 98, qualityScore: 4.9, totalOrders: 245, totalValue: 12500000 }
        },
        {
            vendorCode: 'VEND003',
            vendorName: 'Century Plyboards Ltd',
            vendorType: 'supplier',
            status: 'active',
            categoryId: vendCatIds['Wood Materials'],
            contactPerson: 'Ramesh Agarwal',
            email: 'ramesh@centuryply.com',
            phone: '+91-33-22334455',
            address: { line1: 'Century House, Park Street', city: 'Kolkata', state: 'West Bengal', country: 'India', postalCode: '700016' },
            taxInfo: { taxId: 'GSTIN22222', vatNumber: 'IN222222222', taxClassification: 'Corporation' },
            paymentInfo: { paymentTerms: 'Net 30', preferredPaymentMethod: 'RTGS' },
            qualifications: { certifications: ['IS 710', 'IS 303', 'CARB'], licenses: ['BIS Certified'], qualityRating: 'excellent' },
            supplierInfo: { leadTime: 3, minimumOrderValue: 50000, currency: 'INR' },
            performance: { onTimeDelivery: 92, qualityScore: 4.7, totalOrders: 189, totalValue: 28000000 }
        },
        {
            vendorCode: 'VEND004',
            vendorName: 'Hettich India Pvt Ltd',
            vendorType: 'supplier',
            status: 'active',
            categoryId: vendCatIds['Hardware'],
            contactPerson: 'Vinod Sharma',
            email: 'vinod.sharma@hettich.in',
            phone: '+91-11-45678901',
            address: { line1: 'DLF Cyber City', city: 'Gurgaon', state: 'Haryana', country: 'India', postalCode: '122002' },
            taxInfo: { taxId: 'GSTIN33333', vatNumber: 'IN333333333', taxClassification: 'Corporation' },
            paymentInfo: { paymentTerms: 'Net 30', preferredPaymentMethod: 'NEFT' },
            qualifications: { certifications: ['ISO 9001', 'TUV'], licenses: ['Authorized Importer'], qualityRating: 'excellent' },
            supplierInfo: { leadTime: 10, minimumOrderValue: 20000, currency: 'INR' },
            performance: { onTimeDelivery: 94, qualityScore: 4.8, totalOrders: 312, totalValue: 18500000 }
        },
        {
            vendorCode: 'VEND005',
            vendorName: 'Elica PB India Pvt Ltd',
            vendorType: 'supplier',
            status: 'active',
            categoryId: vendCatIds['Appliances'],
            contactPerson: 'Deepak Patel',
            email: 'deepak.patel@elica.in',
            phone: '+91-79-23456789',
            address: { line1: 'GIDC Industrial Area', city: 'Ahmedabad', state: 'Gujarat', country: 'India', postalCode: '382445' },
            taxInfo: { taxId: 'GSTIN44444', vatNumber: 'IN444444444', taxClassification: 'Corporation' },
            paymentInfo: { paymentTerms: 'Net 45', preferredPaymentMethod: 'RTGS' },
            qualifications: { certifications: ['ISO 9001', 'BIS'], licenses: ['Manufacturer'], qualityRating: 'good' },
            supplierInfo: { leadTime: 14, minimumOrderValue: 100000, currency: 'INR' },
            performance: { onTimeDelivery: 88, qualityScore: 4.5, totalOrders: 156, totalValue: 22000000 }
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

    // 22. CRM Masters
    console.log('Seeding CRM Masters...');

    // Lead Sources
    const leadSources = [
        { code: 'LS-WEB', name: 'Website', description: 'Leads from company website', channel: 'Digital', isActive: true },
        { code: 'LS-REF', name: 'Referral', description: 'Customer referrals', channel: 'Direct', isActive: true },
        { code: 'LS-TRADE', name: 'Trade Show', description: 'Trade show and exhibition leads', channel: 'Events', isActive: true },
        { code: 'LS-SM', name: 'Social Media', description: 'Leads from social media campaigns', channel: 'Digital', isActive: true },
        { code: 'LS-COLD', name: 'Cold Call', description: 'Outbound sales calls', channel: 'Direct', isActive: true },
    ];

    for (const ls of leadSources) {
        await prisma.crmLeadSource.upsert({
            where: { code_companyId: { code: ls.code, companyId: mainCompany.id } },
            update: ls,
            create: { ...ls, companyId: mainCompany.id }
        });
    }

    // Lead Statuses
    const leadStatuses = [
        { code: 'NEW', name: 'New', description: 'Newly created lead', sortOrder: 1, color: '#3B82F6', isActive: true, isDefault: true },
        { code: 'CONTACTED', name: 'Contacted', description: 'Initial contact made', sortOrder: 2, color: '#8B5CF6', isActive: true },
        { code: 'QUALIFIED', name: 'Qualified', description: 'Lead qualified for opportunity', sortOrder: 3, color: '#10B981', isActive: true },
        { code: 'UNQUALIFIED', name: 'Unqualified', description: 'Lead does not meet criteria', sortOrder: 4, color: '#6B7280', isActive: true },
        { code: 'CONVERTED', name: 'Converted', description: 'Converted to opportunity', sortOrder: 5, color: '#059669', isActive: true, isClosed: true },
        { code: 'LOST', name: 'Lost', description: 'Lead lost to competitor or declined', sortOrder: 6, color: '#EF4444', isActive: true, isClosed: true },
    ];

    for (const status of leadStatuses) {
        await prisma.crmLeadStatus.upsert({
            where: { code_companyId: { code: status.code, companyId: mainCompany.id } },
            update: status,
            create: { ...status, companyId: mainCompany.id }
        });
    }

    // Pipeline Stages
    const pipelineStages = [
        { code: 'PROSPECT', name: 'Prospecting', description: 'Initial prospecting stage', sortOrder: 1, probability: 10, color: '#3B82F6', isActive: true },
        { code: 'QUALIFY', name: 'Qualification', description: 'Qualifying the opportunity', sortOrder: 2, probability: 25, color: '#8B5CF6', isActive: true },
        { code: 'PROPOSAL', name: 'Proposal', description: 'Proposal sent to customer', sortOrder: 3, probability: 50, color: '#F59E0B', isActive: true },
        { code: 'NEGOTIATE', name: 'Negotiation', description: 'Price and terms negotiation', sortOrder: 4, probability: 75, color: '#10B981', isActive: true },
        { code: 'WON', name: 'Closed Won', description: 'Deal won', sortOrder: 5, probability: 100, color: '#059669', isActive: true, isClosed: true, isWon: true },
        { code: 'LOST', name: 'Closed Lost', description: 'Deal lost', sortOrder: 6, probability: 0, color: '#EF4444', isActive: true, isClosed: true },
    ];

    for (const stage of pipelineStages) {
        await prisma.crmPipelineStage.upsert({
            where: { code_companyId: { code: stage.code, companyId: mainCompany.id } },
            update: stage,
            create: { ...stage, companyId: mainCompany.id }
        });
    }

    // CRM Sales Territories
    const crmTerritories = [
        { code: 'TER-WEST', name: 'Western Region', description: 'Maharashtra, Gujarat, Goa', region: 'West', manager: 'Rahul Sharma', targetRevenue: 50000000, isActive: true },
        { code: 'TER-SOUTH', name: 'Southern Region', description: 'Karnataka, Tamil Nadu, Kerala, AP, Telangana', region: 'South', manager: 'Priya Patel', targetRevenue: 45000000, isActive: true },
        { code: 'TER-NORTH', name: 'Northern Region', description: 'Delhi NCR, Punjab, Haryana, UP', region: 'North', manager: 'Amit Kumar', targetRevenue: 40000000, isActive: true },
        { code: 'TER-EAST', name: 'Eastern Region', description: 'West Bengal, Odisha, Bihar, Jharkhand', region: 'East', manager: 'Sneha Das', targetRevenue: 25000000, isActive: true },
    ];

    for (const territory of crmTerritories) {
        await prisma.crmSalesTerritory.upsert({
            where: { code_companyId: { code: territory.code, companyId: mainCompany.id } },
            update: territory,
            create: { ...territory, companyId: mainCompany.id }
        });
    }

    // CRM Contacts
    const customer1 = await prisma.customer.findFirst({ where: { customerCode: 'CUST001', companyId: mainCompany.id } });
    const customer2 = await prisma.customer.findFirst({ where: { customerCode: 'CUST003', companyId: mainCompany.id } });

    const crmContacts = [
        {
            firstName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah.williams@premierkitchen.com',
            phone: '+1 234-567-1001',
            mobile: '+1 234-567-1002',
            position: 'Head of Procurement',
            department: 'Executive',
            contactType: 'primary',
            status: 'active',
            customerId: customer1?.id,
            linkedIn: 'https://linkedin.com/in/sarahwilliams',
            notes: 'Key decision maker for kitchen projects',
            companyId: mainCompany.id
        },
        {
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'm.chen@urbankitchen.com',
            phone: '+1 234-567-2001',
            position: 'Operations Manager',
            department: 'Operations',
            contactType: 'primary',
            status: 'active',
            notes: 'Influencer in purchasing decisions',
            companyId: mainCompany.id
        },
        {
            firstName: 'Rajesh',
            lastName: 'Kumar',
            email: 'rajesh.kumar@metrokitchen.in',
            phone: '+91-9876543210',
            mobile: '+91-9876543211',
            position: 'Managing Director',
            department: 'Executive',
            contactType: 'primary',
            status: 'active',
            customerId: customer2?.id,
            notes: 'Primary contact for Metro Kitchen Solutions',
            companyId: mainCompany.id
        },
        {
            firstName: 'Priya',
            lastName: 'Sharma',
            email: 'priya.sharma@metrokitchen.in',
            phone: '+91-9876543220',
            position: 'Finance Manager',
            department: 'Finance',
            contactType: 'billing',
            status: 'active',
            customerId: customer2?.id,
            notes: 'Handles all billing and payment queries',
            companyId: mainCompany.id
        },
        {
            firstName: 'Ahmed',
            lastName: 'Hassan',
            email: 'ahmed@dubaiinteriors.ae',
            phone: '+971-50-1234567',
            position: 'CEO',
            department: 'Executive',
            contactType: 'primary',
            status: 'active',
            notes: 'VIP customer - Dubai market',
            companyId: mainCompany.id
        },
    ];

    const contactIds: Record<string, string> = {};
    for (let i = 0; i < crmContacts.length; i++) {
        const contact = await prisma.crmContact.upsert({
            where: { email_companyId: { email: crmContacts[i].email!, companyId: mainCompany.id } },
            update: crmContacts[i],
            create: crmContacts[i]
        });
        contactIds[`contact${i + 1}`] = contact.id;
    }

    // CRM Opportunities
    const currentYear = new Date().getFullYear();
    const crmOpportunities = [
        {
            opportunityNumber: `OPP-${currentYear}-00001`,
            name: 'Premium Kitchen Installation - Luxury Apartments',
            description: 'Full modular kitchen installation for 50 luxury apartment units',
            stage: 'proposal',
            probability: 70,
            amount: 3500000,
            expectedCloseDate: new Date(`${currentYear}-03-15`),
            source: 'Website',
            owner: 'Sarah Johnson',
            nextStep: 'Send revised proposal with updated pricing',
            contactId: contactIds['contact1'],
            customerId: customer1?.id,
            companyId: mainCompany.id
        },
        {
            opportunityNumber: `OPP-${currentYear}-00002`,
            name: 'Commercial Kitchen Equipment - Restaurant Chain',
            description: 'Kitchen equipment supply for new restaurant locations',
            stage: 'negotiation',
            probability: 85,
            amount: 5800000,
            expectedCloseDate: new Date(`${currentYear}-02-28`),
            source: 'Referral',
            owner: 'Michael Chen',
            nextStep: 'Final contract review with legal team',
            contactId: contactIds['contact2'],
            companyId: mainCompany.id
        },
        {
            opportunityNumber: `OPP-${currentYear}-00003`,
            name: 'Modular Kitchen Solutions - Corporate Office',
            description: 'Pantry and cafeteria kitchen setup for tech company',
            stage: 'qualification',
            probability: 50,
            amount: 1250000,
            expectedCloseDate: new Date(`${currentYear}-04-20`),
            source: 'Trade Show',
            owner: 'Sarah Johnson',
            nextStep: 'Schedule site visit for measurements',
            contactId: contactIds['contact3'],
            customerId: customer2?.id,
            companyId: mainCompany.id
        },
        {
            opportunityNumber: `OPP-${currentYear}-00004`,
            name: 'Dubai Luxury Villa Kitchens',
            description: 'High-end custom kitchen installations for 10 villas',
            stage: 'prospecting',
            probability: 30,
            amount: 8500000,
            expectedCloseDate: new Date(`${currentYear}-06-30`),
            source: 'Social Media',
            owner: 'Ahmed Ali',
            nextStep: 'Initial discovery call scheduled',
            contactId: contactIds['contact5'],
            companyId: mainCompany.id
        },
        {
            opportunityNumber: `OPP-${currentYear}-00005`,
            name: 'Hotel Chain Kitchen Renovation',
            description: 'Complete kitchen renovation for 5 hotel properties',
            stage: 'closed_won',
            probability: 100,
            amount: 12500000,
            expectedCloseDate: new Date(`${currentYear}-01-15`),
            source: 'Referral',
            owner: 'Priya Sharma',
            winReason: 'Competitive pricing and superior design quality',
            companyId: mainCompany.id
        },
    ];

    const opportunityIds: Record<string, string> = {};
    for (let i = 0; i < crmOpportunities.length; i++) {
        const opp = await prisma.crmOpportunity.upsert({
            where: { opportunityNumber_companyId: { opportunityNumber: crmOpportunities[i].opportunityNumber, companyId: mainCompany.id } },
            update: crmOpportunities[i],
            create: crmOpportunities[i]
        });
        opportunityIds[`opp${i + 1}`] = opp.id;
    }

    // CRM Activities
    const crmActivities = [
        {
            type: 'call',
            subject: 'Discovery Call - Premium Kitchen Project',
            description: 'Initial call to understand requirements for luxury apartment project',
            status: 'completed',
            priority: 'high',
            dueDate: new Date(`${currentYear}-01-10`),
            completedDate: new Date(`${currentYear}-01-10`),
            outcome: 'Customer interested, requested proposal',
            contactId: contactIds['contact1'],
            opportunityId: opportunityIds['opp1'],
            assignedTo: 'Sarah Johnson',
            companyId: mainCompany.id
        },
        {
            type: 'meeting',
            subject: 'Site Visit - Metro Kitchen Office',
            description: 'On-site measurements and design consultation',
            status: 'scheduled',
            priority: 'medium',
            dueDate: new Date(`${currentYear}-02-15`),
            location: 'Metro Kitchen Solutions Office, Mumbai',
            contactId: contactIds['contact3'],
            opportunityId: opportunityIds['opp3'],
            assignedTo: 'Rahul Sharma',
            companyId: mainCompany.id
        },
        {
            type: 'email',
            subject: 'Follow-up on Proposal - Restaurant Chain',
            description: 'Sent detailed proposal with itemized pricing',
            status: 'completed',
            priority: 'high',
            dueDate: new Date(`${currentYear}-01-20`),
            completedDate: new Date(`${currentYear}-01-20`),
            outcome: 'Customer reviewing with finance team',
            contactId: contactIds['contact2'],
            opportunityId: opportunityIds['opp2'],
            assignedTo: 'Michael Chen',
            companyId: mainCompany.id
        },
        {
            type: 'task',
            subject: 'Prepare Custom Design Proposal',
            description: 'Create 3D renderings for Dubai villa project',
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date(`${currentYear}-02-25`),
            contactId: contactIds['contact5'],
            opportunityId: opportunityIds['opp4'],
            assignedTo: 'Design Team',
            companyId: mainCompany.id
        },
        {
            type: 'note',
            subject: 'Customer Preferences Noted',
            description: 'Customer prefers modern minimalist design with handleless cabinets. Budget flexible for premium finishes.',
            status: 'completed',
            priority: 'low',
            dueDate: new Date(`${currentYear}-01-15`),
            completedDate: new Date(`${currentYear}-01-15`),
            contactId: contactIds['contact1'],
            assignedTo: 'Sarah Johnson',
            companyId: mainCompany.id
        },
    ];

    for (const activity of crmActivities) {
        await prisma.crmActivity.create({
            data: activity
        });
    }

    // CRM Campaigns
    const crmCampaigns = [
        {
            campaignNumber: `CMP-${currentYear}-00001`,
            name: 'Kitchen Design Masterclass 2025',
            type: 'Event',
            status: 'Active',
            description: 'Virtual masterclass showcasing latest kitchen design trends',
            startDate: new Date(`${currentYear}-02-01`),
            endDate: new Date(`${currentYear}-02-28`),
            budget: 500000,
            expectedRevenue: 5000000,
            targetAudience: 'Architects, Interior Designers, Home Owners',
            channel: 'Digital',
            owner: 'Marketing Team',
            companyId: mainCompany.id
        },
        {
            campaignNumber: `CMP-${currentYear}-00002`,
            name: 'Trade Show - Kitchen Expo 2025',
            type: 'Trade Show',
            status: 'Planned',
            description: 'Participation in annual Kitchen & Bath Industry Expo',
            startDate: new Date(`${currentYear}-04-15`),
            endDate: new Date(`${currentYear}-04-18`),
            budget: 1500000,
            expectedRevenue: 15000000,
            targetAudience: 'B2B Customers, Dealers, Distributors',
            channel: 'Events',
            owner: 'Sales Team',
            companyId: mainCompany.id
        },
        {
            campaignNumber: `CMP-${currentYear}-00003`,
            name: 'Modular Kitchen Upgrade Offer',
            type: 'Promotion',
            status: 'Active',
            description: '20% off on kitchen upgrades for existing customers',
            startDate: new Date(`${currentYear}-01-01`),
            endDate: new Date(`${currentYear}-03-31`),
            budget: 200000,
            actualCost: 85000,
            expectedRevenue: 3000000,
            actualRevenue: 1200000,
            targetAudience: 'Existing Customers',
            channel: 'Email',
            owner: 'CRM Team',
            companyId: mainCompany.id
        },
    ];

    const campaignIds: Record<string, string> = {};
    for (let i = 0; i < crmCampaigns.length; i++) {
        const campaign = await prisma.crmCampaign.upsert({
            where: { campaignNumber_companyId: { campaignNumber: crmCampaigns[i].campaignNumber, companyId: mainCompany.id } },
            update: crmCampaigns[i],
            create: crmCampaigns[i]
        });
        campaignIds[`campaign${i + 1}`] = campaign.id;
    }

    // CRM Quotes
    const crmQuotes = [
        {
            quoteNumber: `QT-${currentYear}-00001`,
            name: 'Quote - Luxury Apartment Kitchens',
            status: 'sent',
            validUntil: new Date(`${currentYear}-03-01`),
            subtotal: 3200000,
            discount: 320000,
            tax: 518400,
            total: 3398400,
            terms: 'Net 30 days from invoice date',
            notes: 'Includes installation and 2-year warranty',
            opportunityId: opportunityIds['opp1'],
            contactId: contactIds['contact1'],
            customerId: customer1?.id,
            companyId: mainCompany.id
        },
        {
            quoteNumber: `QT-${currentYear}-00002`,
            name: 'Quote - Restaurant Chain Equipment',
            status: 'negotiating',
            validUntil: new Date(`${currentYear}-02-15`),
            subtotal: 5500000,
            discount: 550000,
            tax: 891000,
            total: 5841000,
            terms: 'Payment milestones: 30% advance, 40% on delivery, 30% post-installation',
            notes: 'Bulk discount applied for 15+ locations',
            opportunityId: opportunityIds['opp2'],
            contactId: contactIds['contact2'],
            companyId: mainCompany.id
        },
        {
            quoteNumber: `QT-${currentYear}-00003`,
            name: 'Quote - Corporate Office Pantry',
            status: 'draft',
            validUntil: new Date(`${currentYear}-04-30`),
            subtotal: 1100000,
            discount: 0,
            tax: 198000,
            total: 1298000,
            notes: 'Preliminary quote pending site visit',
            opportunityId: opportunityIds['opp3'],
            contactId: contactIds['contact3'],
            customerId: customer2?.id,
            companyId: mainCompany.id
        },
    ];

    const quoteIds: Record<string, string> = {};
    for (let i = 0; i < crmQuotes.length; i++) {
        const quote = await prisma.crmQuote.upsert({
            where: { quoteNumber_companyId: { quoteNumber: crmQuotes[i].quoteNumber, companyId: mainCompany.id } },
            update: crmQuotes[i],
            create: crmQuotes[i]
        });
        quoteIds[`quote${i + 1}`] = quote.id;
    }

    // CRM Contracts
    const crmContracts = [
        {
            contractNumber: `CON-${currentYear}-00001`,
            name: 'Hotel Chain Kitchen Renovation Contract',
            type: 'service',
            status: 'active',
            startDate: new Date(`${currentYear}-01-15`),
            endDate: new Date(`${currentYear + 1}-01-14`),
            value: 12500000,
            terms: 'Comprehensive service and maintenance contract for 12 months',
            renewalType: 'auto',
            paymentTerms: 'Monthly invoicing - Net 15',
            opportunityId: opportunityIds['opp5'],
            customerId: customer1?.id,
            companyId: mainCompany.id
        },
        {
            contractNumber: `CON-${currentYear}-00002`,
            name: 'Annual Maintenance Contract - Metro Kitchen',
            type: 'maintenance',
            status: 'active',
            startDate: new Date(`${currentYear}-01-01`),
            endDate: new Date(`${currentYear}-12-31`),
            value: 240000,
            terms: 'Quarterly preventive maintenance and emergency support',
            renewalType: 'manual',
            paymentTerms: 'Quarterly advance payment',
            customerId: customer2?.id,
            companyId: mainCompany.id
        },
    ];

    for (const contract of crmContracts) {
        await prisma.crmContract.upsert({
            where: { contractNumber_companyId: { contractNumber: contract.contractNumber, companyId: mainCompany.id } },
            update: contract,
            create: contract
        });
    }

    // CRM SLAs
    const crmSlas = [
        {
            name: 'Premium Support SLA',
            description: 'SLA for premium/VIP customers',
            priority: 'critical',
            responseTime: 1,
            resolutionTime: 4,
            escalationTime: 2,
            businessHoursOnly: false,
            isActive: true,
            companyId: mainCompany.id
        },
        {
            name: 'Standard Support SLA',
            description: 'SLA for standard customers',
            priority: 'high',
            responseTime: 4,
            resolutionTime: 24,
            escalationTime: 8,
            businessHoursOnly: true,
            isActive: true,
            companyId: mainCompany.id
        },
        {
            name: 'Basic Support SLA',
            description: 'SLA for basic support tier',
            priority: 'medium',
            responseTime: 8,
            resolutionTime: 48,
            escalationTime: 24,
            businessHoursOnly: true,
            isActive: true,
            companyId: mainCompany.id
        },
    ];

    const slaIds: Record<string, string> = {};
    for (let i = 0; i < crmSlas.length; i++) {
        const sla = await prisma.crmSla.upsert({
            where: { name_companyId: { name: crmSlas[i].name, companyId: mainCompany.id } },
            update: crmSlas[i],
            create: crmSlas[i]
        });
        slaIds[`sla${i + 1}`] = sla.id;
    }

    // CRM Support Tickets
    const crmTickets = [
        {
            ticketNumber: `TKT-${currentYear}-00001`,
            subject: 'Soft-close hinge not working properly',
            description: 'Customer reports that one of the soft-close hinges on the base cabinet is not functioning correctly',
            type: 'complaint',
            status: 'in_progress',
            priority: 'high',
            category: 'Hardware Issue',
            contactId: contactIds['contact1'],
            customerId: customer1?.id,
            slaId: slaIds['sla1'],
            assignedTo: 'Support Team',
            companyId: mainCompany.id
        },
        {
            ticketNumber: `TKT-${currentYear}-00002`,
            subject: 'Request for additional drawer units',
            description: 'Customer wants to add 2 more drawer units to existing kitchen setup',
            type: 'request',
            status: 'open',
            priority: 'medium',
            category: 'Product Inquiry',
            contactId: contactIds['contact3'],
            customerId: customer2?.id,
            slaId: slaIds['sla2'],
            assignedTo: 'Sales Team',
            companyId: mainCompany.id
        },
        {
            ticketNumber: `TKT-${currentYear}-00003`,
            subject: 'Installation scheduling query',
            description: 'Customer inquiring about available installation dates for next month',
            type: 'inquiry',
            status: 'resolved',
            priority: 'low',
            category: 'Installation',
            resolution: 'Provided available dates and customer confirmed for Feb 15',
            resolvedAt: new Date(`${currentYear}-01-20`),
            contactId: contactIds['contact2'],
            slaId: slaIds['sla3'],
            assignedTo: 'Operations Team',
            companyId: mainCompany.id
        },
    ];

    for (const ticket of crmTickets) {
        await prisma.crmSupportTicket.upsert({
            where: { ticketNumber_companyId: { ticketNumber: ticket.ticketNumber, companyId: mainCompany.id } },
            update: ticket,
            create: ticket
        });
    }

    // CRM Knowledge Articles
    const crmArticles = [
        {
            title: 'How to Maintain Modular Kitchen Cabinets',
            slug: 'maintain-modular-kitchen-cabinets',
            content: 'Comprehensive guide on maintaining modular kitchen cabinets for longevity...',
            category: 'Maintenance',
            status: 'published',
            author: 'Support Team',
            viewCount: 1250,
            helpfulCount: 890,
            tags: ['maintenance', 'cabinets', 'cleaning', 'tips'],
            companyId: mainCompany.id
        },
        {
            title: 'Soft-Close Hinge Adjustment Guide',
            slug: 'soft-close-hinge-adjustment',
            content: 'Step-by-step guide to adjust soft-close hinges for optimal performance...',
            category: 'Troubleshooting',
            status: 'published',
            author: 'Technical Team',
            viewCount: 2100,
            helpfulCount: 1650,
            tags: ['hinges', 'adjustment', 'troubleshooting', 'hardware'],
            companyId: mainCompany.id
        },
        {
            title: 'Understanding Kitchen Layout Options',
            slug: 'kitchen-layout-options',
            content: 'Detailed comparison of L-shape, U-shape, Island, and Parallel kitchen layouts...',
            category: 'Product Guide',
            status: 'published',
            author: 'Design Team',
            viewCount: 3500,
            helpfulCount: 2800,
            tags: ['layout', 'design', 'planning', 'kitchen types'],
            companyId: mainCompany.id
        },
        {
            title: 'Warranty Terms and Conditions',
            slug: 'warranty-terms-conditions',
            content: 'Complete warranty information for modular kitchen products and services...',
            category: 'Policies',
            status: 'published',
            author: 'Legal Team',
            viewCount: 850,
            helpfulCount: 420,
            tags: ['warranty', 'terms', 'policy', 'coverage'],
            companyId: mainCompany.id
        },
    ];

    for (const article of crmArticles) {
        await prisma.crmKnowledgeArticle.upsert({
            where: { slug_companyId: { slug: article.slug, companyId: mainCompany.id } },
            update: article,
            create: article
        });
    }

    // CRM Interactions
    const crmInteractions = [
        {
            type: 'phone_call',
            direction: 'outbound',
            subject: 'Follow-up on quotation status',
            notes: 'Customer confirmed they are reviewing the proposal with their finance team',
            duration: 15,
            status: 'completed',
            outcome: 'positive',
            contactId: contactIds['contact1'],
            opportunityId: opportunityIds['opp1'],
            performedBy: 'Sarah Johnson',
            companyId: mainCompany.id
        },
        {
            type: 'email',
            direction: 'inbound',
            subject: 'RE: Quote Request - Restaurant Equipment',
            notes: 'Customer requested itemized breakdown of equipment costs',
            status: 'completed',
            outcome: 'neutral',
            contactId: contactIds['contact2'],
            opportunityId: opportunityIds['opp2'],
            performedBy: 'Michael Chen',
            companyId: mainCompany.id
        },
        {
            type: 'meeting',
            direction: 'outbound',
            subject: 'Design Consultation - Metro Kitchen',
            notes: 'Presented 3D designs, customer loved the modern minimalist approach',
            duration: 90,
            status: 'completed',
            outcome: 'positive',
            nextAction: 'Send revised quote with selected options',
            contactId: contactIds['contact3'],
            opportunityId: opportunityIds['opp3'],
            performedBy: 'Rahul Sharma',
            companyId: mainCompany.id
        },
        {
            type: 'chat',
            direction: 'inbound',
            subject: 'Website chat inquiry',
            notes: 'Prospect inquiring about custom kitchen solutions for new villa project',
            duration: 25,
            status: 'completed',
            outcome: 'positive',
            nextAction: 'Schedule discovery call',
            contactId: contactIds['contact5'],
            performedBy: 'Support Bot / Ahmed Ali',
            companyId: mainCompany.id
        },
    ];

    for (const interaction of crmInteractions) {
        await prisma.crmInteraction.create({
            data: interaction
        });
    }

    console.log('CRM Masters seeded successfully!');

    // 23. Sales Masters
    console.log('Seeding Sales Masters...');

    // Sales Invoices
    const salesInvoices = [
        {
            invoiceNumber: 'INV-2025-00001',
            invoiceType: 'sales',
            customerId: customer1?.id,
            customerName: 'Premier Kitchen Designs Ltd',
            customerEmail: 'accounts@premierkitchen.com',
            customerAddress: '123 Industrial Park, Mumbai 400001',
            invoiceDate: new Date('2025-01-15'),
            dueDate: new Date('2025-02-14'),
            paymentTerms: 'NET_30',
            currency: 'INR',
            subtotal: 450000,
            totalDiscount: 22500,
            totalTax: 76950,
            shippingAmount: 5000,
            totalAmount: 509450,
            amountPaid: 509450,
            amountDue: 0,
            status: 'paid',
            notes: 'Thank you for your business!',
            poNumber: 'PO-PKD-2025-001',
            submittedAt: new Date('2025-01-15'),
            submittedBy: 'user1',
            approvedAt: new Date('2025-01-16'),
            approvedBy: 'manager1',
            postedAt: new Date('2025-01-16'),
            postedBy: 'accountant1',
            paidAt: new Date('2025-02-10'),
            companyId: mainCompany.id
        },
        {
            invoiceNumber: 'INV-2025-00002',
            invoiceType: 'sales',
            customerId: customer2?.id,
            customerName: 'Urban Kitchen Solutions',
            customerEmail: 'billing@urbankitchen.com',
            customerAddress: '456 Commercial Complex, Bangalore 560001',
            invoiceDate: new Date('2025-01-20'),
            dueDate: new Date('2025-02-19'),
            paymentTerms: 'NET_30',
            currency: 'INR',
            subtotal: 280000,
            totalDiscount: 14000,
            totalTax: 47880,
            shippingAmount: 3500,
            totalAmount: 317380,
            amountPaid: 100000,
            amountDue: 217380,
            status: 'partially_paid',
            notes: 'First payment received',
            poNumber: 'PO-UKS-2025-012',
            submittedAt: new Date('2025-01-20'),
            approvedAt: new Date('2025-01-21'),
            postedAt: new Date('2025-01-21'),
            companyId: mainCompany.id
        },
        {
            invoiceNumber: 'INV-2025-00003',
            invoiceType: 'sales',
            customerName: 'Metro Manufacturing Inc',
            customerEmail: 'ap@metromfg.com',
            customerAddress: '789 Industrial Zone, Chennai 600001',
            invoiceDate: new Date('2025-01-25'),
            dueDate: new Date('2025-02-24'),
            paymentTerms: 'NET_30',
            currency: 'INR',
            subtotal: 185000,
            totalDiscount: 0,
            totalTax: 33300,
            shippingAmount: 2500,
            totalAmount: 220800,
            amountPaid: 0,
            amountDue: 220800,
            status: 'posted',
            notes: 'Awaiting payment',
            submittedAt: new Date('2025-01-25'),
            approvedAt: new Date('2025-01-25'),
            postedAt: new Date('2025-01-26'),
            companyId: mainCompany.id
        },
        {
            invoiceNumber: 'INV-2025-00004',
            invoiceType: 'sales',
            customerName: 'Precision Engineering Inc.',
            customerEmail: 'finance@precisioneng.com',
            invoiceDate: new Date('2025-01-28'),
            dueDate: new Date('2025-02-27'),
            paymentTerms: 'NET_30',
            currency: 'INR',
            subtotal: 125000,
            totalDiscount: 6250,
            totalTax: 21375,
            totalAmount: 140125,
            amountPaid: 0,
            amountDue: 140125,
            status: 'pending_approval',
            notes: 'Awaiting approval',
            submittedAt: new Date('2025-01-28'),
            companyId: mainCompany.id
        },
        {
            invoiceNumber: 'INV-2025-00005',
            invoiceType: 'sales',
            customerName: 'Summit Manufacturing',
            customerEmail: 'orders@summitmfg.com',
            invoiceDate: new Date('2025-01-30'),
            dueDate: new Date('2025-03-01'),
            paymentTerms: 'NET_30',
            currency: 'INR',
            subtotal: 95000,
            totalDiscount: 0,
            totalTax: 17100,
            totalAmount: 112100,
            amountPaid: 0,
            amountDue: 112100,
            status: 'draft',
            notes: 'Draft - pending line item verification',
            companyId: mainCompany.id
        }
    ];

    for (const invoice of salesInvoices) {
        await prisma.salesInvoice.upsert({
            where: { invoiceNumber_companyId: { invoiceNumber: invoice.invoiceNumber, companyId: mainCompany.id } },
            update: invoice,
            create: invoice
        });
    }

    // Delivery Notes
    const deliveryNotes = [
        {
            deliveryNoteNumber: 'DN-2025-00001',
            orderId: 'order1',
            orderNumber: 'SO-2025-0001',
            customerId: customer1?.id,
            customerName: 'Premier Kitchen Designs Ltd',
            deliveryAddress: '123 Industrial Park, Mumbai 400001',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            deliveryDate: new Date('2025-01-20'),
            status: 'acknowledged',
            totalItems: 3,
            totalDeliveredQty: 15,
            receivedBy: 'Rajesh Kumar',
            receivedDate: new Date('2025-01-20'),
            signatureUrl: '/signatures/dn-001.png',
            notes: 'All items received in good condition',
            companyId: mainCompany.id
        },
        {
            deliveryNoteNumber: 'DN-2025-00002',
            orderId: 'order2',
            orderNumber: 'SO-2025-0002',
            customerName: 'Urban Kitchen Solutions',
            deliveryAddress: '456 Commercial Complex, Bangalore 560001',
            city: 'Bangalore',
            state: 'Karnataka',
            postalCode: '560001',
            country: 'India',
            deliveryDate: new Date('2025-01-25'),
            status: 'issued',
            totalItems: 2,
            totalDeliveredQty: 8,
            notes: 'Handle with care - fragile equipment',
            companyId: mainCompany.id
        },
        {
            deliveryNoteNumber: 'DN-2025-00003',
            customerName: 'Metro Manufacturing Inc',
            deliveryAddress: '789 Industrial Zone, Chennai 600001',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600001',
            country: 'India',
            deliveryDate: new Date('2025-01-28'),
            status: 'draft',
            totalItems: 5,
            totalDeliveredQty: 20,
            companyId: mainCompany.id
        }
    ];

    for (const note of deliveryNotes) {
        await prisma.deliveryNote.upsert({
            where: { deliveryNoteNumber_companyId: { deliveryNoteNumber: note.deliveryNoteNumber, companyId: mainCompany.id } },
            update: note,
            create: note
        });
    }

    // Shipments
    const shipments = [
        {
            shipmentNumber: 'SHP-2025-00001',
            orderId: 'order1',
            orderNumber: 'SO-2025-0001',
            customerId: customer1?.id,
            customerName: 'Premier Kitchen Designs Ltd',
            deliveryAddress: '123 Industrial Park, Mumbai 400001',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            shipmentDate: new Date('2025-01-18'),
            expectedDeliveryDate: new Date('2025-01-20'),
            actualDeliveryDate: new Date('2025-01-20'),
            dispatchDate: new Date('2025-01-18'),
            status: 'delivered',
            priority: 'high',
            carrier: 'Blue Dart Express',
            vehicleNumber: 'MH-01-AB-1234',
            driverName: 'Rajesh Kumar',
            driverPhone: '+91 98765 43210',
            trackingNumber: 'BD2025011801',
            totalWeight: 450,
            totalVolume: 8.5,
            totalItems: 15,
            shippingCost: 15000,
            companyId: mainCompany.id
        },
        {
            shipmentNumber: 'SHP-2025-00002',
            customerName: 'Urban Kitchen Solutions',
            deliveryAddress: '456 Commercial Complex, Bangalore 560001',
            city: 'Bangalore',
            state: 'Karnataka',
            postalCode: '560001',
            country: 'India',
            shipmentDate: new Date('2025-01-23'),
            expectedDeliveryDate: new Date('2025-01-26'),
            dispatchDate: new Date('2025-01-23'),
            status: 'in_transit',
            priority: 'normal',
            carrier: 'Delhivery',
            trackingNumber: 'DEL2025012301',
            totalWeight: 280,
            totalItems: 8,
            shippingCost: 8500,
            companyId: mainCompany.id
        },
        {
            shipmentNumber: 'SHP-2025-00003',
            customerName: 'Metro Manufacturing Inc',
            deliveryAddress: '789 Industrial Zone, Chennai 600001',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600001',
            country: 'India',
            expectedDeliveryDate: new Date('2025-02-01'),
            status: 'pending',
            priority: 'normal',
            totalItems: 20,
            companyId: mainCompany.id
        }
    ];

    for (const shipment of shipments) {
        await prisma.shipment.upsert({
            where: { shipmentNumber_companyId: { shipmentNumber: shipment.shipmentNumber, companyId: mainCompany.id } },
            update: shipment,
            create: shipment
        });
    }

    // Sales Returns
    const salesReturns = [
        {
            returnNumber: 'RET-2025-00001',
            raNumber: 'RA-2025-00001',
            raExpiryDate: new Date('2025-02-15'),
            returnType: 'return',
            orderId: 'order1',
            orderNumber: 'SO-2025-0001',
            invoiceId: 'inv1',
            invoiceNumber: 'INV-2025-00001',
            customerId: customer1?.id,
            customerName: 'Premier Kitchen Designs Ltd',
            returnReason: 'Defective item',
            reasonCategory: 'quality',
            status: 'completed',
            subtotal: 25000,
            restockingFee: 1250,
            shippingRefund: 500,
            totalRefundAmount: 24250,
            refundMethod: 'credit_note',
            refundStatus: 'completed',
            approvedAt: new Date('2025-01-22'),
            approvedBy: 'manager1',
            receivedAt: new Date('2025-01-25'),
            receivedBy: 'warehouse1',
            completedAt: new Date('2025-01-26'),
            refundedAt: new Date('2025-01-26'),
            companyId: mainCompany.id
        },
        {
            returnNumber: 'RET-2025-00002',
            raNumber: 'RA-2025-00002',
            raExpiryDate: new Date('2025-02-20'),
            returnType: 'exchange',
            customerName: 'Urban Kitchen Solutions',
            returnReason: 'Wrong size ordered',
            reasonCategory: 'order_error',
            status: 'approved',
            subtotal: 15000,
            totalRefundAmount: 0,
            approvedAt: new Date('2025-01-28'),
            approvedBy: 'manager1',
            companyId: mainCompany.id
        },
        {
            returnNumber: 'RET-2025-00003',
            raNumber: 'RA-2025-00003',
            raExpiryDate: new Date('2025-02-28'),
            returnType: 'return',
            customerName: 'Metro Manufacturing Inc',
            returnReason: 'Item not as described',
            reasonCategory: 'quality',
            status: 'pending',
            subtotal: 35000,
            totalRefundAmount: 35000,
            companyId: mainCompany.id
        }
    ];

    for (const ret of salesReturns) {
        await prisma.salesReturn.upsert({
            where: { returnNumber_companyId: { returnNumber: ret.returnNumber, companyId: mainCompany.id } },
            update: ret,
            create: ret
        });
    }

    // Sales Pricing
    const salesPricing = [
        {
            pricingType: 'standard',
            itemId: 'item1',
            itemName: 'Commercial Range Hood',
            basePrice: 85000,
            discountType: 'percentage',
            discountValue: 5,
            finalPrice: 80750,
            validFrom: new Date('2025-01-01'),
            validTo: new Date('2025-12-31'),
            minQuantity: 1,
            maxQuantity: 100,
            priority: 1,
            isActive: true,
            companyId: mainCompany.id
        },
        {
            pricingType: 'customer',
            customerId: customer1?.id,
            customerName: 'Premier Kitchen Designs Ltd',
            itemId: 'item2',
            itemName: 'Industrial Refrigerator',
            basePrice: 150000,
            discountType: 'percentage',
            discountValue: 10,
            finalPrice: 135000,
            validFrom: new Date('2025-01-01'),
            validTo: new Date('2025-06-30'),
            priority: 2,
            isActive: true,
            companyId: mainCompany.id
        },
        {
            pricingType: 'volume',
            itemId: 'item3',
            itemName: 'Stainless Steel Prep Table',
            basePrice: 25000,
            discountType: 'fixed',
            discountValue: 2500,
            finalPrice: 22500,
            validFrom: new Date('2025-01-01'),
            minQuantity: 10,
            priority: 1,
            isActive: true,
            companyId: mainCompany.id
        }
    ];

    for (const pricing of salesPricing) {
        await prisma.salesPricing.create({ data: pricing });
    }

    // Sales Promotions
    const salesPromotions = [
        {
            promotionCode: 'NEWYEAR25',
            promotionName: 'New Year Sale 2025',
            promotionType: 'percentage',
            discountValue: 15,
            minPurchaseAmount: 100000,
            maxDiscountAmount: 50000,
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-01-31'),
            usageLimit: 100,
            usedCount: 45,
            applicableCategories: ['Kitchen Equipment', 'Commercial Appliances'],
            isActive: true,
            companyId: mainCompany.id
        },
        {
            promotionCode: 'BULK20',
            promotionName: 'Bulk Order Discount',
            promotionType: 'percentage',
            discountValue: 20,
            minPurchaseAmount: 500000,
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-12-31'),
            usageLimit: 50,
            usedCount: 12,
            isActive: true,
            companyId: mainCompany.id
        },
        {
            promotionCode: 'FREESHIP',
            promotionName: 'Free Shipping',
            promotionType: 'free_shipping',
            discountValue: 0,
            minPurchaseAmount: 50000,
            startDate: new Date('2025-02-01'),
            endDate: new Date('2025-02-28'),
            isActive: true,
            companyId: mainCompany.id
        }
    ];

    for (const promo of salesPromotions) {
        await prisma.salesPromotion.upsert({
            where: { promotionCode_companyId: { promotionCode: promo.promotionCode, companyId: mainCompany.id } },
            update: promo,
            create: promo
        });
    }

    // Sales Targets
    const salesTargets = [
        {
            targetType: 'individual',
            salesPersonId: 'user1',
            salesPersonName: 'Rahul Sharma',
            periodType: 'monthly',
            periodYear: 2025,
            periodMonth: 1,
            revenueTarget: 5000000,
            revenueActual: 4250000,
            revenueAchievement: 85,
            ordersTarget: 25,
            ordersActual: 22,
            ordersAchievement: 88,
            newCustomersTarget: 5,
            newCustomersActual: 4,
            newCustomersAchievement: 80,
            companyId: mainCompany.id
        },
        {
            targetType: 'team',
            teamId: 'sales-team-1',
            teamName: 'Enterprise Sales',
            periodType: 'quarterly',
            periodYear: 2025,
            periodQuarter: 1,
            revenueTarget: 25000000,
            revenueActual: 8500000,
            revenueAchievement: 34,
            ordersTarget: 100,
            ordersActual: 35,
            ordersAchievement: 35,
            companyId: mainCompany.id
        },
        {
            targetType: 'company',
            periodType: 'yearly',
            periodYear: 2025,
            revenueTarget: 100000000,
            revenueActual: 8500000,
            revenueAchievement: 8.5,
            ordersTarget: 500,
            ordersActual: 45,
            ordersAchievement: 9,
            newCustomersTarget: 100,
            newCustomersActual: 12,
            newCustomersAchievement: 12,
            companyId: mainCompany.id
        }
    ];

    for (const target of salesTargets) {
        await prisma.salesTarget.create({ data: target });
    }

    console.log('Sales Masters seeded successfully!');

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
