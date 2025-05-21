import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"

@Entity()
export class Follows extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>User, user => user.id)
    followed: User

    @JoinColumn()
    @OneToOne(()=>User, user => user.id)
    follower: User
}