import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { RabbitMQServer } from './app/shared/mq/rabbit-server';

(async () => {
  try {
    const rabbit = new RabbitMQServer({
      hostname: '192.168.10.99',
      port: 5672,
      username: 'rabbitmq',
      password: 'rabbitmq',
      queue: 'ci-auth-queue',
    });

    const app = await NestFactory.createMicroservice(AppModule, {
      strategy: rabbit,
    });

    await app.listenAsync();
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(`Error in main: ${JSON.stringify(e)}`);
  }
})();
