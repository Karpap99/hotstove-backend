import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm"
import { BaseEntity } from "./base.entity"
import { Post } from "./post.entity"
import { Likes } from "./likes.entity"
import { User_Data } from "./user_data.entity"
import { Follower } from "./follower.entity"
import { Message } from "./message.entity"
import { SubMessage } from "./submessage.entity"

@Entity()
export class User extends BaseEntity {
    @Column()
    email: string

    @Column()
    password: string

    @Column()
    nickname: string

    @Column({default: 0})
    followersCount: number
    
    @OneToOne(()=>User_Data, user_data=> user_data.user, {cascade: true})
    user_data: User_Data

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];

    @OneToMany(() => Likes, like => like.likeBy)
    likes: Likes[]

    @OneToMany(() => Follower, (f) => f.followed)
    followers: Follower[];

    @OneToMany(() => Follower, (f) => f.follower)
    following: Follower[];

    @OneToMany(()=>Message, msg => msg.user)
    messages: Message[]

    @OneToMany(()=>SubMessage, msg => msg.user)
    subMessages: SubMessage[]

    @OneToMany(() => SubMessage, sub => sub.receiver)
    receivedSubMessages: SubMessage[];
}
