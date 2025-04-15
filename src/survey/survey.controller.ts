import { Controller, Get, Delete, Post, Put, Param} from '@nestjs/common';

@Controller('survey')
export class SurveyController {


    @Get()
    public async getAll(){
        return await ""
    }
    
    @Get("/:surveyid")
    public async getOneById(@Param("userid") id:string){
        return await ""
    }
    
    @Delete("/:surveyid")
    public async deleteOneById(@Param("userid") id:string){
        return await ""
    }
    
    @Post()
    public async PostOne(){
        return await ""
    }
    
    @Put("/:surveyid")
    public async UpdateOneById(@Param("userid") id:string){
        return await ""
    }

}
