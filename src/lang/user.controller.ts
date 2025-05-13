import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private serv: UserService){}

    @Get()
    public async getAll(){
        return await this.serv.getAll()
    }

    @Get("/:userid")
    public async getOneById(@Param("userid") id:string){
        return await this.serv.getUserById(id);
    }

    @Delete("/:userid")
    public async deleteOneById(@Param("userid") id:string){
        return await this.serv.getUserById(id);
    }

    @Post()
    public async PostOne(@Body() user: UserDTO){
        return await this.serv.CreateUser(user);
    }

    @Put("/:userid")
    public async UpdateOneById(@Param("userid") id:string){
        return await this.serv.getUserById(id);
    }
}
