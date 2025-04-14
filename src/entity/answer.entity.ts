import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { Question } from "./question.entity"
import { BaseEntity } from "./base.entity";

@Entity()
export class Answer extends BaseEntity{ 
    @Column()
    content: string

    @JoinColumn({name:"question_id"})
    @OneToOne(()=>Question, question => question.id)
    public question: Question;
}