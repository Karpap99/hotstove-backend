import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { User } from 'src/entity/user.entity';
import { Post } from 'src/entity/post.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Message, User, Post])],
    providers:[MessageService],
    controllers: [MessageController],
    exports: []
})
export class MessageModule {}
