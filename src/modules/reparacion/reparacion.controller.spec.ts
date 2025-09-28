import { Test, TestingModule } from '@nestjs/testing';
import { ReparacionController } from './reparacion.controller';

describe('ReparacionController', () => {
  let controller: ReparacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReparacionController],
    }).compile();

    controller = module.get<ReparacionController>(ReparacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
