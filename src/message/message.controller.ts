import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { MessageService } from './message.service';


@Controller('message')
export class MessageController {
    constructor(private serv: MessageService){}

   
}
