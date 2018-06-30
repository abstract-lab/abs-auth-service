import { Injectable } from '@nestjs/common';
import * as OrientDb from 'orientjs';

import { DatabaseService } from '../shared/database/database.service';
import { EntityModelDto } from '../models/entity.model';
import { AuthClassEnum } from '../utils/consts';
import { VerbModelDto } from '../models/verb.model';

@Injectable()
export class ObjectsService {
    constructor(private service: DatabaseService) { }

    public async createEntity(model: EntityModelDto): Promise<EntityModelDto> {
        const result = await this.service.create(AuthClassEnum.ciEntity, model);
        return new EntityModelDto(result);
    }

    public async createVerb(model: EntityModelDto): Promise<VerbModelDto> {
        const result = await this.service.create(AuthClassEnum.ciVerb, model);
        return new VerbModelDto(result);
    }

    public async findEntities(filter: any, limit: number, offset: number): Promise<EntityModelDto[]> {
        const result = await this.service.find(AuthClassEnum.ciEntity, filter, limit, offset);

        return result.map(r => new EntityModelDto(r));
    }

    public async findVerbs(filter: any, limit: number, offset: number): Promise<VerbModelDto[]> {
        const result = await this.service.find(AuthClassEnum.ciVerb, filter, limit, offset);

        return result.map(r => new VerbModelDto(r));
    }
}