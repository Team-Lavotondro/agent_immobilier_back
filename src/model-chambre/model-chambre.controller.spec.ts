import { Test, TestingModule } from '@nestjs/testing';
import { ModelChambreController } from './model-chambre.controller';
import { ModelChambreService } from './model-chambre.service';

describe('ModelChambreController', () => {
  let controller: ModelChambreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelChambreController],
      providers: [ModelChambreService],
    }).compile();

    controller = module.get<ModelChambreController>(ModelChambreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
