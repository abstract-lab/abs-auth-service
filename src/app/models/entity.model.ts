import * as joi from 'joi';

import { ObjectModelDto, ObjectModelSchema } from './object.model';

export class EntityModelDto extends ObjectModelDto { }

export const EntityModelSchema = ObjectModelSchema.keys({
    // type: joi.string(),
});
