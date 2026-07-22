import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateOffreVenteDto {
  @ApiProperty({
      description: 'ID du modèle de chambre associé',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    })
    @IsNotEmpty()
    @IsUUID()
    id_util: string;
    
  @ApiProperty({
    description: "type de l'offre publié : 'location' ou 'vente'",
    example: 'vente',
  })
  @IsNotEmpty()
  @IsString()
  type_offre: string='vente';
  
  @ApiProperty({
    description: "Nom de l'offre",
    example: 'Maison beux à vendre',
  })
  @IsNotEmpty()
  @IsString()
  nom_offre: string;
  
  @ApiProperty({
    description: "description de l'offre",
    example: 'Maison avec terrasse , salle de bain inclut ,...',
  })
  @IsNotEmpty()
  @IsString()
  description_offre: string;
  
  @ApiProperty({
    description: "Prix  de l'offre",
    example: 150000000,
  })
  @IsNotEmpty()
  @IsInt()
  prix_vente: number;
  
  @ApiProperty({
    description: 'nombre de piece pour la maison ',
    example: 4,
  })
  @IsNotEmpty()
  @IsInt()
  nb_pieces_offre: number;
  
  @ApiProperty({
    description: 'Adresse de la maisaon à vendre ',
    example: 'lot II a 73 bis ',
  })
  @IsOptional()
  @IsString()
  @IsString()
  adresse_offre: string;
  
  @ApiProperty({
    description: 'lieu de la maison',
    example: 'Andrainjato',
  })
  @IsNotEmpty()
  @IsString()
  lieu: string;
  
  @ApiProperty({
    description: 'le nom de la ville où se trouve la maison',
    example: 'Fianarantsoa',
  })
  @IsNotEmpty()
  @IsString()
  ville: string;

   @ApiProperty({
    description: 'Image principale de l\'offre (URL publique)',
    example: 'https://xyz.supabase.co/storage/v1/object/public/offres/villa.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  image_principale: string;

  @ApiProperty({
    description: 'Images secondaires (URLs publiques)',
    example: ['https://xyz.supabase.co/offres/img1.jpg', 'https://xyz.supabase.co/offres/img2.jpg'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  images: string[];

}
