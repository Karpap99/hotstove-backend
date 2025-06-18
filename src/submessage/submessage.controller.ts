import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubMessageService } from './submessage.service';

@Controller('submessage')
export class SubmessageController {
    constructor(private serv: SubMessageService){}

    @UseGuards(AuthGuard('jwt'))
        @Post()
        async sendMessage(@Req() req: Request, @Body("data") data: { messageId: string; text: string; receiverId: string }){
            return await this.serv.sendSubMessage(req['user'].uuid, data)    
        }
    
        @UseGuards(AuthGuard("jwt"))
        @Get("/getAllByMessage")
        public async getAllByPost(@Req() req: Request, @Query("messageId") messageId: string){
            return await this.serv.getAllByMessage(req['user'].uuid, messageId);
        }

}
