import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID } from "class-validator";

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
