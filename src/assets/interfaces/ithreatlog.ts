export interface IThreatLog {
    actualResult: boolean;
    creationTimestamp?: number;
    deviceMacAddress?: string;
    gateName?: string;
    id?: number;
    laneName?: string;
    note: string;
    threatLocation: string;
    threatType: string;
    updateTimestamp?: number;
    userName?: string;
    typeOfWeapon?: string;
    threatConfigId?: string;
}