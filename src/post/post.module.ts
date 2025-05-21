import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entity/user.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Post, User])],
    providers:[PostService,ConfigService, AuthService, JwtService, JwtStrategy, UserService],
    controllers: [PostController],
    exports: []
})
export class PostModule {}
