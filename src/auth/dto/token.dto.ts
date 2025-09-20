import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
} from "class-validator";
import { LoginDto } from "./login.dto";
import { SignUpDto } from "./sign-up.dto";

export class TokenDto {
  @ApiProperty()
  @IsUUID()
  public uuid: string;

  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public nickname: string;

  public static from(uuid: string, email: string, nickname: string) {
    const it = new TokenDto();
    it.uuid = uuid;
    it.email = email;
    it.nickname = nickname;
    return it;
  }
}
