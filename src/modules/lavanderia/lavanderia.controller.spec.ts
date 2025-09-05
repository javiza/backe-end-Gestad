import { Test, TestingModule } from '@nestjs/testing';
import { LavanderiaController } from './lavanderia.controller';

describe('LavanderiaController', () => {
  let controller: LavanderiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LavanderiaController],
    }).compile();

    controller = module.get<LavanderiaController>(LavanderiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
