
import { Controller, Get, Delete, Post, Put, Param, UseGuards, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/dto/user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private serv: AuthService){}

    @Post("sign-up")
    public async signUp(@Body() user: SignUpDto){
        return await this.serv.signUp(user)
    }

    @Post("login")
    public async login(@Body() user: LoginDto){
        return await this.serv.login(user)
    }


    @Get()
    public async getToken(){
        return await ""
    }

    @UseGuards(LocalAuthGuard)
    @Post("logout")
    public async logout(){
        return await ""
    }
    

}
