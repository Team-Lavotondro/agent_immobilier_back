import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateModelChambreDto } from './create-model-chambre.dto';
import { TypeLocation, TypeOffre, UniteLocation } from '../enums';

export class CreateOffreLocationDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui crée l'offre",
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty()
  @IsUUID()
  id_util: string;

  @ApiProperty({
    description: "Type de l'offre (location)",
    enum: TypeOffre,
    example: TypeOffre.LOCATION,
    default: TypeOffre.LOCATION,
  })
  @IsOptional()
  @IsEnum(TypeOffre)
  type_offre?: TypeOffre = TypeOffre.LOCATION;

  @ApiProperty({
    description: 'Nom ou titre de la location',
    example: 'Grande salle de fête pour mariage / Appartement T3 meublé',
  })
  @IsNotEmpty()
  @IsString()
  nom_offre: string;

  @ApiProperty({
    description: "Description détaillée du bien ou de l'espace",
    example: 'Salle événementielle équipée avec sono, capacité 300 personnes.',
  })
  @IsNotEmpty()
  @IsString()
  description_offre: string;

  @ApiProperty({
    description:
      'Catégorie de la location (ex: residentiel, evenementiel, professionnel)',
    enum: TypeLocation,
    example: TypeLocation.EVENEMENTIEL,
    default: TypeLocation.RESIDENTIEL,
  })
  @IsOptional()
  @IsEnum(TypeLocation)
  type_location?: TypeLocation = TypeLocation.RESIDENTIEL;

  @ApiProperty({
    description: 'Loyer mensuel (pour location à long terme)',
    example: 800000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  loyer_mensuel?: number;

  @ApiProperty({
    description: 'Tarif pour espace événementiel / réservation courte durée',
    example: 1200000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tarif_evenement?: number;

  @ApiProperty({
    description:
      'Unité de tarification de la location (ex: mois, jour, heure, evenement)',
    enum: UniteLocation,
    example: UniteLocation.JOUR,
    default: UniteLocation.MOIS,
  })
  @IsOptional()
  @IsEnum(UniteLocation)
  unite_location?: UniteLocation = UniteLocation.MOIS;

  @ApiProperty({
    description: 'Frais de commission (en montant ou %)',
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  commission?: number;

  @ApiProperty({
    description: 'Le logement ou espace est-il meublé / équipé ?',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  meuble?: boolean;

  @ApiProperty({
    description:
      "Capacité d'accueil max (ex: nombre d'invités pour un espace événementiel)",
    example: 250,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacite_accueil?: number;

  @ApiProperty({
    description:
      "Liste des équipements et services inclus pour l'espace (ex: sonorisation, projecteur, parking, wifi)",
    example: ['sonorisation', 'videoprojecteur', 'parking', 'scene'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  equipements_evenement?: string[];

  @ApiProperty({
    description: 'Nombre de pièces (si applicable)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  nb_pieces_offre?: number;

  @ApiProperty({
    description: 'Adresse exacte du bien ou de la salle',
    example: 'Lot IV B 12 Ambohijatovo',
    required: false,
  })
  @IsOptional()
  @IsString()
  adresse_offre?: string;

  @ApiProperty({
    description: 'Quartier ou secteur géographique',
    example: 'Anosy',
  })
  @IsNotEmpty()
  @IsString()
  lieu: string;

  @ApiProperty({
    description: 'Ville où se situe le bien',
    example: 'Antananarivo',
  })
  @IsNotEmpty()
  @IsString()
  ville: string;

  @ApiProperty({
    description: "Image principale de l'offre (URL)",
    example:
      'https://xyz.supabase.co/storage/v1/object/public/offres/salle.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  image_principale: string;

  @ApiProperty({
    description: 'Images secondaires (URLs)',
    example: [
      'https://xyz.supabase.co/offres/salle1.jpg',
      'https://xyz.supabase.co/offres/salle2.jpg',
    ],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({
    description:
      'Modèles de chambres ou catégories de logements disponibles (VIP, Standard, etc.)',
    type: [CreateModelChambreDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateModelChambreDto)
  models_chambres?: CreateModelChambreDto[];
}
