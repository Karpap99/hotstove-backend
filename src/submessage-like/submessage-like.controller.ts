import { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SubmessageLikeService } from "./submessage-like.service";

@Controller("submessage-like")
export class SubmessageLikeController {
  constructor(private service: SubmessageLikeService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("")
  async setLike(@Req() req: Request, @Body("messageId") messageId: string) {
    return await this.service.setLike(req.user!.uuid, messageId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("")
  async deleteLike(@Req() req: Request, @Query("messageId") messageId: string) {
    return await this.service.deleteLike(req.user!.uuid, messageId);
  }
}
