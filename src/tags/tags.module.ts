import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from 'src/entity/tags.entity';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Tags])],
    providers:[TagsService],
    controllers: [TagsController],
    exports: []
})
export class UserModule {}
