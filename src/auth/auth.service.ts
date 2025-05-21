import { BadRequestException, Injectable, Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private jwtService: JwtService,
        private userService: UserService,
        private readonly configService: ConfigService,
    ){}

    public async signUp(user: SignUpDto){ 
        const old_user = await this.users.findOne({where: {"email" : user.email}})
        if (old_user){
            console.log(old_user)
            return {'error' : 'user exist'}
        }
        if(user.password == user.password2){
            const new_user = UserDTO.from(user)
            const salt = await bcrypt.genSalt();
            new_user.password = await bcrypt.hash(new_user.password, salt);
            const result = await this.userService.CreateUser(new_user)
            const token = await this.getToken(TokenDto.from(result["uuid"],result['email'],result['nickname']))
            return {"result" : result, "token": token}
        }
        return BadRequestException
    }


    async validateUser(email: string, password: string){
        const user = await this.users.findOne({where:{"email": email}})
        if(!user) throw new BadRequestException('userDoensExist')
        const pass_compare = await bcrypt.compare( password, user.password,)
        if (!pass_compare) throw new BadRequestException('Password doesnt exist')
        return user
    }

    
    async login(user: TokenDto){
        const {access, refresh} = await this.getToken(user)
        return {"access": access, "refresh": refresh}
    }

    async verifyToken(token: string, type: 'access' | 'refresh'){
        try {
            return this.jwtService.verify(token, {
                secret:
                    type === 'access'
                        ? this.configService.get<string>('SECRET_ACCESS')
                        : this.configService.get<string>('SECRET_REFRESH'),
                ignoreExpiration: false,
                algorithms: ['HS256'],
            });
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
    async getToken(user: TokenDto){
        const access = this.jwtService.sign({...user}, 
            {
                secret: this.configService.get<string>('SECRET_ACCESS'), 
                expiresIn: '1h', 
                algorithm: 'HS256'
            })
        const refresh = this.jwtService.sign({...user},  {
                secret: this.configService.get<string>('SECRET_REFRESH'), 
                expiresIn: '60d', 
                algorithm: 'HS256'
            })
        return {access, refresh}
    }

}
