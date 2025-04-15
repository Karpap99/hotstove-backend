
import { Controller, Get, Delete, Post, Put, Param} from '@nestjs/common';

@Controller('question')
export class QuestionController {


    @Get()
    public async getAll(){
        return await ""
    }
    
    @Get("/:questionid")
    public async getOneById(@Param("userid") id:string){
        return await ""
    }
    
    @Delete("/:questionid")
    public async deleteOneById(@Param("userid") id:string){
        return await ""
    }
    
    @Post()
    public async PostOne(){
        return await ""
    }
    
    @Put("/:questionid")
    public async UpdateOneById(@Param("userid") id:string){
        return await ""
    }

}
