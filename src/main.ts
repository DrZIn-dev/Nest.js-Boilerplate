import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(configService.getPort(), () => {
    const logger = new Logger('Bootstrap');
    logger.log('🚀 Server Listening on port ' + configService.getPort());
  });
}
bootstrap();
