export interface IRoleModule {
    roleId?: number;
    roleName?: string,
    moduleName?: string;
}

export class RoleModule {
    constructor(public roleId: number, public roleName: string, public moduleName: string) {
    }
}