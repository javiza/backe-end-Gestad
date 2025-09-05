import { Test, TestingModule } from '@nestjs/testing';
import { UnidadesClinicasService } from './unidades_clinicas.service';

describe('UnidadesClinicasService', () => {
  let service: UnidadesClinicasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnidadesClinicasService],
    }).compile();

    service = module.get<UnidadesClinicasService>(UnidadesClinicasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
