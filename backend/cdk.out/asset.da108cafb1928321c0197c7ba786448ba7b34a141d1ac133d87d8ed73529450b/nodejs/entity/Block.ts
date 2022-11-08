import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn } from "typeorm"
import { Street } from  "./Street"
import { Coordinate } from  "./Coordinate"
import { Lane } from "./Lane"


@Entity()
export class Block{
    @PrimaryGeneratedColumn()
    block_id: number
    
    @Column("text", { nullable: true })
    polyline_code: string

    @ManyToOne(() => Street, (street) => street.blocks)
    @JoinColumn({ name: "street_id" })
    street: Street

    @Column("double")
    start_latitude: number

    @Column("double")
    start_longitude: number

    @Column("double")
    end_latitude: number

    @Column("double")
    end_longitude: number
    
    @Column("text", { nullable: true })
    total_lanes: number

    @Column("text", { nullable: true })
    direction: string

    @Column("text", { nullable: true })
    severity: string
    
    @Column("double", { nullable: true })
    severity_index: number


    @OneToMany(() => Coordinate, coordinate => coordinate.block)
    coordinates: Coordinate[]

    @OneToMany(() => Lane, lane => lane.block)
    lanes: Lane[]
}