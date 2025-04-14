import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { BaseEntity } from "./base.entity"

@Entity()
export class User extends BaseEntity {

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

    @Column()
    region: string

}
