import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm"
import { Defect } from "./Defect"


@Entity()
export class Defect_type{
    
    @PrimaryGeneratedColumn()
    defect_type_id: number

    @Column("text", { nullable: true })
    defect_type_name: string

    @OneToMany(() => Defect, defect => defect.defect_type)
    defects: Defect[]

}