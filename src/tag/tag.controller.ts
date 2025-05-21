import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
    constructor(private serv: TagService){}

 
}
