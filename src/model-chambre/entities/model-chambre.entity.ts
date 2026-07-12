import { Chambre } from 'src/chambres/entities/chambre.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('model_chambres')
export class ModelChambre {
  @PrimaryGeneratedColumn('uuid')
  id_model_ch: string;

  @Column({ nullable: false })
  nom_model_ch: string;

  @Column({ nullable: false })
  prix_model_ch: number;

  @Column({ nullable: false })
  description_model_ch: string;

  @Column({ nullable: false })
  img_model_ch: string;

  @OneToMany(() => Chambre, (chambre) => chambre.model_chambre)
  chambres: Chambre[];
}
