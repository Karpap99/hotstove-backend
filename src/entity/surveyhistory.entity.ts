import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne} from "typeorm"
import { BaseEntity } from "./base.entity"
import { Survey } from "./survey.entity"
import { Session } from "./session.entity"

@Entity()
export class SurveyHistory extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>Survey, survey => survey.id)
    public survey: Survey

    @JoinColumn()
    @OneToOne(()=>Session, session => session.id)
    public session: Session

    @Column()
    public sessionExpires: Date
}