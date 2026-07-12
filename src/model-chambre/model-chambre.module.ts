import { Module } from '@nestjs/common';
import { ModelChambreService } from './model-chambre.service';
import { ModelChambreController } from './model-chambre.controller';
import { ModelChambre } from './entities/model-chambre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ModelChambreController],
  providers: [ModelChambreService],
  imports : [TypeOrmModule.forFeature([ModelChambre])]
})
export class ModelChambreModule {}
