export interface IRoles {
    id?: number;
    roleName?: string,
    isactive?: boolean,
    createdTimestamp?: number;
}

export class Roles {
    constructor(public id: number, public roleName: string, public isactive: boolean, createdTimestamp: number) {
    }
}