import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { UploaderService } from 'src/uploader/uploader.service';
import { use } from 'passport';
import { PostService } from 'src/post/post.service';
import { FollowerService } from 'src/follower/follower.service';
import { UserDataDTO } from './dto/user_data.dto';
import { User_Data } from 'src/entity/user_data.entity';
import { UpdateDTO } from './dto/update.dto';

@Injectable()
export class UserDataService {
    
    constructor(
        @InjectRepository(User_Data) private readonly data: Repository<User_Data>,
        @InjectRepository(User) private readonly users: Repository<User>,
        @Inject(forwardRef(() => UploaderService))
        private uploader: UploaderService
    ) {}
    async CreateUser(user: UserDataDTO) {
        
    }
    async getUserDataById(uuid: string) {
        const userdata = await this.data.findOne({where: {'user': {id: uuid}}})
        return {"result":userdata}
    }

    public async UpdateUser(uuid: string, update: UpdateDTO, file?: Express.Multer.File) {
    const u = await this.users.findOne({ where: { id: uuid } });
    if (!u) return { result: "user doesn't exist" };

    let userData = await this.data.findOne({ where: { user: { id: uuid } }, relations: ['user'] });

    if (!userData) {
        userData = new User_Data();
        userData.user = u;
    }

    if (file) {
        const isPublic = update.isPublic === 'true';
        const pfp = await this.uploader.uploadProfilePhoto({ file, isPublic });
        userData.profile_picture = pfp.url;
    }

    if (update.age) {
        userData.age = new Date(update.age);
    }

    if (update.description !== undefined) {
        userData.description = update.description;
    }

    const result = await this.data.save(userData);
    return { res: "updated", result };
}

    
}
