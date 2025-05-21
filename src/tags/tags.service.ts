import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from 'src/entity/tags.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(@InjectRepository(Tags) private readonly repo: Repository<Tags> )
    {

    }

   
}
