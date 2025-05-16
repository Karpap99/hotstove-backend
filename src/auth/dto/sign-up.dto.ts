import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsPhoneNumber, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsString()
    public login: string;

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

    @ApiProperty()
    @IsString()
    public password2: string;
}