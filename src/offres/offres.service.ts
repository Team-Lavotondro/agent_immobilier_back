import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offre } from './entities/offre.entity';
import { DataSource, Repository } from 'typeorm';
import { ModelChambre } from 'src/model-chambre/entities/model-chambre.entity';
import { Chambre } from 'src/chambres/entities/chambre.entity';
import { Utilisateur } from 'src/accounts/users/entities/utilisateur.entity';
import { UsersService } from 'src/accounts/users/users.service';
import { CreateOffreVenteDto } from './dto/create-offre-vente.dto';
import { off } from 'process';
import { CreateImageDto } from './dto/create-img.dto';
import { ImageOffres } from './entities/offre-image.entity';
import { response } from 'express';

@Injectable()
export class OffresService {
  constructor(
    @InjectRepository(Offre)
    private readonly offreRepository: Repository<Offre>,
    private readonly userService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createOffreVente(
    createOffreVenteDto: CreateOffreVenteDto,
  ): Promise<Offre> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { id_util, image_principale, images, ...offreData } =
      createOffreVenteDto;

    try {
      await this.userService.getDetailUtil(id_util);
      if (offreData.type_offre === 'vente' && !offreData.prix_vente) {
        throw new BadRequestException(
          'Le prix est obligatoire pour une offre de vente',
        );
      }
      if (offreData.nb_pieces_offre < 1) {
        throw new BadRequestException(
          'Le nombre de pièces doit être supérieur à 0',
        );
      }

      const offre = queryRunner.manager.create(Offre, {
        ...offreData,
        utilisateur: { id_util: id_util },
      });

      const savedOffre = await queryRunner.manager.save(offre);

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

      const reponse = await this.offreRepository.findOne({
        where: { id_offre: savedOffre.id_offre },
        relations: {
          imageOffres: true,
        },
      });
      return reponse!!;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const message = error instanceof Error ? error.message : String(error);
      console.error('❌ Erreur, rollback effectué:', message);
      throw new BadRequestException(`Échec de la création: ${message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
