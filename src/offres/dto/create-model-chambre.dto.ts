import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateModelChambreDto {
  @ApiProperty({
    description: 'Nom du modèle de chambre / logement / salle',
    example: 'Chambre VIP',
  })
  @IsNotEmpty()
  @IsString()
  nom_model_ch: string;

  @ApiProperty({
    description: 'Prix ou loyer spécifique à ce modèle',
    example: 500000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  prix_model_ch: number;

  @ApiProperty({
    description: 'Description détaillée du modèle',
    example:
      'Grande chambre avec balcon, lit king size, climatisation et jacuzzi.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description_model_ch?: string;

  @ApiProperty({
    description: 'Nombre de pièces pour ce modèle',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  nb_pieces?: number;

  @ApiProperty({
    description: 'Superficie (en m²)',
    example: 45.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  superficie?: number;

  @ApiProperty({
    description: "Nombre total d'unités de ce modèle dans le complexe/immeuble",
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantite_totale?: number;

  @ApiProperty({
    description: "Nombre d'unités encore disponibles",
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantite_disponible?: number;

  @ApiProperty({
    description: 'Statut de disponibilité',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_dispo?: boolean;
}
