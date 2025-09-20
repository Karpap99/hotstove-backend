import { Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";
import { BaseEntity } from "./base.entity";

@Entity()
@Unique(["message", "user"])
export class MessageLike extends BaseEntity {
  @JoinColumn()
  @ManyToOne(() => Message, (message) => message.likes, { onDelete: "CASCADE" })
  message: Message;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  user: User;
}
