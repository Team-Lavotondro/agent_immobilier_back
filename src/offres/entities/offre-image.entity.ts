import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Offre } from "./offre.entity";

@Entity('imageOffres')
export class ImageOffres{
    @PrimaryGeneratedColumn('uuid')
    id_image : string

    @Column()
    url_image:string

    @Column({default : false})
    is_principale : boolean

    @ManyToOne(()=>Offre,(offre)=>offre.imageOffres,{onDelete : 'CASCADE'})
    @JoinColumn({name:'id_offre'})
    offre : Offre

}   