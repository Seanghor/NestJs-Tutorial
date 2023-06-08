import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriumController } from './auditorium.controller';
import { AuditoriumService } from './auditorium.service';

describe('AuditoriumController', () => {
  let controller: AuditoriumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriumController],
      providers: [AuditoriumService],
    }).compile();

    controller = module.get<AuditoriumController>(AuditoriumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
