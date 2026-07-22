// offres/__tests__/offres.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OffresController } from './offres.controller';
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

describe('OffresController', () => {
  let controller: OffresController;
  let service: OffresService;

  const mockCreateDto: CreateOffreVenteDto = {
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
    images: ['https://supabase.co/offres/villa-1.jpg'],
  };

  const mockResponse = {
    id_offre: 'offre-uuid-1234',
    ...mockCreateDto,
    imageOffres: [
      { id_image: 'img-1', url_image: mockCreateDto.image_principale, is_principale: true },
      { id_image: 'img-2', url_image: mockCreateDto.images[0], is_principale: false },
    ],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffresController],
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

    controller = module.get<OffresController>(OffresController);
    service = module.get<OffresService>(OffresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('POST /offres/vente', () => {
    it('should create a sale offer successfully', async () => {
      jest.spyOn(service, 'createOffreVente').mockResolvedValue(mockResponse as any);

      const result = await controller.createVente(mockCreateDto);

      expect(result).toEqual(mockResponse);
      expect(service.createOffreVente).toHaveBeenCalledWith(mockCreateDto);
      expect(service.createOffreVente).toHaveBeenCalledTimes(1);
    });

    it('should return an error if service fails', async () => {
      const error = new Error('Creation error');
      jest.spyOn(service, 'createOffreVente').mockRejectedValue(error);

      await expect(controller.createVente(mockCreateDto)).rejects.toThrow(error);
      expect(service.createOffreVente).toHaveBeenCalledWith(mockCreateDto);
    });
  });
});