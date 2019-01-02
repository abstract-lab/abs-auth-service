import { Module } from '@nestjs/common';

import { ConfigurationService } from './configuration/configuration.service';
import { configurationServiceFactory } from './configuration/configuration-service.factory';
import { DbServerService } from './database/dbServer.service';
import { serverFactory } from './database/server.factory';
import { LoggingService } from './logging/logging.service';
import { loggingServiceFactory } from './logging/logging-service.factory';
import { RabbitMQServer } from './mq/rabbit-server';
import { mqServerFactory } from './mq/mq-server.factory';
import { RabbitMessageQueue } from './mq/rabbit.mq.component';
import { messageFactory } from './mq/mq-factory.component';

@Module({
    providers: [
        {
            provide: ConfigurationService,
            useFactory: configurationServiceFactory,
        }, {
            provide: LoggingService,
            useFactory: loggingServiceFactory,
            inject: [ ConfigurationService ],
        }, {
            provide: DbServerService,
            useFactory: serverFactory,
            inject: [ ConfigurationService, LoggingService ],
        },
        // {
        //     provide: RabbitMQServer,
        //     useFactory: mqServerFactory,
        //     inject: [ ConfigurationService ],
        // },
        {
            provide: RabbitMessageQueue, useFactory: messageFactory, inject: [ ConfigurationService, LoggingService ],
        },
    ],
    exports: [
        ConfigurationService,
        DbServerService,
        LoggingService,
        // RabbitMQServer,
        RabbitMessageQueue,
    ],
})
export class SharedModule { }