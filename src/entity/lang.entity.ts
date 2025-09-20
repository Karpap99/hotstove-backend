import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class Lang extends BaseEntity {
  @Column()
  title: string;
  translations: any;
}
