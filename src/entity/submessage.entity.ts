import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Post } from "./post.entity"
import { User } from "./user.entity"
import { Message } from "./message.entity"

@Entity()
export class SubMessage extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>Message, message => message.id)
    message: Message

    @JoinColumn()
    @OneToOne(()=>User, user=>user.id)
    user: User

    @Column()
    text: string
}