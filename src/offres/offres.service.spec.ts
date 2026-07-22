// offres/__tests__/offres.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { OffresService } from './offres.service';
import { Offre } from './entities/offre.entity';
import { ImageOffres } from './entities/offre-image.entity';
import { UsersService } from '../accounts/users/users.service';
import { CreateOffreVenteDto } from './dto/create-offre-vente.dto';


const mockOffreRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

const mockImageOffreRepository = {
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
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

describe('OffresService - createOffreVente', () => {
  let service: OffresService;

  const mockOffreData: CreateOffreVenteDto = {
    id_util: 'user-uuid-1234',
    type_offre: 'vente',
    nom_offre: 'Villa de luxe',
    description_offre: 'Magnifique villa avec piscine',
    prix_vente: 250000000,
    nb_pieces_offre: 6,
    adresse_offre: 'Lot II A 73 Bis',
    lieu: 'Andrainjato',
    ville: 'Fianarantsoa',
    image_principale: 'https://supabase.co/offres/villa-principale.jpg',
    images: [
      'https://supabase.co/offres/villa-1.jpg',
      'https://supabase.co/offres/villa-2.jpg',
    ],
  };

  const mockSavedOffre = {
    id_offre: 'offre-uuid-1234',
    ...mockOffreData,
  };

  const mockImages = [
    {
      id_image: 'img-uuid-1',
      url_image: mockOffreData.image_principale,
      is_principale: true,
      offre: mockSavedOffre,
    },
    {
      id_image: 'img-uuid-2',
      url_image: mockOffreData.images[0],
      is_principale: false,
      offre: mockSavedOffre,
    },
    {
      id_image: 'img-uuid-3',
      url_image: mockOffreData.images[1],
      is_principale: false,
      offre: mockSavedOffre,
    },
  ];

  const mockFinalResponse = {
    ...mockSavedOffre,
    imageOffres: mockImages,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffresService,
        {
          provide: getRepositoryToken(Offre),
          useValue: mockOffreRepository,
        },
        {
          provide: getRepositoryToken(ImageOffres),
          useValue: mockImageOffreRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OffresService>(OffresService);
  });

  describe('Success cases', () => {
    it('should create an offer with main and secondary images', async () => {
      mockUsersService.getDetailUtil.mockResolvedValue({ id_util: mockOffreData.id_util });
      mockQueryRunner.manager.create.mockReturnValueOnce(mockSavedOffre);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockSavedOffre);
      mockQueryRunner.manager.create.mockReturnValueOnce(mockImages);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockImages);
      mockOffreRepository.findOne.mockResolvedValue(mockFinalResponse);

      const result = await service.createOffreVente(mockOffreData);

      expect(result).toBeDefined();
      expect(result.id_offre).toBe(mockSavedOffre.id_offre);
      expect(result.imageOffres).toHaveLength(3);
      expect(mockUsersService.getDetailUtil).toHaveBeenCalledWith(mockOffreData.id_util);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should create an offer with only main image', async () => {
      const dataWithoutImages = {
        ...mockOffreData,
        images: undefined,
      };

      const mockImagesOnlyMain = [mockImages[0]];

      mockUsersService.getDetailUtil.mockResolvedValue({ id_util: dataWithoutImages.id_util });
      mockQueryRunner.manager.create.mockReturnValueOnce(mockSavedOffre);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockSavedOffre);
      mockQueryRunner.manager.create.mockReturnValueOnce(mockImagesOnlyMain);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockImagesOnlyMain);
      mockOffreRepository.findOne.mockResolvedValue({
        ...mockFinalResponse,
        imageOffres: mockImagesOnlyMain,
      });

      const result = await service.createOffreVente(dataWithoutImages);

      expect(result).toBeDefined();
      expect(result.imageOffres).toHaveLength(1);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  describe('Error cases', () => {
    it('should throw an error if user does not exist', async () => {
      // Le service catch l'erreur et lance BadRequestException
      mockUsersService.getDetailUtil.mockRejectedValue(new Error('User not found'));

      // Le service transforme l'erreur en BadRequestException
      await expect(service.createOffreVente(mockOffreData)).rejects.toThrow(BadRequestException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should throw an error if price is missing for sale', async () => {
      const invalidData = { ...mockOffreData, prix_vente: undefined };
      mockUsersService.getDetailUtil.mockResolvedValue({ id_util: invalidData.id_util });

      await expect(service.createOffreVente(invalidData)).rejects.toThrow(BadRequestException);
     
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      // La création de l'offre ne devrait PAS être appelée
      expect(mockQueryRunner.manager.create).not.toHaveBeenCalled();
    });

    it('should throw an error if number of rooms is less than 1', async () => {
      const invalidData = { ...mockOffreData, nb_pieces_offre: 0 };
      mockUsersService.getDetailUtil.mockResolvedValue({ id_util: invalidData.id_util });

      // La validation est faite APRÈS la vérification de l'utilisateur
      // Mais AVANT la création de l'offre
      await expect(service.createOffreVente(invalidData)).rejects.toThrow(BadRequestException);
      await expect(service.createOffreVente(invalidData)).rejects.toThrow(
        'Le nombre de pièces doit être supérieur à 0',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      // La création de l'offre ne devrait PAS être appelée
      expect(mockQueryRunner.manager.create).not.toHaveBeenCalled();
    });

    it('should rollback if saving offer fails', async () => {
      mockUsersService.getDetailUtil.mockResolvedValue({ id_util: mockOffreData.id_util });
      mockQueryRunner.manager.create.mockReturnValueOnce(mockSavedOffre);
      mockQueryRunner.manager.save.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.createOffreVente(mockOffreData)).rejects.toThrow(BadRequestException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should rollback if saving images fails', async () => {
      mockUsersService.getDetailUtil.mockResolvedValue({ id_util: mockOffreData.id_util });
      mockQueryRunner.manager.create.mockReturnValueOnce(mockSavedOffre);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockSavedOffre);
      mockQueryRunner.manager.create.mockReturnValueOnce(mockImages);
      mockQueryRunner.manager.save.mockRejectedValueOnce(new Error('Image save error'));

      await expect(service.createOffreVente(mockOffreData)).rejects.toThrow(BadRequestException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });
  });
});