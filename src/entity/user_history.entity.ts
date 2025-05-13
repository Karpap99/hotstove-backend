import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"
import { Post } from "./post.entity"

@Entity()
export class User_history extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>User, user => user.id)
    user: User


    @JoinColumn()
    @OneToOne(()=>Post, post=>post.id)
    post: Post
}