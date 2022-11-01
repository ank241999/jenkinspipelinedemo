export interface IActivityDashboard {
    id?: string,
    status?: string,
    time?: string;
    threatIcon?: string;
    timestamp?: string;
    threatType?: string;
    
    leftDeviceId?: number,
    leftDeviceName?: string,
    leftDeviceMacAddress?: string,
    leftDeviceStatus?: boolean,

    rightDeviceId?: number,
    rightDeviceName?: string,
    rightDeviceMacAddress?: string,
    rightDeviceStatus?: boolean,

    laneID?: number,
    laneName?: string,
    tabletId?: string,
    entranceId?: number,
    entranceName?: string,

    guardName?: string
}

export class ActivityDashboard {
    constructor(public id: string, public status: string, public time: string, public threatIcon: string, public timestamp: string, public threatType: string,
        public leftDeviceId: number,
        public leftDeviceName: string,
        public leftDeviceMacAddress: string,
        public leftDeviceStatus: boolean,

        public rightDeviceId: number,
        public rightDeviceName: string,
        public rightDeviceMacAddress: string,
        public rightDeviceStatus: boolean,

        public laneID: number,
        public laneName: string,
        public tabletId: string,
        public entranceId: number,
        public entranceName: string,
        public guardName: string) {
    }

    // constructor(){}
}