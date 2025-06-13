import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from 'src/entity/likes.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { LocalStrategy } from 'src/auth/local.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entity/user.entity';
import { Post } from 'src/entity/post.entity';

@Module({
  imports: [LikeModule, TypeOrmModule.forFeature([Likes, User, Post])],
  providers: [ConfigService, JwtService, JwtStrategy, LikeService],
  controllers: [LikeController],
  exports: [LikeService]
})
export class LikeModule {}
