import { PartialType } from '@nestjs/swagger';
import { CreateOffreLocationDto } from './create-offre-location.dto';

export class UpdateOffreLocationDto extends PartialType(CreateOffreLocationDto) {}
