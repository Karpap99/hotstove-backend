import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDTO } from './dto/create.dto';

@Controller('post')
export class PostController {
    constructor(private serv: PostService){}

    @UseGuards(AuthGuard("jwt"))
    @Get()
    public async getAll(@Req() req: Request){
        return await this.serv.getAll()
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    public async create(@Req() req: Request, @Body() post: CreateDTO){
        return await this.serv.CreatePost(req['user'].uuid, post)
    }

    @UseGuards(AuthGuard("jwt"))
    @Put()
    public async update(@Req() req: Request, @Body() post: CreateDTO){
        return await this.serv.UpdatePost(req['user'].uuid, post)
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete()
    public async delete(@Req() req: Request, @Body() post: string){
        return await this.serv.DeletePost(req['user'].uuid, post)
    }

}
