import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"
import { BaseEntity } from "./base.entity"

@Entity()
export class Survey extends BaseEntity{
    @Column()
    content: string
}