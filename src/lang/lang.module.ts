import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lang } from 'src/entity/lang.entity';
import { LangService } from './lang.service';
import { LangController } from './lang.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Lang])],
    providers:[LangService],
    controllers: [LangController],
    exports: []
})
export class LangModule {}
