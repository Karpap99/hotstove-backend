import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Survey } from "./survey.entity"

@Entity()
export class Question{
    @PrimaryGeneratedColumn()
    public id: number
    
    @Column()
    public content: string

    @JoinColumn({name:"survey_id"})
    @OneToOne(() => Survey, survey => survey.id)
    public survey : Survey

}