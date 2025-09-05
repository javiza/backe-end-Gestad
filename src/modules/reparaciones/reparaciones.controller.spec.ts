import { Test, TestingModule } from '@nestjs/testing';
import { ReparacionesController } from './reparaciones.controller';

describe('ReparacionesController', () => {
  let controller: ReparacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReparacionesController],
    }).compile();

    controller = module.get<ReparacionesController>(ReparacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
