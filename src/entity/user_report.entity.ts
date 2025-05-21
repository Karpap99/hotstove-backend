import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Post } from "./post.entity"
import { User } from "./user.entity"

@Entity()
export class UserReport extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>User, user=>user.id)
    reportedBy: User

    @JoinColumn()
    @OneToOne(()=>User, user=>user.id)
    reported: User

    @Column()
    reason: string
}