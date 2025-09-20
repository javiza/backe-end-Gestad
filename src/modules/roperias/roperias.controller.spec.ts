import { Test, TestingModule } from '@nestjs/testing';
import { RoperiasController } from './roperias.controller';
import { RoperiasService } from './roperias.service';

describe('RoperiasController', () => {
  let controller: RoperiasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoperiasController],
      providers: [RoperiasService],
    }).compile();

    controller = module.get<RoperiasController>(RoperiasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
