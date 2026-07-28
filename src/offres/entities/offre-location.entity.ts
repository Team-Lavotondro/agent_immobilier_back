import { ChildEntity, Column } from 'typeorm';
import { Offre } from './offre.entity';
import { TypeLocation, UniteLocation } from '../enums';

@ChildEntity('location')
export class OffreLocation extends Offre {
  @Column({
    type: 'enum',
    enum: TypeLocation,
    default: TypeLocation.RESIDENTIEL,
    nullable: true,
  })
  type_location: TypeLocation;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  loyer_mensuel: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  tarif_evenement: number;

  @Column({
    type: 'enum',
    enum: UniteLocation,
    default: UniteLocation.MOIS,
    nullable: true,
  })
  unite_location: UniteLocation;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commission: number;

  @Column({ type: 'boolean', default: false })
  meuble: boolean;

  @Column({ type: 'int', nullable: true })
  capacite_accueil: number;

  @Column({ type: 'simple-array', nullable: true })
  equipements_evenement: string[];
}
