import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm"
import { Country } from "./Country"
import { City } from "./City"

@Entity()
export class State{
    @PrimaryGeneratedColumn()
    state_id: number

    @ManyToOne(() => Country, (country) => country.states)
    @JoinColumn({ name: "country_id" })
    country: Country

    @Column("text", { nullable: true })
    state_code: string

    @OneToMany(() => City, (city) => city.state)
    cities: City[]
}
