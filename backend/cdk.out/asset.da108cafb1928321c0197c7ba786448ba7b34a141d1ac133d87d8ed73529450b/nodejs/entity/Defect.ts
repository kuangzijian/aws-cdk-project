import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn } from "typeorm"
import { Defect_type } from "./Defect_type"
import { Segment } from "./Segment"


@Entity()
export class Defect{
    @PrimaryGeneratedColumn()
    defect_id: number

    @ManyToOne(() => Defect_type, detect_type => detect_type.defects)
    @JoinColumn({ name: "defect_type_id" })
    defect_type: Defect_type
    
    @ManyToOne(() => Segment, segment => segment.defects)
    @JoinColumn({ name: "segment_id" })
    segment: Segment
    
    @Column("double")
    area: number
    
    @Column("text", { nullable: true })
    defects_url: string

}