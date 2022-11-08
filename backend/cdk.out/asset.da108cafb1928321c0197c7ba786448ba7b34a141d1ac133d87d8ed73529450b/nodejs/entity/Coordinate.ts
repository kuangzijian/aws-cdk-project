import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm"
import { Block } from "./Block"


@Entity()
export class Coordinate{
    @PrimaryGeneratedColumn()
    coordinate_id: number

    @Column("double")
    latitude: number

    @Column("double")
    longitude: number

    @ManyToOne(() => Block, (block) => block.coordinates)
    @JoinColumn({ name: "block_id" })
    block: Block

}