import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Post } from "./post.entity"
import { User } from "./user.entity"
import { SubMessage } from "./submessage.entity"

@Entity()
export class Message extends BaseEntity{
    @ManyToOne(()=>Post, post => post.id)
    post: Post

    @ManyToOne(()=>User, user=>user.messages)
    user: User

    @Column()
    text: string

    @Column({default: 0})
    likes: number

    @OneToMany(()=>SubMessage, submessage => submessage.message)
    submessages: SubMessage[]
}