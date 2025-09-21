import { Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { SubMessage } from "./submessage.entity";

@Entity()
@Unique(["message", "user"])
export class SubmessageLikes extends BaseEntity {
  @JoinColumn()
  @ManyToOne(() => SubMessage, (message) => message.likes, {
    onDelete: "CASCADE",
  })
  message: SubMessage;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  user: User;
}
