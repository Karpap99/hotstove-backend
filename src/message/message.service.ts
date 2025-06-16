import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { profile } from 'console';

@Injectable()
export class MessageService {
    
    
    constructor(
        @InjectRepository(Message) private readonly repo: Repository<Message>,
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Post) private readonly posts: Repository<Post>
     )
    {

    }

    async sendMessage(uuid: string, data: { postId: string; text: string; }) {
        const user = await this.users.findOne({where: {id: uuid}})
        if(!user) throw new BadRequestException
        const post = await this.posts.findOne({where: {id: data.postId}})
        if(!post) throw new BadRequestException

        const message = this.repo.create({
            post,
            user,
            text: data.text
        });
        const saved =  await this.repo.save(message)
        await this.posts.increment({id: post.id}, 'messagesCount', 1)
        const newMsg = await this.repo.findOne({where: {id: saved.id}, relations:['user', 'user.user_data']})
        if(!newMsg) return saved
        return {
            ...newMsg, 
            user: { 
                        id: newMsg.user.id, 
                        nickname: newMsg.user.nickname, 
                        profile_picture: newMsg.user.user_data.profile_picture 
                   }
        }
    }
    async getAllByPost(postId: string) {
        const post = await this.posts.findOne({where: {id: postId}})
        if(!post) throw new BadRequestException
        const messages = await this.repo.find({where: {post: {id: postId} }, relations:['user', 'user.user_data']})
        const formated = await Promise.all(
            messages.map(async (message)=>
                {
                   return {
                     ...message, 
                    user: { 
                        id: message.user.id, 
                        nickname: message.user.nickname, 
                        profile_picture: message.user.user_data.profile_picture 
                   }
        }}))
        return formated
    }
}
