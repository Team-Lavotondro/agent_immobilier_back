import { Favoris } from 'src/favoris/entities/favoris.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Utilisateur } from 'src/accounts/users/entities/utilisateur.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImageOffres } from './offre-image.entity';
import { OffreLocation } from './offre-location.entity';
import { OffreVente } from './offre-vente.entity';
import { TypeOffre } from '../enums';

@Entity('offres')
export class Offre {
  @PrimaryGeneratedColumn('uuid')
  id_offre: string;

  @Column({
    type: 'enum',
    enum: TypeOffre,
    default: TypeOffre.VENTE,
  })
  type_offre: TypeOffre;

  @Column()
  nom_offre: string;

  @Column('text')
  description_offre: string;

  @Column({ nullable: true })
  adresse_offre: string;

  @Column()
  lieu: string;

  @Column()
  ville: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  caracteristiques: string[];

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  updated_At: Date;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.offres)
  @JoinColumn({ name: 'id_util' })
  utilisateur: Utilisateur;

  @OneToMany(() => ImageOffres, (image) => image.offre, {
    cascade: true,
  })
  imageOffres: ImageOffres[];

  @OneToMany(() => Reservation, (reservation) => reservation.offre)
  reservations: Reservation[];

  @OneToMany(() => Favoris, (favoris) => favoris.offre)
  favoris: Favoris[];

  @OneToOne(() => OffreVente, (offreVente) => offreVente.offre, {
    cascade: true,
  })
  offreVente: OffreVente;

  @OneToOne(() => OffreLocation, (offreLocation) => offreLocation.offre, {
    cascade: true,
  })
  offreLocation: OffreLocation;
}
