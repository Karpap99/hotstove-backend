import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import { BaseEntity } from "./base.entity"

@Entity()
export class Post extends BaseEntity{
    @Column()
    title: string

    @Column({type:"json"})
    markign: string[]

    @Column()
    views: number

}