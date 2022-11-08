import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn} from "typeorm"
import { Lane_direction } from "./Lane_direction"
import { Lane_position } from "./Lane_position"
import { Lane_collection } from "./Lane_collection"
import { Block } from "./Block"

@Entity()
export class Lane{
    @PrimaryGeneratedColumn()
    lane_id: number

    @ManyToOne(() => Lane_position, lane_position => lane_position.lanes)
    @JoinColumn({ name: "lane_position_id" })
    lane_position: Lane_position

    @ManyToOne(() => Lane_direction, lane_direction => lane_direction.lanes)
    @JoinColumn({ name: "lane_direction_id" })
    lane_direction: Lane_direction


    @ManyToOne(() => Block, block => block.lanes)
    @JoinColumn({ name: "block_id" })
    block: Block

    @OneToMany(() => Lane_collection, lane_collection => lane_collection.lane)
    lane_collections: Lane_collection[]

    @Column("text", { nullable: true })
    lane_name: string

}