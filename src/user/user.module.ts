import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers:[UserService, ConfigService, AuthService, JwtService, JwtStrategy],
    controllers: [UserController],
    exports: []
})
export class UserModule {}
