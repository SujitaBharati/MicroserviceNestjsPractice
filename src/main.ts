import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MessagingModule } from './messaging/messaging.module';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessagingModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../messaging.proto'),
        package: 'messaging',
        url: '0.0.0.0:2024',
      },
    },
  );
  //  await app.listen(process.env.PORT ?? 3000);
  await app.listen();
}
bootstrap().then(() => {
  const logger = new Logger('Main Logger');
  logger.log('gRPC server is listening on port 2024');
});
