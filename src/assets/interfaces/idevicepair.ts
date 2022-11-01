export interface IDevicePair {
    leftDeviceId?: number,
    leftDeviceName?: string,
    leftDeviceMacAddress?: string,
    leftDeviceStatus?: boolean,
    isleftDeviceSPath?: boolean,

    rightDeviceId?: number,
    rightDeviceName?: string,
    rightDeviceMacAddress?: string,
    rightDeviceStatus?: boolean,
    isrightDeviceSPath?: boolean,

    laneName?: string,
    laneId?: number,
    tabletId?: number
}

export class DevicePair {
    constructor(public leftDeviceId?: number,
        public leftDeviceName?: string,
        public leftDeviceMacAddress?: string,
        public leftDeviceStatus?: boolean,
        public isleftDeviceSPath?: boolean,

        public rightDeviceId?: number,
        public rightDeviceName?: string,
        public rightDeviceMacAddress?: string,
        public rightDeviceStatus?: boolean,
        public isrightDeviceSPath?: boolean,

        public laneName?: string,
        public laneId?: number,
        public tabletId?: number) { }
}