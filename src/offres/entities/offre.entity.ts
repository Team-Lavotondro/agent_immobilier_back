import { Chambre } from 'src/chambres/entities/chambre.entity';
import { Favoris } from 'src/favoris/entities/favoris.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('offres')
export class Offre {
  @PrimaryGeneratedColumn('uuid')
  id_offre: string;

  @Column({ nullable: false, default: 'location' })
  type_offre: string;

  @Column({ nullable: false })
  nom_offre: string;

  @Column({ nullable: false })
  description_offre: string;

  @Column({ nullable: false })
  img_offre: number;

  @Column({ nullable: true })
  prix_vente: number;

  @Column({ nullable: false })
  nb_pieces_offre: number;

  @Column({ nullable: false })
  adress_offre: string;

  @Column({ nullable: false })
  localisation: string;

  @OneToMany(() => Reservation, (reservation) => reservation.offre)
  reservations: Reservation[];

  @OneToMany(() => Favoris, (favoris) => favoris.offre)
  favoris: Favoris[];

  @OneToMany(() => Chambre, (chambre) => chambre.offre)
  chambres: Chambre[];

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.offres)
  @JoinColumn({ name: 'id_util' })
  utilisateur: Utilisateur;
}
