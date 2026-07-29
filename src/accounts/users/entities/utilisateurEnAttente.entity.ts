import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('utilisateurs_en_attente')
export class UtilisateurEnAttente {
  @PrimaryGeneratedColumn('uuid')
  id_util: string;

  @Column({ nullable: true })
  nom_util: string;

  @Column({ nullable: false })
  email_util: string;

  @Column({ nullable: false })
  mdp_util: string;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false, type: 'timestamp' })
  expiredAt: Date;
}
