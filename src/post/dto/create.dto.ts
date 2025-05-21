
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString,IsUUID, } from 'class-validator';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';


export class CreateDTO implements Readonly<CreateDTO> {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({ required: true })
  marking: string[]

  @ApiProperty({ required:true})
  creator: User;

  @ApiProperty({ required:true , default: 0 })
  @IsString()
  views: number;

  @ApiProperty({ required:true , default: 0 })
  @IsNumber()
  likes: number;

  

  public static from(dto: Partial<CreateDTO>) {
    const it = new CreateDTO();
    const result = Object.assign({}, it, dto)
    return result;
  }

  public static fromEntity(entity: Post) {
    return this.from({
      id: entity.id,
      creator: entity.creator,
      marking: entity.markign,
      views: entity.views,
      likes: entity.likes
    });
  }

  public toEntity() {
    const it = new Post();
    return it;
  }
}