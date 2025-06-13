import { BadRequestException, Injectable, Logger, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { ResponseDTO } from 'src/user/dto/response.dto';

@UsePipes(new ValidationPipe({transform: true}))
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private jwtService: JwtService,
        private userService: UserService,
        private readonly configService: ConfigService,
    ){}

    public async signUp(user: SignUpDto){ 
        const error = {
            "message": [''],
            "error": "Bad Request",
            "statusCode": 400
        }
        Logger.log("here")
        const old_user = await this.users.findOne({where: {"email" : user.email}})
        if (old_user){
            error.message.push('this email taken')
            throw new BadRequestException(error)
        }
        if(!(user.password == user.password2)) return BadRequestException
        const new_user = UserDTO.from(user)

        const salt = await bcrypt.genSalt(); 
        new_user.password = await bcrypt.hash(new_user.password, salt);

        const result = await this.userService.CreateUser(new_user)
        const {access, refresh} = await this.getToken(TokenDto.from(result.id,result.email,result.nickname))
        const response = ResponseDTO.from(result)
        return {"result" : response, "access": access, "refresh": refresh}
    }


    async validateUser(loginDTO: LoginDto): Promise<User>{
        const error = {
            "message": [''],
            "error": "Bad Request",
            "statusCode": 400
        }
    
        const user = await this.users.findOne({where:{"email": loginDTO.email}})
        if(!user){
            error.message.push("user doesn't exist")
            throw new BadRequestException(error)
        } 
        const pass_compare = await bcrypt.compare( loginDTO.password, user.password,)
        if (!pass_compare){
            error.message.push("user doesn't exist")
            throw new BadRequestException(error)
        } 
        return user
    }

    async reAuth(refreshTKN: string){
        const result = await this.verifyToken(refreshTKN, 'refresh')
        const error = {
            "message": [''],
            "error": "Bad Request",
            "statusCode": 400
        }
        const user = await this.users.findOne({where:{'id': result.uuid}})
        if(!user){
            error.message.push("user doesn't exist")
            throw new BadRequestException(error)
        } 
        const tokenDTO = TokenDto.from(user.id, user.email, user.nickname)
        const {access, refresh} = await this.getToken(tokenDTO)
        const response = ResponseDTO.from(user)
        return {"result": response, "access": access, "refresh": refresh}
    }

    
    async login(usr: LoginDto){
        const user = await this.validateUser(usr)
        const tokenDTO = TokenDto.from(user.id, user.email, user.nickname)
        const {access, refresh} = await this.getToken(tokenDTO)
        const response = ResponseDTO.from(user)
        return {"result": response, "access": access, "refresh": refresh}
    }

    async verifyToken(token: string, type: 'access' | 'refresh'){
        try {
            return await this.jwtService.verify(token, {
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
