import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private jwtService: JwtService,
        private userService: UserService
    ){}

    public async signUp(user: SignUpDto){ 
        const old_user = await this.users.findOne({where: {"email" : user.email}})
        if (old_user){
            return BadRequestException
        }
        if(user.password == user.password2){
            const new_user = UserDTO.from(user)
            const salt = await bcrypt.genSalt();
            new_user.password = await bcrypt.hash(new_user.password, salt);
            const result = await this.userService.CreateUser(new_user)
            const token = await this.getToken(user.email, user.password)
            return {result, token}
        }
        return BadRequestException
    }


    async validateUser(email: string, password: string){
        const user = await this.users.findOne({where: {"email" : email}})
        if (user && user.password === password){
            const {password, ...result} = user
            return result;
        }
        return null
    }

    public async login(user: LoginDto){
        const u = await this.users.findOne({where:{"email":user.email}})
        if(u){
            if(await bcrypt.compare(user.password, u.password))
                return await this.getToken(user.email,user.password)
        }
        return BadRequestException
    }

    async getToken(email: string, password: string){
        return this.jwtService.sign({"email": email, "password" : password},{secret:"test"})
    }

}
