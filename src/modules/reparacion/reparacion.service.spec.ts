import { Test, TestingModule } from '@nestjs/testing';
import { ReparacionService } from './reparacion.service';

describe('ReparacionService', () => {
  let service: ReparacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReparacionService],
    }).compile();

    service = module.get<ReparacionService>(ReparacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
