import * as joi from 'joi';

import { ObjectModelDto, ObjectModelSchema } from './object.model';

export class VerbModelDto extends ObjectModelDto { }

export const VerbModelSchema = ObjectModelSchema.keys({
    // type: joi.string(),
});
