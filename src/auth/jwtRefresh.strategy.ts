
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(ConfigService) protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Cookie'),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow("SECRET_REFRESH")
    });
  }

  async validate(payload: any) {
    return {uuid:payload.uuid, email: payload.email, nickname: payload.nickname};
  }
}