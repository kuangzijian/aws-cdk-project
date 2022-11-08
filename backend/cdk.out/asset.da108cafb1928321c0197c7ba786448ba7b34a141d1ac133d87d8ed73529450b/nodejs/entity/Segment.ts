import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn } from "typeorm"
import { Defect } from "./Defect"
import { Lane_collection } from "./Lane_collection"


@Entity()
export class Segment{
    @PrimaryGeneratedColumn()
    segment_id: number

    @Column("double")
    start_latitude: number

    @Column("double")
    start_longitude: number

    @Column("double")
    end_latitude: number

    @Column("double")
    end_longitude: number

    @Column("double")
    speed: number

    @Column("text", { nullable: true })
    perspective_url: string
    
    @Column("text", { nullable: true })
    bev_url: string
    
    @Column("text", { nullable: true })
    severity: string
    
    @Column("double", { nullable: true })
    severity_index: number

    @OneToMany(() => Defect, defect => defect.segment)
    defects: Defect[]

    @ManyToOne(() => Lane_collection, lane_collection => lane_collection.segments)
    @JoinColumn({ name: "lane_collection_id" })
    lane_collection: Lane_collection
}