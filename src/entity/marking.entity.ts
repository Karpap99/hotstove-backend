import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
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
