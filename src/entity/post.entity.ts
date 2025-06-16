import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, Like} from "typeorm"
import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"
import { Likes } from "./likes.entity"
import { Message } from "./message.entity"
import { PostTag } from "./postTag.entity"

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

    @OneToMany(()=>PostTag, tags=>tags.post, {cascade: true, eager: true})
    tags:PostTag[]

    @Column({default: 0})
    views: number

    @Column({default: 0})
    likeCount: number

    @Column({default: 0})
    messagesCount: number

    @OneToMany(() => Likes, likes => likes.post,)
    likes: Likes[]


    @OneToMany(()=>Message, msg => msg.post)
    messages: Message[]

    

}