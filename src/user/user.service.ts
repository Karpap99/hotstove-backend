import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { UploaderService } from 'src/uploader/uploader.service';
import { use } from 'passport';
import { PostService } from 'src/post/post.service';
import { FollowerService } from 'src/follower/follower.service';
import { UserDataService } from 'src/user_data/user_data.service';

@Injectable()
export class UserService {
    

    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        @Inject(forwardRef(() => UploaderService))
        private uploader: UploaderService,
        @Inject(forwardRef(() => PostService))
        private post: PostService,
        private user_data: UserDataService
    )
    {

    }

    public async getAll(){
        return await this.repo.find();
    }

    public async getUserById(user: string){
        return await this.repo.findOne({where: {
            "id" : user
        }})
    }


    public async getUserWithPostsAndSubscribe(requestedUser: string, reqUser: string){
        const user = await this.repo.findOne({where: {"id": requestedUser}})
        const error = {
            "message": [''],
            "error": "Bad Request",
            "statusCode": 400
        }
        if(!user) {
            error.message.push(`User with id ${requestedUser} doen't exist`)
            throw new BadRequestException(error)
        }
    }


    public async getUserWithDataById(uuid: string) {
        const user = await this.repo.findOne({where: {id: uuid}, relations: ['user_data']})
        if(!user) throw BadRequestException
        const response = {
            ...user,
            ...user.user_data
        }
        return response
    }

    public async CreateUser(user: UserDTO){
        const payload = new User();
        payload.nickname = user.nickname
        payload.email = user.email
        payload.password = user.password
        return await this.repo.save(payload)
    }

    public async DeleteUser(id: string){
        return await this.repo.delete(id);
    }

    
}
