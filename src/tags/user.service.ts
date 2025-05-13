import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User> )
    {

    }

    public async getAll(){
        return await this.repo.find();
    }

    public async getUserById(uuid: string){
        return await this.repo.find({where: {
            "id" : uuid
        }})
    }

    public async CreateUser(user: UserDTO){
        const payload = new User();
        payload.nickname = user.nickname
        payload.age = user.age
        payload.region = user.region
        return await this.repo.save(
            payload
        )
    }

    public async DeleteUser(id: string){
        return await this.repo.delete(id);
    }
}
