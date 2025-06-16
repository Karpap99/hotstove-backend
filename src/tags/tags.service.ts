import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { skip } from 'node:test';
import { PostTag } from 'src/entity/postTag.entity';
import { Tag } from 'src/entity/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(@InjectRepository(PostTag) private readonly repo: Repository<PostTag>,@InjectRepository(Tag) private readonly Tags: Repository<Tag>)
    {

    }

   async addTags(postId: string, tags: string){
        const Tags = JSON.parse(tags)
        Tags.forEach(async (tag)=>{
            const tg = await this.Tags.find({where: {id: tag['id']}})
            if(tg){
                const payload = await this.repo.create({post:{id: postId}, tag: {id: tag["id"]}})
                await this.repo.save(payload)
            }
        })
        return
}

}
