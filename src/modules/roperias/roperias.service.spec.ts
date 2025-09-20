import { Test, TestingModule } from '@nestjs/testing';
import { RoperiasService } from './roperias.service';

describe('RoperiasService', () => {
  let service: RoperiasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoperiasService],
    }).compile();

    service = module.get<RoperiasService>(RoperiasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
