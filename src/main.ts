import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
  //   if (err && err.name === 'UnauthorizedError') {
  //     return res.status(401).json({
  //       status: 'error',
  //       message: 'missing authorization credentials',
  //     });
  //   } else if (err && err.message) {
  //     res.status(err.message).json(err.message);
  //   } else if (err) {
  //     res.status(500).json(err.message);
  //   }
  // });
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Application is running on: ${port}`);
}
bootstrap();
