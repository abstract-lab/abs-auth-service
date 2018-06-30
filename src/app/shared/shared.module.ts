import { Module } from '@nestjs/common';

import { ConfigurationService } from './configuration/configuration.service';
import { configurationServiceFactory } from './configuration/configuration-service.factory';
import { DbServerService } from './database/dbServer.service';
import { serverFactory } from './database/server.factory';
import { LoggingService } from './logging/logging.service';
import { logginsServiceFactory } from './logging/logging-service.factory';
import { DatabaseService } from './database/database.service';
import { RabbitMQServer } from './mq/rabbit-server';
import { mqServerFactory } from './mq/mq-server.factory';

@Module({
    providers: [
        {
            provide: ConfigurationService,
            useFactory: configurationServiceFactory,
        }, {
            provide: LoggingService,
            useFactory: logginsServiceFactory,
            inject: [ ConfigurationService ],
        }, {
            provide: DbServerService,
            useFactory: serverFactory,
            inject: [ ConfigurationService, LoggingService ],
        }, {
            provide: RabbitMQServer,
            useFactory: mqServerFactory,
            inject: [ ConfigurationService ],
        },
    ],
    exports: [
        ConfigurationService,
        DbServerService,
        LoggingService,
        RabbitMQServer,
    ],
})
export class SharedModule { }