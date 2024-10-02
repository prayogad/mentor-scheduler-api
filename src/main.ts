import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.use(cookieParser(configService.get('COOKIE_PARSER_KEY')))

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  
  const port = process.env.PORT || 8080
  await app.listen(port);

  console.info(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
