import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OffresController } from './offres.controller';
import { OffresService } from './offres.service';
import { Offre } from './entities/offre.entity';
import { OffreVente } from './entities/offre-vente.entity';
import { OffreLocation } from './entities/offre-location.entity';
import { ImageOffres } from './entities/offre-image.entity';
import { ModelChambre } from './entities/model-chambre.entity';
import { UsersService } from '../accounts/users/users.service';
import { CreateOffreVenteDto } from './dto/create-offre-vente.dto';

const mockOffreRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
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
};

const mockModelChambreRepository = {
  create: jest.fn(),
  save: jest.fn(),
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
    findOne: jest.fn(),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

import { TypeOffre } from './enums';

describe('OffresController', () => {
  let controller: OffresController;
  let service: OffresService;

  const mockCreateDto: CreateOffreVenteDto = {
    id_util: 'user-uuid-1234',
    type_offre: TypeOffre.VENTE,
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
    modelsChambres: [],
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

  describe('POST /offres/create-vente', () => {
    it('should create a sale offer successfully', async () => {
      jest.spyOn(service, 'createOffreVente').mockResolvedValue(mockResponse as any);

      const result = await controller.createVente(mockCreateDto);

      expect(result).toEqual(mockResponse);
      expect(service.createOffreVente).toHaveBeenCalledWith(mockCreateDto);
    });
  });
});
