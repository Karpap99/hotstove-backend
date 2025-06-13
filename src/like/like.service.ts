import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from 'src/entity/likes.entity';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
    constructor( 
        @InjectRepository(Likes) private readonly repo: Repository<Likes>,
        @InjectRepository(User) private readonly user: Repository<User>,
        @InjectRepository(Post) private readonly post: Repository<Post>
    ){}

    public async getPostLike(user: User, post: Post){
        const result = await this.repo.findBy({'post': post, 'likeBy': user })
    }


    public async setLike(userId: string, postId: string){
        const user = await this.user.findOne({where: {id: userId}})
        if(!user) throw new BadRequestException("user_error")
        const post = await this.post.findOne({where:{id: postId}})
        if(!post) throw new BadRequestException("user_error")
        const existing_like = await this.repo.findOne({where: {likeBy: {id: userId} , post: {id: postId}}})
        if(existing_like) return 
        const new_like = new Likes()
        new_like.post = post
        new_like.likeBy = user
        post.likeCount += 1
        await this.post.save(post)
        return await this.repo.save(new_like)
    }

    public async deleteLike(userId: string, postId: string){
        const user = await this.user.findOne({where: {id: userId}})
        if(!user) throw new BadRequestException
        const post = await this.post.findOne({where:{id: postId}})
        if(!post) throw new BadRequestException
        const existing_like = await this.repo.findOne({where: {likeBy: {id: userId} , post: {id: postId}},
        relations: ['likeBy', 'post'],})
        if(!existing_like) return
        post.likeCount -= 1
        await this.post.save(post)
        return await this.repo.delete(existing_like.id)
    }
}
