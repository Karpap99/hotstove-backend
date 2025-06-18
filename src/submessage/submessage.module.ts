import { Module } from '@nestjs/common';
import { SubmessageController } from './submessage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { User } from 'src/entity/user.entity';
import { SubMessage } from 'src/entity/submessage.entity';
import { SubMessageService } from './submessage.service';
import { SubmessageLikeModule } from 'src/submessage-like/submessage-like.module';


@Module({
    imports:[TypeOrmModule.forFeature([Message, User, SubMessage]), SubmessageLikeModule ],
    providers:[SubMessageService],
    controllers: [SubmessageController],
    exports: [SubMessageService]
})
export class SubmessageModule {}
