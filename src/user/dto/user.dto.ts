import { ApiExpectationFailedResponse, ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  isEmail,
  IsNumber,
  IsOptional,
  isString,
  IsString,
  IsStrongPassword,
  IsUUID,
} from "class-validator";
import { User } from "src/entity/user.entity";

export class UserDTO implements Readonly<UserDTO> {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  nickname: string;

  public static from(dto: Partial<UserDTO>) {
    const it = new UserDTO();
    const result = Object.assign({}, it, dto);
    return result;
  }

  public static fromEntity(entity: User) {
    return this.from({
      id: entity.id,
      nickname: entity.nickname,
    });
  }

  public toEntity() {
    const it = new User();
    it.id = this.id;
    it.nickname = this.nickname;
    it.lastChangedDateTime = new Date();
    it.createDateTime = new Date();
    return it;
  }
}
