import { IDevice } from './idevice'
export interface ITablet{
    id?: number,
    creationTimestamp?: string,
    updateTimestamp?: string,
    tabletName?: string,
    tabletStatus?: boolean,
    tabletMacAddress?: string,
    primaryTablet?: boolean,
    devices?: IDevice[]
}