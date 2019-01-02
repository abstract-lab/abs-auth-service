import { Module } from '@nestjs/common';

import { LoggingService } from './shared/logging/logging.service';
import { DbServerService } from './shared/database/dbServer.service';
import { ObjectsModule } from './objects/objects.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ SharedModule, ObjectsModule ],
})
export class AppModule {
  constructor(private dbServer: DbServerService, private loggingService: LoggingService) { }
  async onModuleInit() {
    this.loggingService.connect();
    this.loggingService.getLogger().info('Application module initialised');

    // await this.dbServer.initialisation();
  }
}
