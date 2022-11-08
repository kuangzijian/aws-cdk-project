import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm"
import { State } from  "./State"

@Entity()
export class Country{
    @PrimaryGeneratedColumn()
    country_id: number

    @Column("text", { nullable: true })
    country_name: string

    @OneToMany(() => State, (state) => state.country)
    states: State[]
}