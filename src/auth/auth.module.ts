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

@Module({
  imports:[PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: process.env.SECRET_ACCESS,
        secretOrPrivateKey: process.env.SECRET_ACCESS,
        signOptions: {
          expiresIn: 50
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService, LocalStrategy, JwtService]
})
export class AuthModule {}
