import { Controller } from '@nestjs/common';
import { IsAuthService } from './middlewares.service';

@Controller('middlewares')
export class MiddlewaresController {
  constructor(private readonly middlewaresService: IsAuthService) {}
}
