import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req) => {
                    return req?.cookies?.access_token || null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || (() => { throw new Error('JWT_SECRET is missing'); })(),
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username };
    }
}
