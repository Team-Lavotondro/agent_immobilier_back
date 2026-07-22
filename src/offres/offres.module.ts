import { Module } from '@nestjs/common';
import { OffresService } from './offres.service';
import { OffresController } from './offres.controller';
import { Offre } from './entities/offre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from '../accounts/users/entities/utilisateur.entity';
import { Chambre } from '../chambres/entities/chambre.entity';
import { ModelChambre } from '../model-chambre/entities/model-chambre.entity';
import { ImageOffres } from './entities/offre-image.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  controllers: [OffresController],
  providers: [OffresService],
  imports: [
    TypeOrmModule.forFeature([Offre, Utilisateur, Chambre, ModelChambre, ImageOffres]),
    AccountsModule,
  ],
})
export class OffresModule {}
