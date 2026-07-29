import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { TypeLocation } from '../enums';
import { CreateLocationResidentielleDto } from './create-location-residentielle.dto';

export class CreateOffreLocationDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui crée l'offre",
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty()
  @IsUUID()
  id_util: string;

  @ApiProperty({
    description: 'Nom de la location',
    example: 'Résidence universitaire ABC',
  })
  @IsNotEmpty()
  @IsString()
  nom_offre: string;

  @ApiProperty({
    description: 'Description générale de la location',
    example: 'Résidence proche de toutes commodités',
  })
  @IsNotEmpty()
  @IsString()
  description_offre: string;

  @ApiProperty({
    enum: TypeLocation,
    example: TypeLocation.RESIDENTIEL,
  })
  @IsEnum(TypeLocation)
  type_location: TypeLocation;

  @ApiProperty({
    description: 'Adresse exacte',
    required: false,
  })
  @IsOptional()
  @IsString()
  adresse_offre?: string;

  @ApiProperty({
    description: 'Lieu',
    example: 'Ankorondrano',
  })
  @IsNotEmpty()
  @IsString()
  lieu: string;

  @ApiProperty({
    description: 'Ville',
    example: 'Antananarivo',
  })
  @IsNotEmpty()
  @IsString()
  ville: string;

  @ApiProperty({
    description: 'Caractéristiques générales',
    example: ['Parking', 'Jardin', 'Eau'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  caracteristiques?: string[];

  @ApiProperty({
    description: 'Image principale',
    example: 'https://image.com/principale.jpg',
  })
  @IsUrl()
  image_principale: string;

  @ApiProperty({
    description: 'Images secondaires',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({
    type: CreateLocationResidentielleDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLocationResidentielleDto)
  location_residentielle?: CreateLocationResidentielleDto;
}
