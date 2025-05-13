
import { ApiExpectationFailedResponse, ApiProperty } from '@nestjs/swagger';
import { isEmail, IsNumber, IsOptional, IsString, IsStrongPassword, IsUUID, } from 'class-validator';
import { User } from 'src/entity/user.entity';
import { Logger } from '@nestjs/common';


export class UserDTO implements Readonly<UserDTO> {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({required: true})
  email: string;

  @ApiProperty({required: true})
  @IsStrongPassword()
  password: string


  @ApiProperty({ required: true })
  @IsString()
  nickname: string;

  @ApiProperty({ required: true })
  @IsNumber()
  age: number;

  @ApiProperty({required: true})
  @IsString()
  region: string;

  public static from(dto: Partial<UserDTO>) {
    const it = new UserDTO();
    //it.id = dto.id;
    return it;
  }

  public static fromEntity(entity: User) {
    return this.from({
      id: entity.id,
        nickname: entity.nickname,
        age: entity.age,
        region: entity.region
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