import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowerService } from './follower.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Follower } from 'src/entity/follower.entity';
import { FollowerController } from './follower.controller';
import { User } from 'src/entity/user.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Follower, User])],
    providers:[ConfigService, JwtService, JwtStrategy, FollowerService],
    controllers: [FollowerController],
    exports: [FollowerService]
})
export class FollowerModule {}
