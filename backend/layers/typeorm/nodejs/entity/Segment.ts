import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn } from "typeorm"


@Entity()
export class Segment{
    @PrimaryGeneratedColumn()
    segment_id: number

    @Column("text", { nullable: true })
    url: string
    
}