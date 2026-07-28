import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offre } from './offre.entity';

@Entity('model_chambres')
export class ModelChambre {
  @PrimaryGeneratedColumn('uuid')
  id_model_ch: string;

  @Column({ nullable: false })
  nom_model_ch: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  prix_model_ch: number;

  @Column({ nullable: true })
  description_model_ch: string;

  @Column({ type: 'int', default: 1 })
  nb_pieces: number;

  @Column({ type: 'float', nullable: true })
  superficie: number;

  @Column({ type: 'int', default: 1 })
  quantite_totale: number;

  @Column({ type: 'int', default: 1 })
  quantite_disponible: number;

  @Column({ type: 'boolean', default: true })
  is_dispo: boolean;

  @ManyToOne(() => Offre, (offre) => offre.modelsChambres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_offre' })
  offre: Offre;
}
