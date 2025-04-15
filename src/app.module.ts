import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { SurveyModule } from './survey/survey.module';
import { QuestionController } from './question/question.controller';
import { QuestionModule } from './question/question.module';
import { AnswerService } from './answer/answer.service';
import { AnswerModule } from './answer/answer.module';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthorizationModule,
    UserModule,
    SurveyModule,
    QuestionModule,
    AnswerModule,
    TokenModule

  ],
  controllers: [],
  providers: [TokenService],
})
export class AppModule {}
