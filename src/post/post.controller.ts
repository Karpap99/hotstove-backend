import { Body, Controller, Delete, FileTypeValidator, Get, Logger, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDTO } from './dto/create.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
@Controller('post')
export class PostController {
    constructor(private serv: PostService){}

    @UseGuards(AuthGuard("jwt"))
    @Get()
    public async getAll(@Req() req: Request){
        return await this.serv.getAll(req['user'].uuid)
    }

    @UseGuards(AuthGuard("jwt"))
    @Get('/byId')
    public async getById(@Req() req: Request, @Body('data') data: { postId: string}){
        return await this.serv.getPostsById(req['user'].uuid, data.postId)
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
     @UseInterceptors(FilesInterceptor('files'))
    public async create(@UploadedFiles() files: Express.Multer.File[],@Req() req: Request, @Body() post: CreateDTO){
        return await this.serv.CreatePost(req['user'].uuid, post, files)
    }

    @UseGuards(AuthGuard("jwt"))
    @Put()
    @UseInterceptors(FilesInterceptor('files'))
    public async update(
        @UploadedFiles()
    files: Express.Multer.File[],
        @Req() req: Request){
        return await this.serv.UpdatePost(req['user'].uuid)
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete()
    public async delete(@Req() req: Request, @Body('data') data: { postId: string}){
        return await this.serv.DeletePost(req['user'].uuid, data.postId)
    }

}
