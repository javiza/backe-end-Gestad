import { Test, TestingModule } from '@nestjs/testing';
import { ReprocesosService } from './reprocesos.service';

describe('ReprocesosService', () => {
  let service: ReprocesosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReprocesosService],
    }).compile();

    service = module.get<ReprocesosService>(ReprocesosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
