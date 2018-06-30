import * as joi from 'joi';

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private readonly schema: joi.SchemaLike) { }

    transform(value: any, metadata: ArgumentMetadata) {
        const { error } = joi.validate(value, this.schema);

        if (error) {
            throw new BadRequestException('Validation failed');
        }

        return value;
    }
}