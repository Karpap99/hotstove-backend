import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Post } from "./post.entity"
import { User } from "./user.entity"
import { Message } from "./message.entity"
import { SubmessageLikes } from "./submessageLike.entity"

@Entity()
export class SubMessage extends BaseEntity{

    @ManyToOne(()=>Message, message => message.submessages, { onDelete: 'CASCADE' })
    message: Message

    @JoinColumn()
    @ManyToOne(()=>User, user=>user.subMessages)
    user: User

    @ManyToOne(() => User, user => user.receivedSubMessages, { onDelete: 'CASCADE' })
    @JoinColumn()
    receiver: User;

    @Column()
    text: string

    @Column({default: 0})
    likesCount: number
     
    @OneToMany(()=>SubmessageLikes, like => like.message)
    likes: SubmessageLikes[]
}