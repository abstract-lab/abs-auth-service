import { MessagePattern } from '@nestjs/microservices';
import { Controller, UsePipes } from '@nestjs/common';

import { JoiValidationPipe } from '../pipes/joi.validation.pipe';
import { EntityModelDto } from '../models/entity.model';
import { ObjectsService } from './objects.service';
import { ObjectModelSchema } from '../models/object.model';
import { VerbModelDto } from '../models/verb.model';

@Controller()
export class ObjectsController {
    constructor(private service: ObjectsService) { }

    @UsePipes(new JoiValidationPipe(ObjectModelSchema))
    @MessagePattern({ cmd: 'create-entity' })
    async subscribeCreateEntity(data: EntityModelDto): Promise<EntityModelDto> {
        return await this.service.createEntity(data);
    }

    @UsePipes(new JoiValidationPipe(ObjectModelSchema))
    @MessagePattern({ cmd: 'create-verb' })
    async subscribeCreateVerb(data: VerbModelDto): Promise<VerbModelDto> {
        return await this.service.createVerb(data);
    }

    @MessagePattern({ cmd: 'find-entities' })
    async subscribeFindEntities(data: any): Promise<EntityModelDto[]> {
        const filter = data.filter;
        const limit = data.limit;
        const offset = data.offset;

        return await this.service.findEntities(filter, limit, offset);
    }

    @MessagePattern({ cmd: 'find-verbs' })
    async subscribeFindVerbs(data: any): Promise<VerbModelDto[]> {
        const filter = data.filter;
        const limit = data.limit;
        const offset = data.offset;

        return await this.service.findVerbs(filter, limit, offset);
    }
}