import { Module } from '@nestjs/common';
import { IsAuthService } from './isAuth';

@Module({})
export class MiddlewaresModule {
    providers: [IsAuthService]
}
