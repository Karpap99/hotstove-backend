import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { User } from "./user.entity"
import { BaseEntity } from "./base.entity"

@Entity()
export class Verifivation extends BaseEntity{
    @JoinColumn()
    @OneToOne(()=>User, user => user.id)
    public user_id: User

    @Column()
    public access_token: string

    @Column()
    public refresh_token: string


    
}