
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, } from 'class-validator';
import { User } from 'src/entity/user.entity';

export class UserDTO implements Readonly<UserDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  firstname: string;

  @ApiProperty({ required: true })
  @IsString()
  lastname: string;

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
        firstname: entity.firstName,
        lastname: entity.lastName,
        age: entity.age,
        region: entity.region
    });
  }

  public toEntity(user: User) {
    const it = new User();
    it.id = this.id;
    it.firstName = this.firstname;
    it.lastName = this.lastname;
    it.createDateTime = new Date();
    return it;
  }
}