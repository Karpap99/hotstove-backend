import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowerService } from './follower.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Follower } from 'src/entity/follower.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Follower])],
    providers:[ConfigService, JwtService, JwtStrategy, FollowerService],
    controllers: [],
    exports: [FollowerService]
})
export class FollowerModule {}
