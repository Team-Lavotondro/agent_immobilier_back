import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffresService } from './offres.service';
import { OffresController } from './offres.controller';
import { Offre } from './entities/offre.entity';
import { OffreVente } from './entities/offre-vente.entity';
import { OffreLocation } from './entities/offre-location.entity';
import { ImageOffres } from './entities/offre-image.entity';
import { ModelChambre } from './entities/model-chambre.entity';
import { Utilisateur } from '../accounts/users/entities/utilisateur.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Offre,
      OffreVente,
      OffreLocation,
      ImageOffres,
      ModelChambre,
      Utilisateur,
    ]),
    AccountsModule,
  ],
  controllers: [OffresController],
  providers: [OffresService],
  exports: [OffresService],
})
export class OffresModule {}
