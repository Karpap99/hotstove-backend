import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private serv: UserService){}

    @UseGuards(AuthGuard("jwt"))
    @Get()
    public async getAll(@Req() req: Request){
        return await this.serv.getAll()
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("/get_one")
    public async getOneById(@Req() req: Request){
        return await this.serv.getUserById(req['user'].uuid);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("/")
    public async deleteOneById(@Req() req: Request){
        return await this.serv.DeleteUser(req['user'].uuid)
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    public async PostOne(@Body() user: UserDTO){
        return await this.serv.CreateUser(user);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put("/")
    public async UpdateOneById(@Req() req: Request, @Body() user: UserDTO){
        return await this.serv.UpdateUser(req['user'].uuid, user);
    }
}
