import { Entity, Column, JoinColumn, OneToOne} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Session } from "./session.entity"
import { Question } from "./question.entity"

@Entity()
export class QuestionHistory extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>Question, question => question.id)
    public question: Question

    @JoinColumn()
    @OneToOne(()=>Session, session => session.id)
    public session: Session

    @Column()
    public sessionExpires: Date
}