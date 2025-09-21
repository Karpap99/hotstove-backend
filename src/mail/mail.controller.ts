import { Controller, Get, UseGuards } from "@nestjs/common";
import { MailService } from "./mail.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("mail")
export class MailController {
  constructor(private mailService: MailService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  public async getAll() {
    return await this.mailService.SendVerification();
  }
}
