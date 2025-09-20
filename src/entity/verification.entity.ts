import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Verification extends BaseEntity {
  @Column()
  email: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  verified: boolean;
}
