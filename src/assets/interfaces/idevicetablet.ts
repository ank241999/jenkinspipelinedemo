export interface IDeviceTablet {
    deviceIds?: number[],
    tabletId?: number,
    tabletMacAddress?: string,
    tabletName?: string,
    tabletStatus?: boolean
}

export class DeviceTablet {
    constructor(public deviceIds: number[],
        public tabletId: number,
        public tabletMacAddress: string,
        public tabletName: string,
        public tabletStatus: boolean) {
    }
}