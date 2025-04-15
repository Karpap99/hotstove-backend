
import { Controller, Get, Delete, Post, Put, Param} from '@nestjs/common';

@Controller('authorization')
export class AuthorizationController {

    @Get("sign-up")
    public async signUp(){
        return await ""
    }

    @Get("login")
    public async login(){
        return await ""
    }

    @Get("logout")
    public async logout(){
        return await ""
    }
    

}
