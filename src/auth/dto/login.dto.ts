import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsPhoneNumber, IsString, IsStrongPassword, Length } from 'class-validator';

export class LoginDto {
    @IsEmail()
    public email: string;

    @IsStrongPassword({
         minLength: 4,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
        minLowercase: 1,
    })
    public password: string;

    public static from(email: string, password: string){
        const it = new LoginDto()
        it.email = email;
        it.password = password
        return it

    }

}