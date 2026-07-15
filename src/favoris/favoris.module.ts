import { Module } from '@nestjs/common';
import { FavorisService } from './favoris.service';
import { FavorisController } from './favoris.controller';
import { Favoris } from './entities/favoris.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FavorisController],
  providers: [FavorisService],
  imports : [TypeOrmModule.forFeature([Favoris])]
})
export class FavorisModule {}
