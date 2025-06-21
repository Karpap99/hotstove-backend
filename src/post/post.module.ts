import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserModule } from 'src/user/user.module';
import { UploaderModule } from 'src/uploader/uploader.module';
import { LikeModule } from 'src/like/like.module';
import { Marking } from 'src/entity/marking.entity';
import { TagsModule } from 'src/tags/tags.module';
import { FollowerModule } from 'src/follower/follower.module';

@Module({
    imports:[ forwardRef(()=>UserModule), forwardRef(()=>LikeModule), forwardRef(()=>TagsModule),forwardRef(()=>FollowerModule), UploaderModule, TypeOrmModule.forFeature([Post, Marking])],
    providers:[PostService],
    controllers: [PostController],
    exports: [PostService]
})
export class PostModule {}
