import * as amqp from 'amqplib';
import { ClientProxy, ReadPacket, WritePacket, Server, CustomTransportStrategy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { isString } from 'util';

export class RabbitMQServer extends Server implements CustomTransportStrategy {
  private readonly connectionOptions: amqp.Options.Connect;
  private readonly queue: string;
  private server: amqp.Connection;
  private channel: amqp.Channel;

  constructor(options) {
    super();
    this.connectionOptions = {
      hostname: options.hostname,
      port: options.port,
      username: options.username,
      password: options.password,
    };

    this.queue = options.queue;
  }

  async init(): Promise<void> {
    this.server = await amqp.connect(this.connectionOptions);
    this.channel = await this.server.createChannel();
    this.channel.assertQueue(`${this.queue}`, { durable: false });
  }
  close() {
    this.channel && this.channel.close();
    this.server && this.server.close();
  }

  async listen(callback: () => void) {
    await this.init();

    this.channel.consume(`${this.queue}`, this.handleMessage.bind(this), {
      noAck: true,
    });
  }

  private async handleMessage(message, server, callback: (err, result, disposed?: boolean) => void) {
    const { content } = message;
    const messageObj = JSON.parse(content.toString('utf8'));

    const handlers = this.getHandlers();
    const pattern = JSON.stringify(messageObj.pattern);
    if (!this.messageHandlers[pattern]) {
        return;
    }

    const handler = this.messageHandlers[pattern];
    const response$ = this.transformToObservable(await handler(messageObj.data)) as Observable<any>;

    response$ && this.send(response$, (data) => {
      const buffer = Buffer.from(JSON.stringify(data));
      this.channel.sendToQueue(message.properties.replyTo, buffer, {correlationId: message.properties.correlationId});
    });
  }
}