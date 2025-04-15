import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

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

    public async CreateUser(name: string, surname: string, age: number, region: string){
        return await this.repo.save(
            {
                
            }
        )
    }


}
