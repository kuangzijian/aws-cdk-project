import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn, CreateDateColumn } from "typeorm"
import { Lane } from "./Lane"
import { Segment } from "./Segment"


@Entity()
export class Lane_collection{

    @PrimaryGeneratedColumn()
    lane_collection_id: number

    @ManyToOne(() => Lane, lane => lane.lane_collections)
    @JoinColumn({ name: "lane_id" })
    lane: Lane

    @OneToMany(() => Segment, segment => segment.lane_collection)
    segments: Segment[]

    @Column("datetime")
    collection_datetime: string

}