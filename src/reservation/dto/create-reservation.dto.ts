import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui effectue la réservation",
    example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  })
  @IsNotEmpty()
  @IsUUID()
  id_util: string;

  @ApiProperty({
    description: "ID de l'offre réservée",
    example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  })
  @IsNotEmpty()
  @IsUUID()
  id_offre: string;

  @ApiProperty({
    description: 'Date de la réservation',
    example: '2026-07-17T12:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date_reservation?: Date;
}
