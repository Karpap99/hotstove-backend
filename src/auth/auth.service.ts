import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private jwtService: JwtService
    ){}

    public async signUp(user: UserDTO){ 

    }


    async validateUser(email: string, password: string){
        const user = await this.users.findOne({where: {"email" : email}})
        if (user && user.password === password){
            const {password, ...result} = user
            return result;
        }
        return null
    }

    async login(user: UserDTO){
        const payload = { email: user.email, password: user.password}
        return this.jwtService.sign(payload)
    }


    async getToken(){
        return this.jwtService.sign({"email": "awfwaf", "password" : "afawfawf"},{secret:"test"})
    }

}
