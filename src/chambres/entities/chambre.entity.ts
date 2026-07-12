import { ModelChambre } from 'src/model-chambre/entities/model-chambre.entity';
import { Offre } from 'src/offres/entities/offre.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chambres')
export class Chambre {
  @PrimaryGeneratedColumn('uuid')
  id_chambre: string;

  @Column({ nullable: false })
  ref_chambre: string;

  @Column({ nullable: false, default: true })
  is_dispo: boolean;

  @ManyToOne(() => Offre, (offre) => offre.chambres)
  @JoinColumn({ name: 'id_offre' })
  offre: Offre;

  @ManyToOne(() => ModelChambre, (model_chambre) => model_chambre.chambres)
  @JoinColumn({ name: 'id_model_ch' })
  model_chambre: ModelChambre;
}
