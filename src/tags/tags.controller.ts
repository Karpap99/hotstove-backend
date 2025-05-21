import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private serv: TagsService){}
}
