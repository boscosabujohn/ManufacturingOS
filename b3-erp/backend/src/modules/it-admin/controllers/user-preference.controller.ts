import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserPreferenceService } from '../services/user-preference.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('user/preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferenceController {
    constructor(private readonly preferenceService: UserPreferenceService) { }

    @Get()
    async getPreferences(@Request() req: any) {
        return this.preferenceService.findByUserId(req.user.userId);
    }

    @Put()
    async updatePreferences(@Request() req: any, @Body() body: any) {
        return this.preferenceService.update(req.user.userId, body);
    }
}
