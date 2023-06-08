import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return {
      requsest: true,
      message: 'Greetings Ms. Anusooya',
    } as any;
  }
}
