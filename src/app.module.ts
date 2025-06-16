import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { UploaderModule } from './uploader/uploader.module';
import "reflect-metadata"
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { MailModule } from './mail/mail.module';
import { FollowerService } from './follower/follower.service';
import { FollowerModule } from './follower/follower.module';
import { LikeService } from './like/like.service';
import { LikeModule } from './like/like.module';
import { UserDataModule } from './user_data/user_data.module';
import { MessageModule } from './message/message.module';
import { TagModule } from './tag/tag.module';




@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UserModule,
    UploaderModule,
    MailModule,
    FollowerModule,
    PostModule,
    MessageModule,
    MulterModule.register({
      storage: memoryStorage()
    }),
    LikeModule,
    UserDataModule,
    TagModule
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
