import * as OrientDb from 'orientjs';
import * as joi from 'joi';

export abstract class ObjectModelDto {
    id: string;
    name: string;
    constructor(record: OrientDb.Record) {
        this.id = `${record['@rid'].cluster || 0}_${record['@rid'].position || 0}`;
        this.name = (record as any).name;
    }
}

export const ObjectModelSchema = joi.object().keys({
    name: joi.string().required().min(3).max(20),
});