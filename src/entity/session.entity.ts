import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"
import { BaseEntity } from "./base.entity"

@Entity()
export class Session extends BaseEntity{
    @JoinColumn({name:"user_id"})
    @OneToOne(()=> User, user => user.id)
    public user: User

    @Column()
    public startTime: Date

    @Column()
    public refreshTime: Date

}