import { Test, TestingModule } from '@nestjs/testing';
import { LavanderiaService } from './lavanderia.service';

describe('LavanderiaService', () => {
  let service: LavanderiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LavanderiaService],
    }).compile();

    service = module.get<LavanderiaService>(LavanderiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
