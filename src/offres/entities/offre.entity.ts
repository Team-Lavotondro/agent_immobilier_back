import { Chambre } from 'src/chambres/entities/chambre.entity';
import { Favoris } from 'src/favoris/entities/favoris.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Utilisateur } from 'src/accounts/users/entities/utilisateur.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageOffres } from './offre-image.entity';

@Entity('offres')
export class Offre {
  @PrimaryGeneratedColumn('uuid')
  id_offre: string;

  @Column({ nullable: false, default: 'location' ,type : 'enum',enum : ['location','vente']})
  type_offre: string;

  @Column({ nullable: false })
  nom_offre: string;

  @Column({ nullable: false })
  description_offre: string;

  @Column({ nullable: true })
  prix_vente: number;

  @Column({ nullable: true })
  nb_pieces_offre: number;

  @Column({ nullable: true })
  adresse_offre: string;

  @Column({ nullable: false })
  lieu: string;

  @Column({ nullable: false })
  ville: string;

  @OneToMany(() => Reservation, (reservation) => reservation.offre)
  reservations: Reservation[];

  @OneToMany(() => Favoris, (favoris) => favoris.offre)
  favoris: Favoris[];

  @OneToMany(() => ImageOffres, (imageOffres) => imageOffres.offre,{cascade:true})
  imageOffres: ImageOffres[];

  @OneToMany(() => Chambre, (chambre) => chambre.offre)
  chambres: Chambre[];

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.offres,{cascade:true})
  @JoinColumn({ name: 'id_util' })
  utilisateur: Utilisateur;
}
