import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Tag } from "./tag.entity"
import { Post } from "./post.entity"

@Entity()
export class PostTag extends BaseEntity{
   @ManyToOne(() => Tag, tag => tag.postTags, {onDelete: 'CASCADE'})
    tag: Tag;

    @ManyToOne(() => Post, post => post.tags, {onDelete: 'CASCADE'})
    post: Post;

}