import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { OffresService } from './offres.service';
import { Offre } from './entities/offre.entity';
import { OffreVente } from './entities/offre-vente.entity';
import { OffreLocation } from './entities/offre-location.entity';
import { ImageOffres } from './entities/offre-image.entity';
import { ModelChambre } from './entities/model-chambre.entity';
import { UsersService } from '../accounts/users/users.service';
import { CreateOffreVenteDto } from './dto/create-offre-vente.dto';
import { TypeOffre } from './enums';

const mockOffreRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

const mockOffreVenteRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockOffreLocationRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockImageOffreRepository = {
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
};

const mockModelChambreRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockUsersService = {
  getDetailUtil: jest.fn(),
};

const mockQueryRunner = {
  connect: jest.fn().mockResolvedValue(undefined),
  startTransaction: jest.fn().mockResolvedValue(undefined),
  commitTransaction: jest.fn().mockResolvedValue(undefined),
  rollbackTransaction: jest.fn().mockResolvedValue(undefined),
  release: jest.fn().mockResolvedValue(undefined),
  manager: {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

describe('OffresService', () => {
  let service: OffresService;

  // Données envoyées par le client : plus de type_offre (fixé par le service),
  // nbre_piece à la place de nb_pieces_offre.
  const mockOffreData: CreateOffreVenteDto = {
    id_util: 'user-uuid-1234',
    nom_offre: 'Villa de luxe',
    description_offre: 'Magnifique villa avec piscine',
    prix_vente: 250000000,
    nbre_piece: 6,
    adresse_offre: 'Lot II A 73 Bis',
    lieu: 'Andrainjato',
    ville: 'Fianarantsoa',
    image_principale: 'https://supabase.co/offres/villa-principale.jpg',
    images: [
      'https://supabase.co/offres/villa-1.jpg',
      'https://supabase.co/offres/villa-2.jpg',
    ],
  };

  // 1ère entité créée : l'offre "commune"
  const mockSavedOffre = {
    id_offre: 'offre-uuid-1234',
    nom_offre: mockOffreData.nom_offre,
    description_offre: mockOffreData.description_offre,
    adresse_offre: mockOffreData.adresse_offre,
    lieu: mockOffreData.lieu,
    ville: mockOffreData.ville,
    type_offre: TypeOffre.VENTE,
  };

  // 2ème entité créée : les détails de vente, liés à l'offre commune
  const mockSavedOffreVente = {
    id_vente: 'vente-uuid-5678',
    prix_vente: mockOffreData.prix_vente,
    nbre_piece: mockOffreData.nbre_piece,
    offre: mockSavedOffre,
  };

  const mockImages = [
    {
      id_image: 'img-uuid-1',
      url_image: mockOffreData.image_principale,
      is_principale: true,
    },
    {
      id_image: 'img-uuid-2',
      url_image: mockOffreData.images![0],
      is_principale: false,
    },
    {
      id_image: 'img-uuid-3',
      url_image: mockOffreData.images![1],
      is_principale: false,
    },
  ];

  // Ce que renvoie offreVenteRepository.findOne(...) après création :
  // OffreVente avec sa relation "offre" chargée (imageOffres + utilisateur imbriqués)
  const mockFinalResponse = {
    ...mockSavedOffreVente,
    offre: {
      ...mockSavedOffre,
      imageOffres: mockImages,
      utilisateur: { id_util: mockOffreData.id_util },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffresService,
        { provide: getRepositoryToken(Offre), useValue: mockOffreRepository },
        {
          provide: getRepositoryToken(OffreVente),
          useValue: mockOffreVenteRepository,
        },
        {
          provide: getRepositoryToken(OffreLocation),
          useValue: mockOffreLocationRepository,
        },
        {
          provide: getRepositoryToken(ImageOffres),
          useValue: mockImageOffreRepository,
        },
        {
          provide: getRepositoryToken(ModelChambre),
          useValue: mockModelChambreRepository,
        },
        { provide: UsersService, useValue: mockUsersService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<OffresService>(OffresService);
  });

  describe('createOffreVente', () => {
    it('should create a sale offer with main and secondary images', async () => {
      mockUsersService.getDetailUtil.mockResolvedValue({
        id_util: mockOffreData.id_util,
      });

      // Ordre des appels dans le service :
      // 1) create(Offre) -> save(Offre)
      // 2) create(OffreVente) -> save(OffreVente)
      // 3) create(ImageOffres) -> save(ImageOffres)
      mockQueryRunner.manager.create
        .mockReturnValueOnce(mockSavedOffre) // create(Offre, ...)
        .mockReturnValueOnce(mockSavedOffreVente) // create(OffreVente, ...)
        .mockReturnValueOnce(mockImages); // create(ImageOffres, ...)

      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockSavedOffre) // save(offre)
        .mockResolvedValueOnce(mockSavedOffreVente) // save(offreVente)
        .mockResolvedValueOnce(mockImages); // save(imageEntities)

      mockOffreVenteRepository.findOne.mockResolvedValue(mockFinalResponse);

      const result = await service.createOffreVente(mockOffreData);

      expect(result).toBeDefined();
      expect(result.id_vente).toBe(mockSavedOffreVente.id_vente);
      expect(result.offre.id_offre).toBe(mockSavedOffre.id_offre);
      expect(result.offre.imageOffres).toHaveLength(3);

      expect(mockUsersService.getDetailUtil).toHaveBeenCalledWith(
        mockOffreData.id_util,
      );
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();

      expect(mockOffreVenteRepository.findOne).toHaveBeenCalledWith({
        where: { id_vente: mockSavedOffreVente.id_vente },
        relations: {
          offre: {
            imageOffres: true,
            utilisateur: true,
          },
        },
      });
    });

    it('should throw an error if price is missing for sale', async () => {
      const invalidData = { ...mockOffreData, prix_vente: undefined };
      mockUsersService.getDetailUtil.mockResolvedValue({
        id_util: invalidData.id_util,
      });

      await expect(
        service.createOffreVente(invalidData as any),
      ).rejects.toThrow(BadRequestException);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should throw an error if nbre_piece is less than 1', async () => {
      const invalidData = { ...mockOffreData, nbre_piece: 0 };
      mockUsersService.getDetailUtil.mockResolvedValue({
        id_util: invalidData.id_util,
      });

      await expect(
        service.createOffreVente(invalidData as any),
      ).rejects.toThrow(BadRequestException);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });
  });
});
