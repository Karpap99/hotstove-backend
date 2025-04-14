import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { Question } from "./question.entity"

@Entity()
export class Answer{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    content: string

    @JoinColumn({name:"question_id"})
    @OneToOne(()=>Question, question => question.id)
    public question: Question;
}