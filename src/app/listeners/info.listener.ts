import * as winston from 'winston';

import { Listener } from './listener';

export class InfoListener implements Listener {
    constructor(private logger: winston.Logger) { }
    readonly patternString: string = 'auth.*.info';
    readonly queueName: string = 'AuthInfoQueue';

    async onMessageReceived(msg: any): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (msg && msg.content) {
                this.logger.info(`Received message on ${this.queueName} queue`);

                try {
                } catch (err) {
                    this.logger.error(`Error executing saga: ${err}`);
                } finally {
                    resolve(true);
                }
            } else {
                this.logger.error(`Error processing sync mq: ${JSON.stringify(msg)}`);
                reject(`Error processing sync mq: ${JSON.stringify(msg)}`);
            }
        });
    }

}