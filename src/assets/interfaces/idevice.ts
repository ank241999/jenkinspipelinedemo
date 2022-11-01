import { ILane } from './ilane';

export interface IDevice {
    id?: number,
    creationTimestamp?: string,
    updateTimestamp?: string,
    name?: string,
    macAddress?: string,
    soundAddress?: string,
    lightingAddress?: string,
    leftProximitySensorAddress?: string,
    rightProximitySensorAddress?: string,
    physicalMark?: string,
    side?: string,
    status?: boolean,
    spathFlag?: boolean,
    tabletId?: string,
    // lane?: ILane,
    laneId?: number,
    laneName?: string,
    entranceId?: number,
    entranceName?: string,
    ipAddress?: string
}