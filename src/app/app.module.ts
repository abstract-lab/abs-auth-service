import { Module } from '@nestjs/common';
import * as bonjour from 'bonjour';

import { LoggingService } from './shared/logging/logging.service';
import { DbServerService } from './shared/database/dbServer.service';
import { ObjectsModule } from './objects/objects.module';
import { SharedModule } from './shared/shared.module';
import { ListenersModule } from './listeners/listener.module';
import { ListenerService } from './listeners/listener.service';

@Module({
  imports: [ SharedModule, ObjectsModule, ListenersModule ],
})
export class AppModule {
  constructor(private dbServer: DbServerService, private loggingService: LoggingService, private listenerService: ListenerService) { }
  async onModuleInit() {
    this.loggingService.connect();

    try {
      this.loggingService.getLogger().info(`Initialising Auth Service`);
      const service = bonjour();
      service.publish({ type: 'rue-service', name: 'abs-auth-service', port: 5000 });

      this.listenerService.listen();
    } catch (e) {
      this.loggingService.getLogger().error(`Error initialising Auth Service: ${e}`);
    }

    // await this.dbServer.initialisation();
  }
}
