import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Create } from 'sharp';
import { Post} from 'src/entity/post.entity';
import { Repository } from 'typeorm';
import { CreateDTO } from './dto/create.dto';
import { UserService } from 'src/user/user.service';
import { use } from 'passport';

@Injectable()
export class PostService {
    
    constructor(@InjectRepository(Post) private readonly repo: Repository<Post>, private users: UserService)
    {

    }


    public async getAll() {
        return await this.repo.find()
    }

    public async UpdateView(postId: string) {
        const post = await this.repo.findOneBy({id: postId})
        if(!post) return BadRequestException
        return await this.repo.save({...post, ...{views: post['views'] + 1}})
    }

    public async UpdateLike(postId: string) {
        const post = this.repo.findOneBy({id: postId})
        if(!post) return BadRequestException
        return await this.repo.save({...post, ...{views:post['likes'] + 1}})
    }

    public async CreatePost(userId: string, dto: CreateDTO) {
        const user = await this.users.getUserById(userId);
        if(!user) return BadRequestException
        return await this.repo.save({...dto, ...{"creator": user}})
    }


    public async DeletePost(userId: string, postId: string) {
        const user = await this.users.getUserById(userId);
        if(!user) return BadRequestException
        const post = await this.repo.findOneBy({id: postId})
        if(!post) return BadRequestException
        if(post.creator != user) return BadRequestException
        return await this.repo.delete({id: post.id})
    }

    public async UpdatePost(userId: string, dto: CreateDTO) {
        const user = await this.users.getUserById(userId)
        if(!user) return BadRequestException
        const post = await this.repo.findOneBy({id: dto.id})
        if(!post) return BadRequestException
        if(post.creator != user) return BadRequestException
        return await this.repo.save({...post, ...{'markign': dto.marking}})
    }


   
}
