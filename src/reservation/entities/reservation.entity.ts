import { Offre } from 'src/offres/entities/offre.entity';
import { Utilisateur } from 'src/accounts/users/entities/utilisateur.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity("reservations")
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id_reservation: string;

  @Column({ nullable: false, default:()=>"CURRENT_TIMESTAMP" })
  date_reservation: Date;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.reservations)
  @JoinColumn({ name: 'id_util' })
  utilisateur: Utilisateur;

  @ManyToOne(() => Offre, (offre) => offre.reservations)
  @JoinColumn({ name: 'id_offre' })
  offre: Offre;
}
