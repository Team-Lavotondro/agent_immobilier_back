 import { PartialType } from '@nestjs/mapped-types';
import { CreateModelChambreDto } from './create-model-chambre.dto';

export class UpdateModelChambreDto extends PartialType(CreateModelChambreDto) {}
