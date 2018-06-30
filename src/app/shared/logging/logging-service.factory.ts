import * as winston from 'winston';

import { ConfigurationService } from '../configuration/configuration.service';
import { LoggingService } from './logging.service';

export const logginsServiceFactory = async (configManager: ConfigurationService) => {
    const config = configManager.getSettings();

    const loggingOptions: winston.LoggerOptions = {
        format: winston.format.colorize(),
        transports: new winston.transports.Console(),
    };

    const loggingService = new LoggingService(loggingOptions);
    await loggingService.connect();
    return loggingService;
};
