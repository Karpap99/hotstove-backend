import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { PostTag } from "src/entity/postTag.entity";
import { Tag } from "src/entity/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PostTag, Tag])],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
