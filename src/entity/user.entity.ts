import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { BaseEntity } from "./base.entity"
import { Post } from "./post.entity"
import { Likes } from "./likes.entity"

@Entity()
export class User extends BaseEntity {
    @Column()
    email: string

    @Column()
    password: string

    @Column()
    nickname: string
    
    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];

    @OneToMany(() => Likes, like => like.likeBy)
    likes: Likes[]
}
