import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Post } from "./post.entity";
import { Markingdt } from "src/post/dto/types";

@Entity()
export class Marking extends BaseEntity {
  @JoinColumn()
  @OneToOne(() => Post, (post) => post.marking, {
    onDelete: "CASCADE",
    nullable: false,
  })
  post: Post;

  @Column({ type: "json" })
  marking: Markingdt;
}
