import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm"
import { Lane } from "./Lane"

@Entity()
export class Lane_position{
    @PrimaryGeneratedColumn()
    lane_position_id: number

    @OneToMany(() => Lane, lane => lane.lane_position)
    lanes: Lane[]

    @Column("text", { nullable: true })
    lane_position_name: string

}