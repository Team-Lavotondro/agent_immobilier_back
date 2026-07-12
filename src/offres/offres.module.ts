import { Module } from '@nestjs/common';
import { OffresService } from './offres.service';
import { OffresController } from './offres.controller';
import { Offre } from './entities/offre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [OffresController],
  providers: [OffresService],
  imports : [TypeOrmModule.forFeature([Offre])]
})
export class OffresModule {}
