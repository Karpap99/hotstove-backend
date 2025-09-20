import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Post } from "./post.entity";
import { User } from "./user.entity";
import { SubMessage } from "./submessage.entity";
import { MessageLike } from "./messageLike.entity";

@Entity()
export class Message extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.messages, { onDelete: "CASCADE" })
  post: Post;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: "CASCADE" })
  user: User;

  @Column()
  text: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  submessagesCount: number;

  @OneToMany(() => SubMessage, (submessage) => submessage.message)
  submessages: SubMessage[];

  @OneToMany(() => MessageLike, (like) => like.message)
  likes: MessageLike[];
}
