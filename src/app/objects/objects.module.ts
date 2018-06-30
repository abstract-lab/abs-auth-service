import { Module } from '@nestjs/common';
import { ObjectsController } from './objects.controller';
import { SharedModule } from '../shared/shared.module';
import { DatabaseService } from '../shared/database/database.service';
import { DbServerService } from '../shared/database/dbServer.service';
import { AuthClassEnum, AuthDb } from '../utils/consts';
import { ObjectsService } from './objects.service';
import { LoggingService } from '../shared/logging/logging.service';

@Module({
    imports: [ SharedModule ],
    controllers: [ ObjectsController ],
    providers: [{
        provide: DatabaseService,
        useFactory: (server: DbServerService, logger: LoggingService) => new DatabaseService(server.getDb(AuthDb.Objects), logger),
        inject: [ DbServerService ],
    }, ObjectsService ],
})
export class ObjectsModule { }