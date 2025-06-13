import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Tags } from "./tags.entity"

@Entity()
export class Tag extends BaseEntity{
    @Column()
    content: string

    @OneToMany(()=>Tags, tag=>tag.tag, {cascade: true, eager: true})
    tags:Tags[]
}