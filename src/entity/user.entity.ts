import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { BaseEntity } from "./base.entity"

@Entity()
export class User extends BaseEntity {
    @Column()
    email: string

    @Column()
    password: string

    @Column()
    nickname: string

    @Column()
    profile_picture: string

    @Column()
    description: string

    @Column()
    age: number

    @Column()
    region: string

}
