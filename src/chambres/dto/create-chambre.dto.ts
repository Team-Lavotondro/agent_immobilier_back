import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChambreDto {
  @ApiProperty({
    description: 'Référence unique de la chambre',
    example: 'CH-101',
  })
  @IsNotEmpty()
  @IsString()
  ref_chambre: string;

  @ApiProperty({
    description: 'Disponibilité de la chambre',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_dispo?: boolean;

  @ApiProperty({
    description: 'ID du modèle de chambre associé',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty()
  @IsUUID()
  id_model_ch: string;

  @ApiProperty({
    description: "ID de l'offre associée",
    example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id_offre?: string;
}
