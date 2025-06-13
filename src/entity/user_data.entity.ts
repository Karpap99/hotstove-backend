import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"

@Entity()
export class User_Data extends BaseEntity {

    @JoinColumn()
    @OneToOne(()=>User, user => user.id)
    user: User

    @Column({default:""})
    profile_picture: string

    @Column({default:""})
    description: string

    @Column({default:new Date()})
    age: Date
}