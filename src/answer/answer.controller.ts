
import { Controller, Get, Delete, Post, Put, Param} from '@nestjs/common';

@Controller('answer')
export class AnswerController {


    @Get()
    public async getAll(){
        return await ""
    }
    
    @Get("/:answerid")
    public async getOneById(@Param("answerid") id:string){
        return await ""
    }
    
    @Delete("/:answerid")
    public async deleteOneById(@Param("answerid") id:string){
        return await ""
    }
    
    @Post()
    public async PostOne(){
        return await ""
    }
    
    @Put("/:answerid")
    public async UpdateOneById(@Param("answerid") id:string){
        return await ""
    }

}
