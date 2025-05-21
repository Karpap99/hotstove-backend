import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entity/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tag) private readonly repo: Repository<Tag> )
    {

    }

}
