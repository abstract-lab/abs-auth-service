import { ConfigurationService } from '../configuration/configuration.service';
import { RabbitMQServer } from './rabbit-server';
import { ClientProxy } from '@nestjs/microservices';

export const mqServerFactory = async (configManager: ConfigurationService) => {
    const config = configManager.getSettings();

    const options = {
        hostname: process.env.MQ_HOST || config.mq.host,
        port: process.env.MQ_PORT || config.mq.port,
        username: process.env.MQ_USERNAME || config.mq.username,
        password: process.env.MQ_PASSWORD || config.mq.password,
        queue: process.env.MQ_QUEUE || config.mq.queue,
    };

    const mqService = new RabbitMQServer(options);
    return mqService;
};
