export enum AuthClassEnum {
    ciObject = 'ciObject',
    ciEntity = 'ciEntity',
    ciRole = 'ciRole',
    ciVerb = 'ciVerb',
}

export interface AuthField {
    name: string;
    type: string;
    mandatory?: boolean;
    readOnly?: boolean;
    notNull?: boolean;
    min?: number;
    max?: number;
}

export interface AuthClass {
    name: string;
    parentName: string;
    isAbstract: boolean;
    fields: AuthField[];
}

export interface AuthType {
    name: string;
    type: string;
    classes: AuthClass[];
}

export class AuthDb {
    public static Objects: AuthType = {
        name: 'ci-auth-objects',
        type: 'graph',
        classes: [{
            name: 'ciObject',
            parentName: 'V',
            isAbstract: true,
            fields: [{
                name: 'name',
                type: 'String',
                mandatory: true,
                notNull: true,
                readOnly: true,
                min: 3,
                max: 20,
            }],
        }, {
            name: 'ciEntity',
            parentName: 'ciObject',
            isAbstract: false,
            fields: [],
        }, {
            name: 'ciRole',
            parentName: 'ciObject',
            isAbstract: false,
            fields: [],
        }, {
            name: 'ciVerb',
            parentName: 'ciObject',
            isAbstract: false,
            fields: [],
        }, {
            name: 'IS_ALLOWED',
            parentName: 'E',
            isAbstract: false,
            fields: [],
        }],
    };

    public static Resources: AuthType = {
        name: 'ci-auth-resources',
        type: 'graph',
        classes: [],
    };

    public static Users: AuthType = {
        name: 'ci-auth-users',
        type: 'document',
        classes: [],
    };
}

export const DATABASES: AuthType[] = [
        AuthDb.Objects,
        AuthDb.Resources,
        AuthDb.Users,
    ];
