import { IUser } from '../interfaces/iuser';
import { ILocation } from '../interfaces/ilocation';
import { ICustomer } from '../interfaces/icustomer';
import { IDevice } from './idevice';
import { IActivityMonitoring } from './iactivity-monitoring'
import { ITablet } from './itablet';
import { IAnalyticReport, IThreatActivity, IThroughput, IWeaponDetected } from './ireports';
import { IThreatLog } from './ithreatlog';

export interface IResponse {
    status?: number,
    data?: IUser[]
}

export interface ILocationResponse {
    status?: number,
    data?: ILocation[]
}

export interface ICustomerResponse {
    status?: number,
    data?: ICustomer[]
}

export interface IDeviceResponse {
    status?: number,
    data?: IDevice[]
}

export interface ITabletResponse {
    status?: number,
    data?: ITablet[]
}

export interface IActivityMonitoringResponse {
    status?: number,
    data?: IActivityMonitoring[]
}

export interface IAnalyticReportResponse {
    status?: number,
    data?: IAnalyticReport[]
}

export interface IWeaponDetectedResponse {
    status?: number,
    data?: IWeaponDetected[]
}

export interface IThroughputResponse {
    status?: number,
    data?: IThroughput[]
}

export interface IThreatActivityResponse {
    status?: number,
    data?: IThreatActivity[]
}

export interface IThreatLogsResponse {
    status?: number,
    data?: IThreatLog[]
}