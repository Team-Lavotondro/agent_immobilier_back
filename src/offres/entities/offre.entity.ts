import { Favoris } from 'src/favoris/entities/favoris.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Utilisateur } from 'src/accounts/users/entities/utilisateur.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { ImageOffres } from './offre-image.entity';
import { ModelChambre } from './model-chambre.entity';
import { TypeOffre } from '../enums';

@Entity('offres')
@TableInheritance({ column: { type: 'varchar', name: 'type_offre' } })
export class Offre {
  @PrimaryGeneratedColumn('uuid')
  id_offre: string;

  @Column({
    type: 'enum',
    enum: TypeOffre,
    nullable: false,
    default: TypeOffre.VENTE,
  })
  type_offre: TypeOffre;

  @Column({ nullable: false })
  nom_offre: string;

  @Column({ nullable: false })
  description_offre: string;

  @Column({ nullable: true })
  adresse_offre: string;

  @Column({ nullable: false })
  lieu: string;

  @Column({ nullable: false })
  ville: string;

  @Column({ nullable: true })
  nb_pieces_offre: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_At: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_At: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.offre)
  reservations: Reservation[];

  @OneToMany(() => Favoris, (favoris) => favoris.offre)
  favoris: Favoris[];

  @OneToMany(() => ImageOffres, (imageOffres) => imageOffres.offre, {
    cascade: true,
  })
  imageOffres: ImageOffres[];

  @OneToMany(() => ModelChambre, (modelChambre) => modelChambre.offre, {
    cascade: true,
  })
  modelsChambres: ModelChambre[];

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.offres, {
    cascade: true,
  })
  @JoinColumn({ name: 'id_util' })
  utilisateur: Utilisateur;
}
