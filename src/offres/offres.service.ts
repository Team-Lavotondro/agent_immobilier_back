import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Offre } from './entities/offre.entity';
import { OffreVente } from './entities/offre-vente.entity';
import { OffreLocation } from './entities/offre-location.entity';
import { ImageOffres } from './entities/offre-image.entity';
import { ModelChambre } from './entities/model-chambre.entity';
import { UsersService } from 'src/accounts/users/users.service';
import { CreateOffreVenteDto } from './dto/create-offre-vente.dto';
import { CreateOffreLocationDto } from './dto/create-offre-location.dto';
import { UpdateOffreVenteDto } from './dto/update-offre-vente.dto';
import { UpdateOffreLocationDto } from './dto/update-offre-location.dto';
import { CreateImageDto } from './dto/create-img.dto';
import { TypeOffre, TypeLocation } from './enums';

@Injectable()
export class OffresService {
  constructor(
    @InjectRepository(Offre)
    private readonly offreRepository: Repository<Offre>,
    @InjectRepository(OffreVente)
    private readonly offreVenteRepository: Repository<OffreVente>,
    @InjectRepository(OffreLocation)
    private readonly offreLocationRepository: Repository<OffreLocation>,
    @InjectRepository(ModelChambre)
    private readonly modelChambreRepository: Repository<ModelChambre>,
    private readonly userService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createOffreVente(
    createOffreVenteDto: CreateOffreVenteDto,
  ): Promise<OffreVente> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { id_util, image_principale, images, ...offreData } =
      createOffreVenteDto;

    try {
      await this.userService.getDetailUtil(id_util);

      if (!offreData.prix_vente) {
        throw new BadRequestException(
          'Le prix de vente est obligatoire pour une offre de vente.',
        );
      }
      if (offreData.nb_pieces_offre && offreData.nb_pieces_offre < 1) {
        throw new BadRequestException(
          'Le nombre de pièces doit être supérieur à 0.',
        );
      }

      const offreVente = queryRunner.manager.create(OffreVente, {
        ...offreData,
        type_offre: TypeOffre.VENTE,
        utilisateur: { id_util: id_util },
      });

      const savedOffre = await queryRunner.manager.save(offreVente);

      const allImages: CreateImageDto[] = [];
      if (image_principale) {
        allImages.push({
          url_image: image_principale,
          is_principale: true,
          id_offre: savedOffre.id_offre,
        });
      }

      if (images && images.length > 0) {
        images.forEach((url) => {
          allImages.push({
            url_image: url,
            is_principale: false,
            id_offre: savedOffre.id_offre,
          });
        });
      }

      if (allImages.length > 0) {
        const imageEntities = queryRunner.manager.create(
          ImageOffres,
          allImages,
        );
        await queryRunner.manager.save(imageEntities);
      }

      await queryRunner.commitTransaction();

      const result = await this.offreVenteRepository.findOne({
        where: { id_offre: savedOffre.id_offre },
        relations: {
          imageOffres: true,
          modelsChambres: true,
          utilisateur: true,
        },
      });

      if (!result) {
        throw new NotFoundException('Offre créée introuvable');
      }
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const message = error instanceof Error ? error.message : String(error);
      console.error('Erreur création offre de vente:', message);
      throw new BadRequestException(`Échec de la création: ${message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async createOffreLocation(
    createOffreLocationDto: CreateOffreLocationDto,
  ): Promise<OffreLocation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { id_util, image_principale, images, models_chambres, ...offreData } =
      createOffreLocationDto;

    try {
      await this.userService.getDetailUtil(id_util);

      if (
        offreData.type_location === TypeLocation.EVENEMENTIEL &&
        !offreData.tarif_evenement &&
        !offreData.loyer_mensuel
      ) {
        throw new BadRequestException(
          'Un tarif événementiel ou un loyer est requis pour un espace événementiel.',
        );
      }

      if (
        offreData.type_location !== TypeLocation.EVENEMENTIEL &&
        !offreData.loyer_mensuel
      ) {
        throw new BadRequestException(
          'Le loyer mensuel est obligatoire pour une location résidentielle/professionnelle.',
        );
      }

      const offreLocation = queryRunner.manager.create(OffreLocation, {
        ...offreData,
        utilisateur: { id_util: id_util } as any,
      });

      const savedOffre = await queryRunner.manager.save(offreLocation);

      const allImages: CreateImageDto[] = [];
      if (image_principale) {
        allImages.push({
          url_image: image_principale,
          is_principale: true,
          id_offre: savedOffre.id_offre,
        });
      }

      if (images && images.length > 0) {
        images.forEach((url) => {
          allImages.push({
            url_image: url,
            is_principale: false,
            id_offre: savedOffre.id_offre,
          });
        });
      }

      if (allImages.length > 0) {
        const imageEntities = queryRunner.manager.create(
          ImageOffres,
          allImages,
        );
        await queryRunner.manager.save(imageEntities);
      }

      if (models_chambres && models_chambres.length > 0) {
        const modelEntities = models_chambres.map((mc) =>
          queryRunner.manager.create(ModelChambre, {
            ...mc,
            quantite_totale: mc.quantite_totale ?? 1,
            quantite_disponible:
              mc.quantite_disponible ?? mc.quantite_totale ?? 1,
            is_dispo: mc.is_dispo ?? (mc.quantite_disponible ?? 1) > 0,
            offre: savedOffre,
          }),
        );
        await queryRunner.manager.save(modelEntities);
      }

      await queryRunner.commitTransaction();

      const result = await this.offreLocationRepository.findOne({
        where: { id_offre: savedOffre.id_offre },
        relations: {
          imageOffres: true,
          modelsChambres: true,
          utilisateur: true,
        },
      });

      if (!result) {
        throw new NotFoundException('Offre créée introuvable');
      }
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const message = error instanceof Error ? error.message : String(error);
      console.error(' Erreur création offre de location:', message);
      throw new BadRequestException(`Échec de la création: ${message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offre[]> {
    return await this.offreRepository.find({
      relations: { imageOffres: true, modelsChambres: true, utilisateur: true },
      order: { created_At: 'DESC' },
    });
  }

  async findAllVentes(): Promise<OffreVente[]> {
    return await this.offreVenteRepository.find({
      relations: { imageOffres: true, modelsChambres: true, utilisateur: true },
      order: { created_At: 'DESC' },
    });
  }

  async findAllLocations(): Promise<OffreLocation[]> {
    return await this.offreLocationRepository.find({
      relations: { imageOffres: true, modelsChambres: true, utilisateur: true },
      order: { created_At: 'DESC' },
    });
  }

  async findOne(id_offre: string): Promise<Offre> {
    const offre = await this.offreRepository.findOne({
      where: { id_offre },
      relations: { imageOffres: true, modelsChambres: true, utilisateur: true },
    });

    if (!offre) {
      throw new NotFoundException(`Offre avec l'ID ${id_offre} introuvable`);
    }

    return offre;
  }

  async updateOffreVente(
    id_offre: string,
    updateDto: UpdateOffreVenteDto,
  ): Promise<OffreVente> {
    const offre = await this.offreVenteRepository.findOne({
      where: { id_offre },
    });
    if (!offre) {
      throw new NotFoundException(
        `Offre de vente avec l'ID ${id_offre} introuvable`,
      );
    }

    const { id_util, image_principale, images, ...updateData } =
      updateDto as any;
    Object.assign(offre, updateData);

    return await this.offreVenteRepository.save(offre);
  }

  async updateOffreLocation(
    id_offre: string,
    updateDto: UpdateOffreLocationDto,
  ): Promise<OffreLocation> {
    const offre = await this.offreLocationRepository.findOne({
      where: { id_offre },
    });
    if (!offre) {
      throw new NotFoundException(
        `Offre de location avec l'ID ${id_offre} introuvable`,
      );
    }

    const {
      id_util,
      image_principale,
      images,
      models_chambres,
      ...updateData
    } = updateDto as any;
    Object.assign(offre, updateData);

    return await this.offreLocationRepository.save(offre);
  }

  async remove(id_offre: string): Promise<{ message: string }> {
    const offre = await this.findOne(id_offre);
    await this.offreRepository.remove(offre);
    return { message: `Offre avec l'ID ${id_offre} supprimée avec succès.` };
  }
}
