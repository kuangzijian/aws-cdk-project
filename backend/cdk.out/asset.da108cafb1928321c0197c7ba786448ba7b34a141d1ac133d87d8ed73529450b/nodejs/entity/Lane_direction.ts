import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm"
import { Lane } from "./Lane"


@Entity()
export class Lane_direction{
    @PrimaryGeneratedColumn()
    lane_direction_id: number

    @OneToMany(() => Lane, lane => lane.lane_direction)
    lanes: Lane[]

    @Column("text", { nullable: true })
    lane_direction_name: string
}