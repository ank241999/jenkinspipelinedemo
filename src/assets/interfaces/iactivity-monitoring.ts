export interface IActivityMonitoring {
    id?: string;
    noThreatConfig?: string;
    objectDetected?: boolean;
    devices?: string[];
    anomalies?: Anomalies;
    threats?: Threats;
    personsScannedId?: number[];
    actualResult?: boolean;
    creationTime?: string;
    creationTimestamp?: string;
    gateName?: string;
    logId?: number;
    is_viewed?: boolean;
    timeIn?: number;
    timeOut?: number;
    tabletName?: string;
    userName?: string;
    tid?: number;
    deviceName?: string;
    laneName?: string;
}

export interface OldActivityMonitoring {
    anomaly?: string;
    id?: string;
    noObjects?: boolean;
    noThreatConfig?: string;
    nonThreatCellphone?: string;
    nonThreatKeys?: string;
    threatHandgun?: string;
    threatPipeBomb?: string;
    threatKnife?: string;
    threatThreat?: string;

    threatRifle?: string;
    threatStatus?: boolean;
    creationTimestamp?: string
    threatDate?: Date;
    leftDeviceMacAddress?: string;
    is_viewed?: boolean;

    actualResult?: boolean;
    logId?: number;
    deviceName?: string;
    laneName?: string;
    gateName?: string;

    timeIn?: number;
    timeOut?: number;
    tabletName?: string;
    userName?: string;
    tid?: number;

    rightDeviceMacAddress?: string;
    creationTime?: string
}

export interface Anomalies {
    cellphone: string[];
    keys: string[];
    genericAnomaly: string[];
}

export interface Logactualthreat {
    isactual: boolean;
    threattype: string;
    weapon: string;
    location: string[];
}

export interface Threats {
    handgun: string[];
    rifle: string[];
    pipeBomb: string[];
    knife: string[];
    genericThreat: string[];
}

export class ActivityMonitoring {
    constructor(public id: string, public threatStatus: boolean, public creationTimestamp: string, public threatRifle: string, public threatPipeBomb: string) {
    }
}

export class ActivityMonitoringDate {
    constructor(public anomaly?: boolean,
        public id?: string,
        public objectDetected?: boolean,
        public noThreatConfig?: string,
        public nonThreatCellphone?: string,
        public nonThreatKeys?: string,
        public threatHandgun?: string,
        public threatPipeBomb?: string,
        public threatKnife?: string,
        public threatThreat?: string,
        public threatRifle?: string,
        public threatStatus?: boolean,
        public creationTimestamp?: string,
        public threatDate?: Date,
        public leftDeviceMacAddress?: string,
        public is_viewed?: boolean) { }
}
