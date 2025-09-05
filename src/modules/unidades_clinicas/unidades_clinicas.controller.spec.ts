import { Test, TestingModule } from '@nestjs/testing';
import { UnidadesClinicasController } from './unidades_clinicas.controller';

describe('UnidadesClinicasController', () => {
  let controller: UnidadesClinicasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnidadesClinicasController],
    }).compile();

    controller = module.get<UnidadesClinicasController>(UnidadesClinicasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
