import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Like} from "typeorm"
import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"
import { Tags } from "./tags.entity"
import { Tag } from "./tag.entity"
import { Likes } from "./likes.entity"

@Entity()
export class Post extends BaseEntity{
    @Column()
    title: string

    @Column()
    description: string


    @Column({default: ''})
    title_picture: string
    
    @JoinColumn()
    @ManyToOne(()=>User, user=>user.id)
    creator: User

    @OneToMany(()=>Tags, tags=>tags.post, {cascade: true, eager: true})
    tags:Tags[]

    @Column({default: 0})
    views: number

    @Column({default: 0})
    likeCount: number

    @OneToMany(() => Likes, likes => likes.post)
    likes: Likes[]

    

}