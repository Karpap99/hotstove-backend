
import { Controller, Get, Delete, Post, Put, Param, UseGuards, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private serv: AuthService){}

    @Get("sign-up")
    public async signUp(){
        return await ""
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    public async login(@Body() user: UserDTO){
        return await this.serv.login(user)
    }


    @Get()
    public async getToken(){
        return await this.serv.getToken()
    }

    @UseGuards(LocalAuthGuard)
    @Post("logout")
    public async logout(){
        return await ""
    }
    

}
