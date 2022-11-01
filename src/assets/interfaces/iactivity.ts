export interface IActivity {
    id?: string;
    status?: string,
    time?: string;
    threatIcon?: string;
    timestamp?: string;
    threatType?: string;
    threatConfigId?: number;
    deviceId?: number
    actualResult?: boolean;

    deviceName?: string;
    laneName?: string;
    gateName?: string;

    timeIn?: number;
    timeOut?: number;
    tabletName?: string;
    userName?: string;
    tid?: number
}

export class Activity {
    constructor(public id: string, public status: string, public time: string, public threatIcon: string, public timestamp: string, public threatType: string,
        public threatConfigId?: number,
        public deviceId?: number,
        public actualResult?: boolean,
        public deviceName?: string, public laneName?: string, public gateName?: string,
        public timeIn?: number, public timeOut?: number, public tabletName?: string, public userName?: string, public tid?: number) {
    }
}