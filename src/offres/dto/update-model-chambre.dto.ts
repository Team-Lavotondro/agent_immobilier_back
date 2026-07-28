import { PartialType } from '@nestjs/swagger';
import { CreateModelChambreDto } from './create-model-chambre.dto';

export class UpdateModelChambreDto extends PartialType(CreateModelChambreDto) {}
