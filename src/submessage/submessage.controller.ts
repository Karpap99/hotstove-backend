import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SubMessageService } from "./submessage.service";

@Controller("submessage")
export class SubmessageController {
  constructor(private serv: SubMessageService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async sendMessage(
    @Req() req: Request,
    @Body("data") data: { messageId: string; text: string; receiverId: string },
  ) {
    return await this.serv.sendSubMessage(req["user"].uuid, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/getAllByMessage")
  public async getAllByPost(
    @Req() req: Request,
    @Query("messageId") messageId: string,
  ) {
    return await this.serv.getAllByMessage(req["user"].uuid, messageId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("")
  public async Delete(
    @Req() req: Request,
    @Query("messageId") messageId: string,
  ) {
    return await this.serv.Delete(req["user"].uuid, messageId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("")
  public async update(
    @Req() req: Request,
    @Body("data") data: { messageId: string; text: string },
  ) {
    return await this.serv.UpdateMessage(req["user"].uuid, data);
  }
}
