import { Controller, Post, UseGuards, Request, Body, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login with username and password' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(req.user);

        // Set HttpOnly cookie
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

        return result;
    }


    @Post('logout')
    @ApiOperation({ summary: 'Logout and clear session' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)

    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved' })
    async getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user.id);
    }
}
