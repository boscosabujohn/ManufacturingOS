import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

/**
 * JWT authentication guard.
 *
 * Registered globally (see AppModule APP_GUARD) so every route is
 * authenticated by default. Routes annotated with @Public() are allowed
 * through without a token.
 *
 * Also usable as a per-controller guard via @UseGuards(JwtAuthGuard); the
 * @Public() check makes that redundant but harmless.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // DEMO MODE: frontend and backend live on different domains, so the
        // auth cookie/token can't be shared. When DEMO_MODE=true, let every
        // route through with a stub system-admin user so the demo UI can read
        // data without a login. Never enable this in a real deployment.
        if (process.env.DEMO_MODE === 'true') {
            const req = context.switchToHttp().getRequest();
            req.user = req.user ?? {
                id: 'demo-admin',
                sub: 'demo-admin',
                username: 'admin',
                companyId: 'demo-company',
                isSystemAdmin: true,
                roles: ['admin'],
                permissions: ['*'],
            };
            return true;
        }

        return super.canActivate(context);
    }
}
