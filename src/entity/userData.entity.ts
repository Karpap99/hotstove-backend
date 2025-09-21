import { Entity, Column, JoinColumn, OneToOne, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
@Unique(["user"])
export class UserData extends BaseEntity {
  @OneToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column({ default: "" })
  profile_picture: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  age: Date;
}
