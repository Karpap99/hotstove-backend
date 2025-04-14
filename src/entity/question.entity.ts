import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Survey } from "./survey.entity"
import { BaseEntity } from "./base.entity"

@Entity()
export class Question extends BaseEntity{
    
    @Column()
    public content: string

    @JoinColumn({name:"survey_id"})
    @OneToOne(() => Survey, survey => survey.id)
    public survey : Survey

}