import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offre } from './offre.entity';

@Entity('offres_ventes')
export class OffreVente {
  @PrimaryGeneratedColumn('uuid')
  id_vente: string;

  @OneToOne(() => Offre, (offre) => offre.offreVente, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_offre' })
  offre: Offre;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  prix_vente: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  superficie: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  nbre_piece: number;

  @Column({
    nullable: true,
  })
  type_bien: string;
}