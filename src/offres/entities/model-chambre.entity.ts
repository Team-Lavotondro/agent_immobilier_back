import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationResidentielle } from './offres-location-residentiel.entity';

@Entity('model_chambres')
export class ModelChambre {
  @PrimaryGeneratedColumn('uuid')
  id_model_ch: string;

  @Column()
  nom_model_ch: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  prix_model_ch: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description_model_ch: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  nb_pieces: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  superficie: number;

  @Column({
    type: 'int',
    default: 1,
  })
  quantite_totale: number;

  @Column({
    type: 'int',
    default: 1,
  })
  quantite_disponible: number;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  caracteristiques_specifique: string[];

  @ManyToOne(
    () => LocationResidentielle,
    (location) => location.modelsChambres,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_location_residentielle' })
  location: LocationResidentielle;
}
