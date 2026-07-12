import { Offre } from 'src/offres/entities/offre.entity';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favoris')
export class Favoris {
  @PrimaryGeneratedColumn('uuid')
  id_favoris: string;

  @Column({ nullable: false, default: ()=>'CURRENT_TIMESTAMP' })
  date_favoris: Date;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.favoris)
  @JoinColumn({ name: 'id_util' })
  utilisateur: Utilisateur;

  @ManyToOne(() => Offre, (offre) => offre.favoris)
  @JoinColumn({ name: 'id_offre' })
  offre: Offre;
}
