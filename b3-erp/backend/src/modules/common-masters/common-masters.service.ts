import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommonMastersService {
    constructor(private prisma: PrismaService) { }

    // --- Currencies ---
    async findAllCurrencies() {
        return this.prisma.currency.findMany({
            where: { isActive: true },
            orderBy: { code: 'asc' },
        });
    }

    // --- Departments ---
    async findAllDepartments(companyId: string) {
        return this.prisma.department.findMany({
            where: { companyId },
            include: { branch: true },
            orderBy: { name: 'asc' },
        });
    }

    async createDepartment(data: { name: string; companyId: string; branchId?: string }) {
        return this.prisma.department.create({ data });
    }

    // --- Designations ---
    async findAllDesignations(companyId: string) {
        return this.prisma.designation.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
        });
    }

    // --- Employee Masters ---
    async findAllEmployees(companyId: string) {
        return this.prisma.employee.findMany({
            where: { companyId, isActive: true },
            include: {
                designation: true,
                department: true,
                branch: true,
            },
            orderBy: { firstName: 'asc' },
        });
    }

    async findAllShifts(companyId: string) {
        return this.prisma.shift.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllHolidays(companyId: string) {
        return this.prisma.holiday.findMany({
            where: { companyId, isActive: true },
            orderBy: { date: 'asc' },
        });
    }

    // --- UOMs ---
    async findAllUoms(companyId: string) {
        return this.prisma.uom.findMany({
            where: { companyId },
            orderBy: { code: 'asc' },
        });
    }

    // --- Countries/States/Cities ---
    async findAllCountries() {
        return this.prisma.country.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });
    }

    async findStatesByCountry(countryId: string) {
        return this.prisma.state.findMany({
            where: { countryId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findCitiesByState(stateId: string) {
        return this.prisma.city.findMany({
            where: { stateId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllTerritories(companyId: string) {
        return this.prisma.territory.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    // --- Cost Centers ---
    async findAllCostCenters(companyId: string) {
        return this.prisma.costCenter.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
        });
    }

    // --- Plants ---
    async findAllPlants(companyId: string) {
        return this.prisma.plant.findMany({
            where: { companyId },
            include: { branch: true },
            orderBy: { name: 'asc' },
        });
    }

    // --- Warehouses ---
    async findAllWarehouses(companyId: string) {
        return this.prisma.warehouse.findMany({
            where: { companyId },
            include: { branch: true },
            orderBy: { name: 'asc' },
        });
    }

    // --- Exchange Rates ---
    async findAllExchangeRates(companyId: string) {
        return this.prisma.exchangeRate.findMany({
            where: { companyId },
            include: { fromCurrency: true, toCurrency: true },
            orderBy: { effectiveDate: 'desc' },
        });
    }

    // --- Product & Item Masters ---
    async findAllBrands(companyId: string) {
        return this.prisma.brand.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
        });
    }

    async findAllHsnSacs(companyId: string) {
        return this.prisma.hsnSac.findMany({
            where: { companyId },
            orderBy: { code: 'asc' },
        });
    }

    async findAllItemCategories(companyId: string) {
        return this.prisma.itemCategory.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
        });
    }

    async findAllItemGroups(companyId: string) {
        return this.prisma.itemGroup.findMany({
            where: { companyId },
            include: { category: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllItems(companyId: string) {
        return this.prisma.item.findMany({
            where: { companyId },
            include: {
                category: true,
                group: true,
                uom: true,
                brand: true,
                hsnSac: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    // --- Stakeholder Masters ---
    async findAllCustomerCategories(companyId: string) {
        return this.prisma.customerCategory.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
        });
    }

    async findAllCustomers(companyId: string) {
        return this.prisma.customer.findMany({
            where: { companyId },
            include: { category: true },
            orderBy: { customerName: 'asc' },
        });
    }

    async findAllVendorCategories(companyId: string) {
        return this.prisma.vendorCategory.findMany({
            where: { companyId },
            orderBy: { name: 'asc' },
        });
    }

    async findAllVendors(companyId: string) {
        return this.prisma.vendor.findMany({
            where: { companyId },
            include: { category: true },
            orderBy: { vendorName: 'asc' },
        });
    }

    // --- Financial Masters ---
    async findAllAccounts(companyId: string) {
        return this.prisma.account.findMany({
            where: { companyId },
            orderBy: { accountCode: 'asc' },
        });
    }

    async findAllBankAccounts(companyId: string) {
        return this.prisma.bankAccount.findMany({
            where: { companyId },
            orderBy: { bankName: 'asc' },
        });
    }

    async findAllTaxes(companyId: string) {
        return this.prisma.tax.findMany({
            where: { companyId },
            orderBy: { taxCode: 'asc' },
        });
    }

    async findAllPaymentTerms(companyId: string) {
        return this.prisma.paymentTerm.findMany({
            where: { companyId },
            orderBy: { termCode: 'asc' },
        });
    }

    async findAllPriceLists(companyId: string) {
        return this.prisma.priceList.findMany({
            where: { companyId },
            include: { items: true },
            orderBy: { priceListCode: 'asc' },
        });
    }

    // --- Manufacturing Masters ---
    async findAllMachines(companyId: string) {
        return this.prisma.machine.findMany({
            where: { companyId, isActive: true },
            include: { workCenter: true },
            orderBy: { machineName: 'asc' },
        });
    }

    async findAllWorkCenters(companyId: string) {
        return this.prisma.workCenter.findMany({
            where: { companyId, isActive: true },
            include: {
                department: true,
                uom: true,
                machines: true,
                operations: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    async findAllOperations(companyId: string) {
        return this.prisma.operation.findMany({
            where: { companyId, isActive: true },
            include: { workCenter: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllRoutings(companyId: string) {
        return this.prisma.routing.findMany({
            where: { companyId, isActive: true },
            include: {
                item: true,
                steps: {
                    include: {
                        operation: true,
                        workCenter: true,
                    },
                    orderBy: { stepNumber: 'asc' },
                },
            },
            orderBy: { code: 'asc' },
        });
    }

    async findAllTools(companyId: string) {
        return this.prisma.tool.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllQualityParameters(companyId: string) {
        return this.prisma.qualityParameter.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllSkills(companyId: string) {
        return this.prisma.skill.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllBatches(companyId: string) {
        return this.prisma.batch.findMany({
            where: { companyId, isActive: true },
            include: { item: true },
            orderBy: { batchNumber: 'desc' },
        });
    }

    // --- Kitchen Manufacturing Masters ---
    async findAllCabinetTypes(companyId: string) {
        return this.prisma.cabinetType.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllKitchenHardware(companyId: string) {
        return this.prisma.kitchenHardware.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllKitchenFinishes(companyId: string) {
        return this.prisma.kitchenFinish.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllMaterialGrades(companyId: string) {
        return this.prisma.materialGrade.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllKitchenLayouts(companyId: string) {
        return this.prisma.kitchenLayout.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllInstallationTypes(companyId: string) {
        return this.prisma.installationType.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllKitchenAppliances(companyId: string) {
        return this.prisma.kitchenAppliance.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    // --- System Masters ---
    async findAllUsers(companyId: string) {
        return this.prisma.user.findMany({
            where: { companyId, isActive: true },
            include: {
                role: true,
                employee: {
                    include: {
                        designation: true,
                        department: true,
                    }
                }
            },
            orderBy: { username: 'asc' },
        });
    }

    async findAllRoles(companyId: string) {
        return this.prisma.role.findMany({
            where: { companyId, isActive: true },
            include: {
                permissions: true,
                users: true,
            },
            orderBy: { roleName: 'asc' },
        });
    }

    async findAllDocumentTypes(companyId: string) {
        return this.prisma.documentType.findMany({
            where: { companyId, isActive: true },
            orderBy: { typeName: 'asc' },
        });
    }

    async findAllNumberSeries(companyId: string) {
        return this.prisma.numberSeries.findMany({
            where: { companyId, isActive: true },
            orderBy: { seriesName: 'asc' },
        });
    }

}
