import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports : [TypeOrmModule.forFeature([Reservation])]
})
export class ReservationModule {}
