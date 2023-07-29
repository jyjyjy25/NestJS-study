import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); // 전역 범위
  app.useGlobalPipes(new ValidationPipe()); // 등록
  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
