import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { IJwtConfig } from '@app/config/config.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      secretOrKey: config.get<IJwtConfig>('JWT_CONFIG').JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req?.cookies?.auth) {
      return req.cookies.auth;
    }

    return null;
  }

  async validate(payload: any) {
    return payload;
  }
}
