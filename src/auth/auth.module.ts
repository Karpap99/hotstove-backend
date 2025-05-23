import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { UploaderService } from 'src/uploader/uploader.service';

@Module({
  imports:[PassportModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('SECRET_ACCESS'),
        secretOrPrivateKey: config.get<string>('SECRET_ACCESS'),
        signOptions: {
          expiresIn: 50
        }
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [ConfigService, UploaderService, AuthService, UserService, LocalStrategy, JwtService, JwtStrategy ]
})
export class AuthModule {}
