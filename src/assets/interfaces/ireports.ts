import { IRole } from './irole';

export interface IThreatActivity {
    id?: number,
    noThreatConfig?: string,
    noObjects?: boolean,
    threatHandgun?: string,
    threatRifle?: string,
    threatPipeBomb?: string,
    threatKnife?: string,
    threatThreat?: string,
    anomaly?: string,
    nonThreatCellphone?: string,
    nonThreatKeys?: string,
    threatStatus?: string,
    creationTimestamp?: number,
    updateTimestamp?: number
}

export interface IWeaponDetected {
    handgun?: number,
    rifle?: number,
    pipeBomb?: number,
    anomaly?: number,
    cellphone?: number,
    knife?: number,
    threat?: number,
    keys?: number,
    threatDate?: number,
    threatPosition?: string;
}

export interface IAnalyticReport {
    totalThreatThreat?: number,
    leftscapulafront?: number,
    rightscapulafront?: number,
    rightscapulaback?: number,
    rightfrontpocket?: number,
    isCorrect?: boolean,
    totalCorrect?: number,
    totalIncorrect?: number,
    threatTypes?: number,
    totalThreat?: number,
    totalAnomaly?: number,
    totalNoThreat?: number,
    weapons?: number,
    totalHandgun?: number,
    totalPipeBomb?: number,
    totalRifle?: number,
    totalKnife?: number,
    totalCellphone?: number,
    totalKeys?: number,
    locations?: number,
    leftchestfront?: number,
    leftchestback?: number,
    rightchestfront?: number,
    rightchestback?: number,
    leftscapulaback?: number,
    abdomenfront?: number,
    abdomenback?: number,
    centerback?: number,
    centerlowerback?: number,
    leftthighfront?: number,
    leftthighback?: number,
    rightthighfront?: number,
    rightthighback?: number,
    leftfrontpocket?: number,
    leftbackpocket?: number,
    rightbackpocket?: number,
    lefthipfront?: number,
    lefthipback?: number,
    righthipfront?: number,
    righthipback?: number,
    leftAnkle?: number,
    rightAnkle?: number
}

export interface IThreatLogReport {
    threatTime?: number,
    guardName?: string,
    configWeaponType?: string,
    configThreatLocation?: string,
    configThreatType?: string,
    logWeaponType?: string,
    logThreatLocation?: string,
    logThreatType?: string,
    deviceName?: string,
    gateName?: string,
    laneName?: string,
    creationDate?: string,
    updateDate?: string,
    testLogId?: number,
    threatConfigId?: number,
    actualResult?: boolean,
    deviceMacAddress?: string,
    side?: string,
    note?: string,
    totalRecord?: string,
    maxTotalRecord?: string
}

export interface IThroughput {
    date?: number,
    hour?: number,
    total?: number,
    totalpersons?: number
}

export interface IPersonScannedDetails {
    objectids?: string,
    total_threat?: number,
    total_anomaly?: number,
    total_non_threat?: number,
    total_noobject?: number,
    total?: number
}

export class IReportThroughputDate {
    constructor(public anomaly?: boolean,
        public id?: string,
        public noObjects?: boolean,
        public noThreatConfig?: string,
        public nonThreatCellphone?: string,
        public nonThreatKeys?: string,
        public threatHandgun?: string,
        public threatPipeBomb?: string,
        public threatRifle?: string,
        public threatStatus?: string,
        public creationTimestamp?: string,
        public threatDate?: Date) { }
}