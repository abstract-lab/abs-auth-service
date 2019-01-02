import * as winston from 'winston';

import { Listener } from './listener';
import { RabbitMessageQueue } from 'app/shared/mq/rabbit.mq.component';

export class InfoListener implements Listener {
    constructor(private mq: RabbitMessageQueue, private logger: winston.Logger) { }
    readonly patternString: string = '*.request.info';
    readonly queueName: string = 'AuthInfoQueue';
    readonly exchangeName: string = 'GatewayEvents';

    async onMessageReceived(msg: any): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (msg && msg.content) {
                this.logger.info(`Received message on ${this.queueName} queue`);

                try {
                    this.mq.sendToQueue({
                        queue: msg.properties.replyTo,
                        content: {},
                        options: {},
                    });
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