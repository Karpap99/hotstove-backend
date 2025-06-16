import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('message')
export class MessageController {
    constructor(private serv: MessageService){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async sendMessage(@Req() req: Request, @Body("data") data: {postId: string, text: string}){
        return await this.serv.sendMessage(req['user'].uuid, data)    
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("/getAllByPost")
    public async getAllByPost(@Req() req: Request, @Query("postId") postId: string){
        return await this.serv.getAllByPost(postId);
    }



   
}
