import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FollowerService } from './follower.service';

@Controller('follower')
export class FollowerController {
    constructor(private serv: FollowerService){}


    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async FollowOn(@Req() req: Request, @Body() followTo: string){
        return await this.serv.FollowOn(req['user'].uuid, followTo)
    }
    
}
