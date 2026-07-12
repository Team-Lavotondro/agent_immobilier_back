import { Test, TestingModule } from '@nestjs/testing';
import { ModelChambreService } from './model-chambre.service';

describe('ModelChambreService', () => {
  let service: ModelChambreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelChambreService],
    }).compile();

    service = module.get<ModelChambreService>(ModelChambreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
