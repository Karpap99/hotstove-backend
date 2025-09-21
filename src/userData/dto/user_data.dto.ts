import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { User } from "src/entity/user.entity";
import { User_Data } from "src/entity/userData.entity";

export class UserDataDTO implements Readonly<UserDataDTO> {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({ required: false })
  user: User;

  @ApiProperty({ required: true, default: new Date() })
  @IsNumber()
  age: Date;

  @ApiProperty({ required: false, default: "" })
  @IsString()
  profile_picture: string;

  @ApiProperty({ required: false, default: "" })
  @IsString()
  description: string;

  public static from(dto: Partial<UserDataDTO>) {
    const it = new UserDataDTO();
    const result = Object.assign({}, it, dto);
    return result;
  }

  public static fromEntity(entity: User_Data) {
    return this.from({
      id: entity.id,
      age: entity.age,
    });
  }

  public toEntity() {
    const it = new User_Data();
    it.id = this.id;
    it.lastChangedDateTime = new Date();
    it.createDateTime = new Date();
    return it;
  }
}
