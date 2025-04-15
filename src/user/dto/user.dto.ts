
import { ApiExpectationFailedResponse, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, } from 'class-validator';
import { User } from 'src/entity/user.entity';
import { Logger } from '@nestjs/common';


export class UserDTO implements Readonly<UserDTO> {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  lastName: string;

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
        firstName: entity.firstName,
        lastName: entity.lastName,
        age: entity.age,
        region: entity.region
    });
  }

  public toEntity() {

    const it = new User();
    it.id = this.id;
    it.firstName = this.firstName;
    it.lastName = this.lastName;
    it.lastChangedDateTime = new Date();
    it.createDateTime = new Date();
    return it;
  }
}