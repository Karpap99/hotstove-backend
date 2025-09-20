import { Controller, Get, Post, UseGuards, Body, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private serv: AuthService) {}

  @Post("sign-up")
  public async signUp(@Body() user: SignUpDto) {
    return await this.serv.signUp(user);
  }

  @Post("login")
  public async login(@Req() req: Request, @Body() user: LoginDto) {
    return await this.serv.login(user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/refresh_token")
  public async getToken(@Req() req: Request) {
    const token = req.headers["authorization"].replace("Bearer ", "");
    return await this.serv.getToken(token);
  }

  @UseGuards(AuthGuard("local"))
  @Post("logout")
  public async logout() {
    return await "";
  }

  @Get("reauth")
  public async reauth(@Req() req: Request) {
    return await this.serv.reAuth(req.headers["cookie"]);
  }

  @Get("verify")
  public async verify() {
    return await this.serv.verifyToken("", "access");
  }
}
