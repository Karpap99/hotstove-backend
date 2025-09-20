import { Module } from "@nestjs/common";
import { SubmessageLikeController } from "./submessage-like.controller";
import { SubmessageLikeService } from "./submessage-like.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubmessageLikes } from "src/entity/submessageLike.entity";
import { User } from "src/entity/user.entity";
import { SubMessage } from "src/entity/submessage.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SubmessageLikes, User, SubMessage])],
  controllers: [SubmessageLikeController],
  providers: [SubmessageLikeService],
  exports: [SubmessageLikeService],
})
export class SubmessageLikeModule {}
