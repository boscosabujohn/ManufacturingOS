import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('companies')
// @UseGuards(JwtAuthGuard) // Uncomment when auth is fully configured
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    create(@Body() createCompanyDto: any) {
        return this.companyService.create(createCompanyDto);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.companyService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companyService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCompanyDto: any) {
        return this.companyService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.companyService.remove(id);
    }
}
