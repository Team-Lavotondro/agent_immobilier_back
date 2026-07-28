import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OffresService } from './offres.service';
import { CreateOffreVenteDto } from './dto/create-offre-vente.dto';
import { CreateOffreLocationDto } from './dto/create-offre-location.dto';
import { UpdateOffreVenteDto } from './dto/update-offre-vente.dto';
import { UpdateOffreLocationDto } from './dto/update-offre-location.dto';

@ApiTags('Offres')
@Controller('offres')
export class OffresController {
  constructor(private readonly offresService: OffresService) {}

  @ApiOperation({ summary: 'Créer une offre de vente' })
  @Post('create-vente')
  async createVente(@Body() createOffreVenteDto: CreateOffreVenteDto) {
    return await this.offresService.createOffreVente(createOffreVenteDto);
  }

  @ApiOperation({
    summary:
      'Créer une offre de location (résidentielle, pro ou événementielle)',
  })
  @Post('create-location')
  async createLocation(@Body() createOffreLocationDto: CreateOffreLocationDto) {
    return await this.offresService.createOffreLocation(createOffreLocationDto);
  }

  @ApiOperation({ summary: 'Obtenir toutes les offres' })
  @Get()
  async findAll() {
    return await this.offresService.findAll();
  }

  @ApiOperation({ summary: 'Obtenir toutes les offres de vente' })
  @Get('ventes')
  async findAllVentes() {
    return await this.offresService.findAllVentes();
  }

  @ApiOperation({ summary: 'Obtenir toutes les offres de location' })
  @Get('locations')
  async findAllLocations() {
    return await this.offresService.findAllLocations();
  }

  @ApiOperation({ summary: "Obtenir les détails d'une offre par ID" })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offresService.findOne(id);
  }

  @ApiOperation({ summary: 'Mettre à jour une offre de vente' })
  @Patch('vente/:id')
  async updateVente(
    @Param('id') id: string,
    @Body() updateOffreVenteDto: UpdateOffreVenteDto,
  ) {
    return await this.offresService.updateOffreVente(id, updateOffreVenteDto);
  }

  @ApiOperation({ summary: 'Mettre à jour une offre de location' })
  @Patch('location/:id')
  async updateLocation(
    @Param('id') id: string,
    @Body() updateOffreLocationDto: UpdateOffreLocationDto,
  ) {
    return await this.offresService.updateOffreLocation(
      id,
      updateOffreLocationDto,
    );
  }

  @ApiOperation({ summary: 'Supprimer une offre' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.offresService.remove(id);
  }
}
