import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { Utilisateur } from './entities/utilisateur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
  imports : [TypeOrmModule.forFeature([Utilisateur])]
})
export class UtilisateurModule {}
