import * as OrientDb from 'orientjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DATABASES, AuthDb, AuthType, AuthClass, AuthField, AuthClassEnum } from '../../utils/consts';
import { LoggingService } from '../logging/logging.service';

export class DatabaseService {
    constructor(private database: OrientDb.ODatabase, private logger: LoggingService) { }

    public async create(type: AuthClassEnum, data: any): Promise<OrientDb.Record> {
        let result: OrientDb.Record = null;

        try {
            const _class = await this.database.class.get(type);
            result = await _class.create(data);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return result;
    }

    public async find(type: AuthClassEnum, filter: any, limit: number = 0, offset: number = 0): Promise<OrientDb.Record[]> {
        const result: OrientDb.Record[] = [];

        try {
            const _class = await this.database.class.get(type);
            result.push(... await _class.find(filter, limit, offset));
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return result;
    }
}