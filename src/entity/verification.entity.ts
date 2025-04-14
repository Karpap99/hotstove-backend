import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class Verifivation{
    @PrimaryGeneratedColumn()
    public id: number
    
    @OneToOne(()=>User, user => user.id)
    public user_id: User

    @Column()
    public access_token: string

    @Column()
    public access_token_created_at: Date

    @Column()
    public refresh_token: string


    @Column()
    public refresh_token_created_at: Date

    
}