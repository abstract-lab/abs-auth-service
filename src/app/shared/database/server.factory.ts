import * as OrientDb from 'orientjs';

import { ConfigurationService } from '../configuration/configuration.service';
import { LoggingService } from '../logging/logging.service';
import { DbServerService } from './dbServer.service';

export const serverFactory = async (configManager: ConfigurationService, loggingService: LoggingService) => {
    const config = configManager.getSettings();

    const options: OrientDb.ServerConfig = {
        host: process.env.DB_HOST || config.db.host,
        port: process.env.DB_PORT || config.db.port,
        username: process.env.DB_USERNAME || config.db.username,
        password: process.env.DB_PASSWORD || config.db.password,
    };

    const serverService = new DbServerService(options, loggingService);
    await serverService.connect();
    return serverService;
};
