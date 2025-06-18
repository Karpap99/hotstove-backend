import { Body, Controller, Delete, FileTypeValidator, Get, Logger, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDTO } from './dto/create.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Marking } from 'src/entity/marking.entity';
@Controller('post')
export class PostController {
    constructor(private serv: PostService){}

    @UseGuards(AuthGuard("jwt"))
    @Get()
    public async getAll(@Req() req: Request, @Query('page') page: number = 1, @Query('limit') limit: number = 10){
        return await this.serv.getAll(req['user'].uuid, page)
    }

    @Get("test")
    public async Test(){
        return await this.serv.Test()
    }


    @UseGuards(AuthGuard("jwt"))
    @Get('/byId')
    public async getById(@Req() req: Request, @Query('postId') postId: string){
        return await this.serv.getPostsById(req['user'].uuid, postId)
    }

    @UseGuards(AuthGuard("jwt"))
    @Get('/getAllByUser')
    public async getByUser(@Req() req: Request, @Query('UserId') UserId: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10){
        return await this.serv.getPostsByUserId(req['user'].uuid, UserId, page)
    }


    @UseGuards(AuthGuard("jwt"))
    @Get("/ByUserAndFollowed")
    public async ByUserAndFollowed(@Req() req: Request){
        return await this.serv.ByUserAndFollowed(req['user'].uuid);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
     @UseInterceptors(FilesInterceptor('files'))
    public async create(@UploadedFiles() files: Express.Multer.File[],@Req() req: Request, @Body() data : {post: CreateDTO, tags: string}){
        return await this.serv.CreatePost(req['user'].uuid, CreateDTO.from({title: data['title'],description: data['description'], marking: data['marking']}), files, data.tags)
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
