import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(): Promise<any> {
    const loginDTO = new LoginDto();

    const user = await this.authService.validateUser(loginDTO);
    if (!user) {
      throw UnauthorizedException;
    }
    return user;
  }
}
