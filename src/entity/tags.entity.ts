import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Tag } from "./tag.entity"
import { Survey } from "./survey.entity"

@Entity()
export class Tags extends BaseEntity{


    @JoinColumn()
    @OneToOne(()=>Tag, tag => tag.id)
    tag: Tag

    @JoinColumn()
    @OneToOne(()=>Survey, survey => survey.id)
    survey: Survey
}