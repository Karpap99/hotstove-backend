import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService} from '@nestjs/config';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    public generateTokens(payload: object){
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('SECRET_ACCESS'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN_SHORT'),
            algorithm: 'HS256',
            allowInvalidAsymmetricKeyTypes: false,
            allowInsecureKeySizes: false,
        });
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('SECRET_REFRESH'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN_LONG'),
            algorithm: 'HS256',
            allowInvalidAsymmetricKeyTypes: false,
            allowInsecureKeySizes: false,
        }); 
        return {access_token, refresh_token};
    }

    public verifyToken(token: string, tokenType: 'access' | 'refresh') {
        try {
            return this.jwtService.verify(token, {
                secret:
                    tokenType === 'access'
                        ? this.configService.get<string>('SECRET_ACCESS')
                        : this.configService.get<string>('SECRET_REFRESH'),
                ignoreExpiration: false,
                algorithms: ['HS256'],
            });
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

}
