import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('utilisateursEnAttente')
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

  @Column({nullable:false,type :'timestamp'})
  expiredAt: Date;

}