import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserDataService } from "./user_data.service";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateDTO } from "./dto/update.dto";
@Controller("user-data")
export class UserDataController {
  constructor(private serv: UserDataService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  public async getOne(@Req() req: Request, @Body() id: string) {
    return await this.serv.getUserDataById(id ? id : req["user"].uuid);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/")
  @UseInterceptors(FileInterceptor("file"))
  public async UpdateOneById(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
          new MaxFileSizeValidator({
            maxSize: 10000000, // 10MB
            message: "File is too large. Max file size is 10MB",
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
    @Body() update: UpdateDTO,
  ) {
    return await this.serv.UpdateUser(req["user"].uuid, update, file);
  }
}
