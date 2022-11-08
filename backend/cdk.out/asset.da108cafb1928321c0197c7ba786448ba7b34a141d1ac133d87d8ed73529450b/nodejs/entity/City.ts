import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn } from "typeorm"
import { State } from  "./State"
import { Street } from "./Street"

@Entity()
export class City{
    @PrimaryGeneratedColumn()
    city_id: number

    @Column("text", { nullable: true })
    city_name: string

    @ManyToOne(() => State, (state) => state.cities)
    @JoinColumn({ name: "state_id" })
    state: State
    
    @OneToMany(() => Street, (street) => street.city)
    streets: Street[]
}