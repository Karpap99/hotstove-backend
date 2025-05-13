import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Tag } from "./tag.entity"
import { Lang } from "./lang.entity"

@Entity()
export class Tag_t extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>Tag, tag => tag.id)
    tagId: Tag

    @JoinColumn()
    @OneToOne(()=>Lang, lang => lang.id)
    langId: Lang

    @Column()
    translate: string
}