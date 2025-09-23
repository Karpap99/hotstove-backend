import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { token_payload } from "./types";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) protected readonly configService: ConfigService,
    private readonly users: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow("SECRET_ACCESS"),
    });
  }

  async validate(payload: token_payload): Promise<token_payload> {
    if (!(await this.users.IsUserExist(payload.uuid)))
      throw new UnauthorizedException("");
    return {
      uuid: payload.uuid,
      email: payload.email,
      nickname: payload.nickname,
    };
  }
}
