import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User_history } from 'src/entity/user_history.entity';
import { User_historyService } from './user_history.service';
import { User_historyController } from './user_history.controller';

@Module({
    imports:[TypeOrmModule.forFeature([User_history])],
    providers:[User_historyService],
    controllers: [User_historyController],
    exports: []
})
export class User_historyModule {}
