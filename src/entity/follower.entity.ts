import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Unique, ManyToOne} from "typeorm"
import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"

@Entity()
@Unique(['followed', 'follower'])
export class Follower extends BaseEntity{
    @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
    followed: User;
    @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
    follower: User;
}