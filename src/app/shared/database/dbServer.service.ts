import { Injectable } from '@nestjs/common';
import * as OrientDb from 'orientjs';

import { LoggingService } from '../logging/logging.service';
import { DATABASES, AuthType, AuthClass, AuthField, AuthClassEnum } from '../../utils/consts';

@Injectable()
export class DbServerService {
    private server: OrientDb.Server;

    constructor(private options: OrientDb.ServerConfig, private logger: LoggingService) { }

    public async connect(): Promise<void> {
        try {
            this.server = OrientDb(this.options);
            this.server.init();

            this.logger.getLogger().log('info', `Connected to OrientDb: ${this.options.host}`);
        } catch (error) {
            this.logger.getLogger().log('error', `Error while connecting to the server: ${error}`);
        }
    }

    public async initialisation(): Promise<void> {
        try {
            this.server = OrientDb(this.options);

            for (const db of DATABASES) {
                const database = await this.createDatabase(db);
                const classes = await this.createClasses(database, db.classes);
                const properties = await this.createProperties(db.classes, classes);
            }
        } catch (error) {
            this.logger.getLogger().log('error', `Error connecting to server: ${JSON.stringify(error)}`);
        }
    }

    public getDb(authDatabase: AuthType): OrientDb.ODatabase {
        this.server.init();

        return this.server.use(authDatabase.name);
    }

    private async createDatabase(db: AuthType): Promise<OrientDb.Db> {
        return new Promise<OrientDb.Db>(async (fulfill, reject) => {
            const exists = await this.server.exists(db.name);
            let result: OrientDb.Db;

            if (exists) {
                this.logger.getLogger().info(`Database ${db.name} already exists.`);
                result = this.server.use(db.name);
            } else {
                this.logger.getLogger().info(`Created missing database: ${db.name} of type ${db.type}.`);
                try {
                    result = await this.server.create({ name: db.name, type: db.type });
                } catch (error) {
                    reject(error);
                }
            }

            fulfill(result);
        });
    }

    private async createClasses(db: OrientDb.Db, classes: AuthClass[]): Promise<OrientDb.Class[]> {
        return new Promise<OrientDb.Class[]>(async (fulfill, reject) => {
            const result: OrientDb.Class[] = [];
            const existingClasses: OrientDb.Class[] = await db.class.list(0);

            for (const _class of classes) {
                let createdClass: OrientDb.Class = existingClasses.find(c => c.name === _class.name);

                if (! createdClass) {
                    this.logger.getLogger().info(`Created missing class: ${_class.name}.`);
                    try {
                        createdClass = await db.class.create(_class.name, _class.parentName, null, _class.isAbstract, false);
                    } catch (error) {
                        reject(error);
                    }
                }

                result.push(createdClass);
            }

            fulfill(result);
        });
    }

    private async createProperties(classes: AuthClass[], dbClasses: OrientDb.Class[]): Promise<OrientDb.Property[]> {
        return new Promise<OrientDb.Property[]>(async (fulfill, reject) => {
            const result: OrientDb.Property[] = [];

            for (const _class of classes) {
                const dbClass = dbClasses.find(c => c.name === _class.name);

                const properties = await dbClass.property.list();
                let property: OrientDb.Property = null;

                for (const prop of _class.fields) {
                    property = properties.find(p => p.name === prop.name);

                    if (! property) {
                        this.logger.getLogger().info(`Created missing property: ${prop.name}.`);
                        try {
                            property = await dbClass.property.create({ name: prop.name, type: prop.type, mandatory: prop.mandatory,
                                readonly: prop.readOnly, notNull: prop.notNull, max: prop.max, min: prop.min } as OrientDb.PropertyCreateConfig);
                        } catch (error) {
                            reject(error);
                        }
                    }

                    result.push(property);
                }
            }

            fulfill(result);
        });
    }
}