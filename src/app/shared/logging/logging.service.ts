import { Injectable, LoggerService } from '@nestjs/common';

import * as winston from 'winston';

@Injectable()
export class LoggingService {
    constructor(private config: winston.LoggerOptions) { }
    private winstonLogger: winston.Logger;

    public async connect(): Promise<void> {
        this.winstonLogger = winston.createLogger(this.config);
    }

    public getLogger(): winston.Logger {
        return this.winstonLogger;
    }
}