import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OffresService } from './offres.service';
import { CreateOffreVenteDto } from './dto/create-offre-vente.dto';

@Controller('offres')
export class OffresController {
  constructor(private readonly offresService: OffresService) {}

  @Post('create-vente')
  async createVente(@Body() createOffreVenteDto: CreateOffreVenteDto) {
    return await this.offresService.createOffreVente(createOffreVenteDto);
  }
  
}
