import { Test, TestingModule } from '@nestjs/testing';
import { isAuthMiddleware } from './middlewares.service';

describe('isAuthMiddleware', () => {
  let service: isAuthMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [isAuthMiddleware],
    }).compile();

    service = module.get<isAuthMiddleware>(isAuthMiddleware);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
