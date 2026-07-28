import { ChildEntity, Column } from 'typeorm';
import { Offre } from './offre.entity';

@ChildEntity('vente')
export class OffreVente extends Offre {
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  prix_vente: number;

  @Column({ type: 'float', nullable: true })
  superficie: number;
}
