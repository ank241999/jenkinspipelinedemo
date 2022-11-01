import { ICustomer } from './icustomer';

export interface ILocation {
    id?: number,
    creationTimestamp?: string,
    updateTimestamp?: string,
    name?: string,
    customer?: ICustomer,
    logoImageName?: string,
    logoImagePath?: string,
    footPrintImageName?: string,
    footPrintImagePath?: string
}