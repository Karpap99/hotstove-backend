
import { Controller, Get, Delete, Post, Put, Param} from '@nestjs/common';

@Controller('auth')
export class AuthController {


    @Get()
    public async getAll(){
        return await ""
    }
    

    @Delete()
    public async deleteOneById(){
        return await ""
    }
    
    @Post()
    public async PostOne(){
        return await ""
    }
    
    @Put()
    public async UpdateOneById(){
        return await ""
    }

}
