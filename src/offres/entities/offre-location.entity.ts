import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offre } from './offre.entity';
import { TypeLocation } from '../enums';
import { LocationResidentielle } from './offres-location-residentiel.entity';

@Entity('offres_locations')
export class OffreLocation {
  @PrimaryGeneratedColumn('uuid')
  id_location: string;

  @OneToOne(() => Offre, (offre) => offre.offreLocation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_offre' })
  offre: Offre;

  @Column({
    type: 'enum',
    enum: TypeLocation,
  })
  type_location: TypeLocation;

  @OneToOne(
    () => LocationResidentielle,
    (locationResidentielle) => locationResidentielle.offreLocation,
    {
      cascade: true,
    },
  )
  locationResidentielle: LocationResidentielle;
}