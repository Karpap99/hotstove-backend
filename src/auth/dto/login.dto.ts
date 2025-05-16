import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsPhoneNumber, IsString, IsStrongPassword, Length } from 'class-validator';

export class LoginDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    public email: string;


    @ApiProperty()
    @IsString()
    @IsStrongPassword({
        minLength: 7,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
        minLowercase: 1,
    })
    public password: string;

}