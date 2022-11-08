import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn } from "typeorm"
import { Block } from "./Block"
import { City } from  "./City"

@Entity()
export class Street{
    @PrimaryGeneratedColumn()
    street_id: number

    @ManyToOne(() => City, city => city.streets)
    @JoinColumn({ name: "city_id" })
    city: City

    @OneToMany(() => Block, block => block.street)
    blocks: Block[]

    @Column("text", { nullable: true })
    street_name: string

    @Column("text", { nullable: true })
    address: string

}