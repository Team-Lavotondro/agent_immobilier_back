import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Offre } from './entities/offre.entity';
import { OffreVente } from './entities/offre-vente.entity';
import { OffreLocation } from './entities/offre-location.entity';
import { LocationResidentielle } from './entities/offres-location-residentiel.entity';
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

    const {
      id_util,
      image_principale,
      images,
      caracteristiques_generale,
      prix_vente,
      superficie,
      nbre_piece,
      ...offreCommonData
    } = createOffreVenteDto;

    try {
      await this.userService.getDetailUtil(id_util);

      if (!prix_vente) {
        throw new BadRequestException(
          'Le prix de vente est obligatoire pour une offre de vente.',
        );
      }
      if (nbre_piece && nbre_piece < 1) {
        throw new BadRequestException(
          'Le nombre de pièces doit être supérieur à 0.',
        );
      }

      // 1. Créer l'offre "commune"
      const offre = queryRunner.manager.create(Offre, {
        ...offreCommonData,
        type_offre: TypeOffre.VENTE,
        caracteristiques: caracteristiques_generale,
        utilisateur: { id_util } as any,
      });
      const savedOffre = await queryRunner.manager.save(offre);

      // 2. Créer les détails spécifiques à la vente, liés à l'offre
      const offreVente = queryRunner.manager.create(OffreVente, {
        prix_vente,
        superficie,
        nbre_piece,
        offre: savedOffre,
      });
      const savedOffreVente = await queryRunner.manager.save(offreVente);

      // 3. Images (rattachées à l'offre commune)
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
        where: { id_vente: savedOffreVente.id_vente },
        relations: {
          offre: {
            imageOffres: true,
            utilisateur: true,
          },
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

    const {
      id_util,
      image_principale,
      images,
      type_location,
      location_residentielle,
      ...offreCommonData
    } = createOffreLocationDto;

    try {
      await this.userService.getDetailUtil(id_util);

      if (
        type_location !== TypeLocation.EVENEMENTIEL &&
        !location_residentielle?.loyer
      ) {
        throw new BadRequestException(
          'Le loyer est obligatoire pour une location résidentielle/professionnelle.',
        );
      }

      // 1. Créer l'offre "commune"
      const offre = queryRunner.manager.create(Offre, {
        ...offreCommonData,
        type_offre: TypeOffre.LOCATION,
      });
      const savedOffre = await queryRunner.manager.save(offre);

      // 2. Créer les détails spécifiques à la location, liés à l'offre
      const offreLocation = queryRunner.manager.create(OffreLocation, {
        type_location,
        offre: savedOffre,
      });
      const savedOffreLocation = await queryRunner.manager.save(
        offreLocation,
      );

      // 3. Détails résidentiels + modèles de chambres, si fournis
      if (location_residentielle) {
        const { models_chambres, ...locResData } = location_residentielle;

        const locRes = queryRunner.manager.create(LocationResidentielle, {
          ...locResData,
          offreLocation: savedOffreLocation,
        });
        const savedLocRes = await queryRunner.manager.save(locRes);

        if (models_chambres && models_chambres.length > 0) {
          const modelEntities = models_chambres.map((mc) =>
            queryRunner.manager.create(ModelChambre, {
              ...mc,
              quantite_totale: mc.quantite_totale ?? 1,
              quantite_disponible:
                mc.quantite_disponible ?? mc.quantite_totale ?? 1,
              location: savedLocRes,
            }),
          );
          await queryRunner.manager.save(modelEntities);
        }
      }

      // 4. Images (rattachées à l'offre commune)
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

      const result = await this.offreLocationRepository.findOne({
        where: { id_location: savedOffreLocation.id_location },
        relations: {
          offre: {
            imageOffres: true,
            utilisateur: true,
          },
          locationResidentielle: {
            modelsChambres: true,
          },
        },
      });

      if (!result) {
        throw new NotFoundException('Offre créée introuvable');
      }
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const message = error instanceof Error ? error.message : String(error);
      console.error('Erreur création offre de location:', message);
      throw new BadRequestException(`Échec de la création: ${message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offre[]> {
    return await this.offreRepository.find({
      relations: {
        imageOffres: true,
        utilisateur: true,
        offreVente: true,
        offreLocation: {
          locationResidentielle: {
            modelsChambres: true,
          },
        },
      },
      order: { created_At: 'DESC' },
    });
  }

  async findAllVentes(): Promise<OffreVente[]> {
    return await this.offreVenteRepository.find({
      relations: {
        offre: {
          imageOffres: true,
          utilisateur: true,
        },
      },
      order: { offre: { created_At: 'DESC' } },
    });
  }

  async findAllLocations(): Promise<OffreLocation[]> {
    return await this.offreLocationRepository.find({
      relations: {
        offre: {
          imageOffres: true,
          utilisateur: true,
        },
        locationResidentielle: {
          modelsChambres: true,
        },
      },
      order: { offre: { created_At: 'DESC' } },
    });
  }

  async findOne(id_offre: string): Promise<Offre> {
    const offre = await this.offreRepository.findOne({
      where: { id_offre },
      relations: {
        imageOffres: true,
        utilisateur: true,
        offreVente: true,
        offreLocation: {
          locationResidentielle: {
            modelsChambres: true,
          },
        },
      },
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
      where: { offre: { id_offre } },
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
      where: { offre: { id_offre } },
    });
    if (!offre) {
      throw new NotFoundException(
        `Offre de location avec l'ID ${id_offre} introuvable`,
      );
    }

    const { id_util, image_principale, images, ...updateData } =
      updateDto as any;
    Object.assign(offre, updateData);

    return await this.offreLocationRepository.save(offre);
  }

  async remove(id_offre: string): Promise<{ message: string }> {
    const offre = await this.findOne(id_offre);
    await this.offreRepository.remove(offre);
    return { message: `Offre avec l'ID ${id_offre} supprimée avec succès.` };
  }
}