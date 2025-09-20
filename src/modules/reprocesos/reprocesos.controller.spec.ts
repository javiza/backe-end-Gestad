import { Test, TestingModule } from '@nestjs/testing';
import { ReprocesosController } from './reprocesos.controller';
import { ReprocesosService } from './reprocesos.service';

describe('ReprocesosController', () => {
  let controller: ReprocesosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReprocesosController],
      providers: [ReprocesosService],
    }).compile();

    controller = module.get<ReprocesosController>(ReprocesosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
