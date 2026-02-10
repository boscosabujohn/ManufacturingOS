import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CommonMastersService } from './common-masters.service';

@Controller('common-masters')
export class CommonMastersController {
    constructor(private readonly commonMastersService: CommonMastersService) { }

    @Get('currencies')
    findAllCurrencies() {
        return this.commonMastersService.findAllCurrencies();
    }

    @Get('departments')
    findAllDepartments(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllDepartments(companyId);
    }

    @Post('departments')
    createDepartment(@Body() data: { name: string; companyId: string; branchId?: string }) {
        return this.commonMastersService.createDepartment(data);
    }

    @Get('designations')
    findAllDesignations(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllDesignations(companyId);
    }

    @Get('employees')
    findAllEmployees(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllEmployees(companyId);
    }

    @Get('shifts')
    findAllShifts(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllShifts(companyId);
    }

    @Get('holidays')
    findAllHolidays(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllHolidays(companyId);
    }

    @Get('uoms')
    findAllUoms(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllUoms(companyId);
    }

    @Get('countries')
    findAllCountries() {
        return this.commonMastersService.findAllCountries();
    }

    @Get('states/:countryId')
    findStatesByCountry(@Param('countryId') countryId: string) {
        return this.commonMastersService.findStatesByCountry(countryId);
    }

    @Get('cities/:stateId')
    findCitiesByState(@Param('stateId') stateId: string) {
        return this.commonMastersService.findCitiesByState(stateId);
    }

    @Get('territories')
    findAllTerritories(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllTerritories(companyId);
    }

    @Get('cost-centers')
    findAllCostCenters(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllCostCenters(companyId);
    }

    @Get('plants')
    findAllPlants(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllPlants(companyId);
    }

    @Get('warehouses')
    findAllWarehouses(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllWarehouses(companyId);
    }

    @Get('exchange-rates')
    findAllExchangeRates(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllExchangeRates(companyId);
    }

    @Get('brands')
    findAllBrands(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllBrands(companyId);
    }

    @Get('hsn-sacs')
    findAllHsnSacs(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllHsnSacs(companyId);
    }

    @Get('item-categories')
    findAllItemCategories(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllItemCategories(companyId);
    }

    @Get('item-groups')
    findAllItemGroups(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllItemGroups(companyId);
    }

    @Get('items')
    findAllItems(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllItems(companyId);
    }

    @Get('customer-categories')
    findAllCustomerCategories(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllCustomerCategories(companyId);
    }

    @Get('customers')
    findAllCustomers(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllCustomers(companyId);
    }

    @Get('vendor-categories')
    findAllVendorCategories(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllVendorCategories(companyId);
    }

    @Get('vendors')
    findAllVendors(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllVendors(companyId);
    }

    // --- Financial Masters ---
    @Get('accounts')
    findAllAccounts(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllAccounts(companyId);
    }

    @Get('bank-accounts')
    findAllBankAccounts(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllBankAccounts(companyId);
    }

    @Get('taxes')
    findAllTaxes(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllTaxes(companyId);
    }

    @Get('payment-terms')
    findAllPaymentTerms(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllPaymentTerms(companyId);
    }

    @Get('price-lists')
    findAllPriceLists(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllPriceLists(companyId);
    }

    // --- Manufacturing Masters ---
    @Get('machines')
    findAllMachines(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllMachines(companyId);
    }

    @Get('work-centers')
    findAllWorkCenters(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllWorkCenters(companyId);
    }

    @Get('operations')
    findAllOperations(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllOperations(companyId);
    }

    @Get('routings')
    findAllRoutings(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllRoutings(companyId);
    }

    @Get('tools')
    findAllTools(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllTools(companyId);
    }

    @Get('quality-parameters')
    findAllQualityParameters(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllQualityParameters(companyId);
    }

    @Get('skills')
    findAllSkills(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllSkills(companyId);
    }

    @Get('batches')
    findAllBatches(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllBatches(companyId);
    }

    // --- Kitchen Manufacturing Masters ---
    @Get('cabinet-types')
    findAllCabinetTypes(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllCabinetTypes(companyId);
    }

    @Get('kitchen-hardware')
    findAllKitchenHardware(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllKitchenHardware(companyId);
    }

    @Get('kitchen-finishes')
    findAllKitchenFinishes(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllKitchenFinishes(companyId);
    }

    @Get('material-grades')
    findAllMaterialGrades(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllMaterialGrades(companyId);
    }

    @Get('kitchen-layouts')
    findAllKitchenLayouts(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllKitchenLayouts(companyId);
    }

    @Get('installation-types')
    findAllInstallationTypes(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllInstallationTypes(companyId);
    }

    @Get('kitchen-appliances')
    findAllKitchenAppliances(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllKitchenAppliances(companyId);
    }

    // --- System Masters ---
    @Get('users')
    findAllUsers(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllUsers(companyId);
    }

    @Get('roles')
    findAllRoles(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllRoles(companyId);
    }

    @Get('document-types')
    findAllDocumentTypes(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllDocumentTypes(companyId);
    }

    @Get('number-series')
    findAllNumberSeries(@Query('companyId') companyId: string) {
        return this.commonMastersService.findAllNumberSeries(companyId);
    }

}
