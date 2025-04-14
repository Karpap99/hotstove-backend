


import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Survey{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    content: string

    
}