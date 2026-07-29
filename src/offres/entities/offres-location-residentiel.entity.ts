import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UniteLocation } from '../enums';
import { OffreLocation } from './offre-location.entity';
import { ModelChambre } from './model-chambre.entity';

@Entity('locations_residentielles')
export class LocationResidentielle {
  @PrimaryGeneratedColumn('uuid')
  id_location_residentielle: string;

  @OneToOne(
    () => OffreLocation,
    (offreLocation) => offreLocation.locationResidentielle,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_location' })
  offreLocation: OffreLocation;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  loyer: number;

  @Column({
    type: 'enum',
    enum: UniteLocation,
    default: UniteLocation.MOIS,
  })
  unite_location: UniteLocation;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  caution: number;

  @Column({
    default: false,
  })
  meuble: boolean;

  

  @OneToMany(
    () => ModelChambre,
    (modelChambre) => modelChambre.location,
    {
      cascade: true,
    },
  )
  modelsChambres: ModelChambre[];
}