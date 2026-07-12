import { Module } from '@nestjs/common';
import { ChambresService } from './chambres.service';
import { ChambresController } from './chambres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chambre } from './entities/chambre.entity';

@Module({
  controllers: [ChambresController],
  providers: [ChambresService],
  imports : [TypeOrmModule.forFeature([Chambre])]
})
export class ChambresModule {}
