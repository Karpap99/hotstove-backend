import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploaderService } from "./uploader.service";

@Controller("uploader")
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Post("/file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
          new MaxFileSizeValidator({
            maxSize: 10000000, // 10MB
            message: "File is too large. Max file size is 10MB",
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body("isPublic") isPublic: string,
  ) {
    const isPublicBool = isPublic === "true" ? true : false;
    return "";
  }

  @Post("/pfp")
  @UseInterceptors(FileInterceptor("image"))
  async uploadpfp(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
          new MaxFileSizeValidator({
            maxSize: 10000000, // 10MB
            message: "File is too large. Max file size is 10MB",
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body("isPublic") isPublic: string,
  ) {
    const isPublicBool = isPublic === "true" ? true : false;
    return this.uploaderService.uploadProfilePhoto({
      file,
      isPublic: isPublicBool,
    });
  }

  @Get(":key")
  async getFileUrl(@Param("key") key: string) {
    return this.uploaderService.getFileUrl(key);
  }

  @Get("/signed-url/:key")
  async getSingedUrl(@Param("key") key: string) {
    return this.uploaderService.getPresignedSignedUrl(key);
  }

  @Delete(":key")
  async deleteFile(@Param("key") key: string) {
    return this.uploaderService.deleteFile(key);
  }
}
