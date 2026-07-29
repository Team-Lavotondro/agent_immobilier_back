import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';
import { TypeOffre } from '../enums';

export class CreateOffreVenteDto {
  @ApiProperty({
    description: "ID de l'utilisateur ayant publié l'offre",
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty()
  @IsUUID()
  id_util: string;

  @ApiProperty({
    description: "Nom de l'offre",
    example: 'Villa moderne à vendre',
  })
  @IsNotEmpty()
  @IsString()
  nom_offre: string;

  @ApiProperty({
    description: "Description de l'offre",
    example: 'Grande villa avec piscine, garage et jardin privé.',
  })
  @IsNotEmpty()
  @IsString()
  description_offre: string;

  @ApiProperty({
    description: "Prix de vente de l'offre (Ar)",
    example: 150000000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  prix_vente: number;

  @ApiProperty({
    description: 'Superficie du bien (en m²)',
    example: 250.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  superficie?: number;

  @ApiProperty({
    description: 'Nombre de pièces dans la propriété',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  nbre_piece?: number;

  @ApiProperty({
    description: 'Adresse exacte du bien',
    example: 'Lot II A 73 Bis',
    required: false,
  })
  @IsOptional()
  @IsString()
  adresse_offre?: string;

  @ApiProperty({
    description: 'Quartier / lieu du bien',
    example: 'Andrainjato',
  })
  @IsNotEmpty()
  @IsString()
  lieu: string;

  @ApiProperty({
    description: 'Nom de la ville où se trouve le bien',
    example: 'Fianarantsoa',
  })
  @IsNotEmpty()
  @IsString()
  ville: string;

  @ApiProperty({
    description: "URL de l'image principale de l'offre",
    example:
      'https://xyz.supabase.co/storage/v1/object/public/offres/villa.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  image_principale: string;

  @ApiProperty({
    description: 'URLs des images secondaires',
    example: [
      'https://xyz.supabase.co/offres/img1.jpg',
      'https://xyz.supabase.co/offres/img2.jpg',
    ],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({
    description: 'Caractéristiques générales du bien',
    example: ['Piscine', 'Garage', 'Jardin'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  caracteristiques_generale?: string[];
}
