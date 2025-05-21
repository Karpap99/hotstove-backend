import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"
import { Post } from "./post.entity"

@Entity()
export class Likes extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>Post, post => post.id)
    post: Post

    @JoinColumn()
    @OneToOne(()=>User, user => user.id)
    likeBy: User
}