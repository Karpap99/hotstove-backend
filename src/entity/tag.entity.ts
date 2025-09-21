import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { PostTag } from "./postTag.entity";
import { TagTranslation } from "./tagTranslation.entity";

@Entity()
export class Tag extends BaseEntity {
  @Column()
  content: string;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];

  @OneToMany(() => TagTranslation, (translation) => translation.tag)
  translations: TagTranslation[];
}
