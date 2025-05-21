import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsPhoneNumber, IsString, IsStrongPassword, IsUUID, Length } from 'class-validator';
import { LoginDto } from './login.dto';
import { SignUpDto } from './sign-up.dto';

export class TokenDto {

    @ApiProperty()
    @IsString()
    @IsUUID()
    public uuid: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsString()
    public login: string;

    public static from(uuid: string, email: string, login: string){
        const it = new TokenDto;
        it.uuid = uuid;
        it.email = email;
        it.login = login;
        return it   
    }
}