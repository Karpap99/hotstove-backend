import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity()
@Unique(["post", "likeBy"])
export class Likes extends BaseEntity {
  @JoinColumn()
  @ManyToOne(() => Post, (post) => post.likes, { onDelete: "CASCADE" })
  post: Post;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  likeBy: User;
}
