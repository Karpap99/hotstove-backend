import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async SendVerification(userEmail: string) {
    await this.mailerService
      .sendMail({
        to: "test@gmail.com",
        subject: "Testing Nest MailerModule ✔",
        text: "welcome",
        html: "<b>welcome</b>",
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
