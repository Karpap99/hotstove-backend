
import { Controller, Get, Delete, Post, Put, Param, UseGuards, Body, Req, Logger} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { time } from 'console';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
    constructor(private serv: AuthService){}

    @Post("sign-up")
    public async signUp(@Body() user: SignUpDto){
        return await this.serv.signUp(user)
    }

    @UseGuards(AuthGuard('local'))
    @Post("login")
    public async login(@Req() req: Request, @Body() user: LoginDto){
        return await this.serv.login(TokenDto.from(req['user'].uuid,req['user'].email,req['user'].nickname))
    }

    @UseGuards(AuthGuard('jwt'))
    @Get("/refresh_token")
    public async getToken(@Req() req: Request){
        const token = req.headers['authorization'].replace('Bearer ', '');
        return await this.serv.getToken(token)
    }

    @UseGuards(AuthGuard('local'))
    @Post("logout")
    public async logout(){
        return await ""
    }
    

}
