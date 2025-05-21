import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { User_historyService } from './user_history.service';


@Controller('user_history')
export class User_historyController {
    constructor(private serv: User_historyService ){}

    
}
