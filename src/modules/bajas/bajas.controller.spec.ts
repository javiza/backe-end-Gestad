import { Test, TestingModule } from '@nestjs/testing';
import { BajasController } from './bajas.controller';

describe('BajasController', () => {
  let controller: BajasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BajasController],
    }).compile();

    controller = module.get<BajasController>(BajasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
