import { Entity, Column, JoinColumn, OneToOne} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Session } from "./session.entity"
import { Answer } from "./answer.entity"

@Entity()
export class AnswerHistory extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>Answer, answer => answer.id)
    public answer: Answer

    @JoinColumn()
    @OneToOne(()=>Session, session => session.id)
    public session: Session

    @Column()
    public sessionExpires: Date
}