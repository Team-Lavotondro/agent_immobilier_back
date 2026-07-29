import { Favoris } from 'src/favoris/entities/favoris.entity';
import { Offre } from 'src/offres/entities/offre.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('utilisateurs')
export class Utilisateur {
  @PrimaryGeneratedColumn('uuid')
  id_util: string;

  @Column({ nullable: true, unique: true })
  id_google: string;

  @Column({ nullable: true })
  nom_util: string;

  @Column({ nullable: false, unique: true })
  email_util: string;

  @Column({ nullable: true })
  num_tel_util: string;

  @Column({ nullable: true })
  mdp_util: string;

  @Column({ nullable: false, default: 'user' })
  role: string;

  @Column({ default: false })
  espace_vente: boolean;

  @OneToMany(() => Offre, (offre) => offre.utilisateur)
  offres: Offre[];

  @OneToMany(() => Reservation, (reservation) => reservation.utilisateur)
  reservations: Reservation[];

  @OneToMany(() => Favoris, (favoris) => favoris.utilisateur)
  favoris: Favoris[];
}
