import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { UpdateDTO } from './dto/update.dto';
import { UploaderService } from 'src/uploader/uploader.service';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        private uploader: UploaderService
    
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


    public async CreateUser(user: UserDTO){
        const payload = new User();
        payload.nickname = user.nickname
        payload.email = user.email
        payload.password = user.password
        payload.age = new Date()
        payload.profile_picture = ""
        payload.description = ""
        return await this.repo.save(
            payload
        )
    }

    public async DeleteUser(id: string){
        return await this.repo.delete(id);
    }

    public async UpdateUser(uuid: string, update: UpdateDTO ,file?: Express.Multer.File){
        const u = await this.repo.findOne({where:{id: uuid}})
        if(!u) return {'result': "user doesn't exist"}
        const UpdateInfo = UserDTO.from(u)
        if(file) {
            const isPublic = update.isPublic === 'true' ? true : false
            const pfp = await this.uploader.uploadProfilePhoto({file, isPublic})
            UpdateInfo.profile_picture = pfp.url
        }
        if(update.age != "") {
            UpdateInfo.age = new Date(update.age)
        }
        UpdateInfo.description = update.description
        const result = await this.repo.save({
            ...u, ...UpdateInfo
        })
        return {'res' : "updated", 'result': result}
    }
}
