import { Body, Controller, Delete, FileTypeValidator, Get, Logger, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateDTO } from './dto/update.dto';
@Controller('user')
export class UserController {
    constructor(private serv: UserService){}

    @UseGuards(AuthGuard("jwt"))
    @Get()
    public async getAll(@Req() req: Request){
        return await this.serv.getAll()
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("/get_one")
    public async getOneById(@Req() req: Request){
        return await this.serv.getUserById(req['user'].uuid);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("/")
    public async deleteOneById(@Req() req: Request){
        return await this.serv.DeleteUser(req['user'].uuid)
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    public async PostOne(@Body() user: UserDTO){
        return await this.serv.CreateUser(user);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put("/")
    @UseInterceptors(FileInterceptor('file'))
    public async UpdateOneById(@UploadedFile(
          new ParseFilePipe({
            validators: [
              new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
              new MaxFileSizeValidator({
                maxSize: 10000000, // 10MB
                message: 'File is too large. Max file size is 10MB',
              }),
            ],
            fileIsRequired: false,
          }),
        )
        file: Express.Multer.File,
        @Req() req: Request, 
        @Body() update: UpdateDTO){
        return await this.serv.UpdateUser(req['user'].uuid, update, file);
    }
}
