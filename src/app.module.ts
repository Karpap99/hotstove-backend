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




@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UserModule,
    UploaderModule,
    PostModule,
    MulterModule.register({
      storage: memoryStorage()
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
