import { Module } from "@nestjs/common";
import { UploaderService } from "./uploader.service";
import { UploaderController } from "./uploader.controller";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [],
  providers: [UploaderService, ConfigService],
  controllers: [UploaderController],
  exports: [UploaderService],
})
export class UploaderModule {}
