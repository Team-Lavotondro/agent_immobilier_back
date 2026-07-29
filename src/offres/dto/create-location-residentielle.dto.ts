import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UniteLocation } from '../enums';
import { CreateModelChambreDto } from './create-model-chambre.dto';
import { IsEnum } from 'class-validator';

export class CreateLocationResidentielleDto {
  @ApiProperty({
    example: 500000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  loyer?: number;

  @ApiProperty({
    enum: UniteLocation,
    example: UniteLocation.MOIS,
  })
  @IsEnum(UniteLocation)
  unite_location: UniteLocation;

  @ApiProperty({
    example: 300000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  caution?: number;

  @ApiProperty({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  meuble?: boolean;

  @ApiProperty({
    type: [CreateModelChambreDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModelChambreDto)
  models_chambres?: CreateModelChambreDto[];
}
