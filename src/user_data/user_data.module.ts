import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User_Data } from "src/entity/user_data.entity";
import { UserDataService } from "./user_data.service";
import { UserDataController } from "./user_data.controller";
import { UploaderModule } from "src/uploader/uploader.module";
import { PostModule } from "src/post/post.module";
import { FollowerModule } from "src/follower/follower.module";
import { User } from "src/entity/user.entity";

@Module({
  imports: [
    UploaderModule,
    PostModule,
    FollowerModule,
    TypeOrmModule.forFeature([User_Data, User]),
  ],
  providers: [UserDataService],
  controllers: [UserDataController],
  exports: [UserDataService],
})
export class UserDataModule {}
