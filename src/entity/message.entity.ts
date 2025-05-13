import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Post } from "./post.entity"
import { User } from "./user.entity"

@Entity()
export class Lang extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>Post, post => post.id)
    post: Post

    @JoinColumn()
    @OneToOne(()=>User, user=>user.id)
    user: User

    @Column()
    text: string
}