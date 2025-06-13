
import { ApiExpectationFailedResponse, ApiProperty } from '@nestjs/swagger';
import { isEmail, IsNumber, IsOptional, isString, IsString, IsStrongPassword, IsUUID, } from 'class-validator';
import { User } from 'src/entity/user.entity';


export class ResponseDTO implements Readonly<ResponseDTO> {
  @ApiProperty({required:false})
  id: string
  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  nickname: string;

  @ApiProperty({required: false})
  profile_picture: string;

  @ApiProperty({ required:false})
  age: Date;

  @ApiProperty({required: false})
  description: string


  public static from(dto: User) {
    const it = new ResponseDTO();
    it.id = dto.id
    it.nickname = dto.nickname
    it.email = dto.email
    return it;
  }



  public toEntity() {
    const it = new User();
    it.nickname = this.nickname;
    it.lastChangedDateTime = new Date();
    it.createDateTime = new Date();
    return it;
  }
}