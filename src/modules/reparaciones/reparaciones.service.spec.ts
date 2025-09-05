import { Test, TestingModule } from '@nestjs/testing';
import { ReparacionesService } from './reparaciones.service';

describe('ReparacionesService', () => {
  let service: ReparacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReparacionesService],
    }).compile();

    service = module.get<ReparacionesService>(ReparacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
