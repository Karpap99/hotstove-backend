import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageLikeService } from './message-like.service';
import { MessageLikeController } from './message-like.controller';
import { MessageLike } from 'src/entity/messageLike.entity';
import { User } from 'src/entity/user.entity';
import { Message } from 'src/entity/message.entity';


@Module({
    imports:[TypeOrmModule.forFeature([MessageLike, User, Message])],
    providers:[MessageLikeService],
    controllers: [MessageLikeController],
    exports: [MessageLikeService]
})
export class MessageLikeModule {}
