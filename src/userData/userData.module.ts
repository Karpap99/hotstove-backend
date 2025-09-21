import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserData } from "src/entity/userData.entity";
import { UserDataService } from "./userData.service";
import { UserDataController } from "./userData.controller";
import { UploaderModule } from "src/uploader/uploader.module";
import { PostModule } from "src/post/post.module";
import { FollowerModule } from "src/follower/follower.module";
import { User } from "src/entity/user.entity";

@Module({
  imports: [
    UploaderModule,
    PostModule,
    FollowerModule,
    TypeOrmModule.forFeature([UserData, User]),
  ],
  providers: [UserDataService],
  controllers: [UserDataController],
  exports: [UserDataService],
})
export class UserDataModule {}
