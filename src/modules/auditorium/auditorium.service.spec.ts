import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriumService } from './auditorium.service';

describe('AuditoriumService', () => {
  let service: AuditoriumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditoriumService],
    }).compile();

    service = module.get<AuditoriumService>(AuditoriumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
