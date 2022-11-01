import { ILocation } from './ilocation';

export interface IEntrance {
    id?: number,
    creationTimestamp?: string,
    updateTimestamp?: string,
    name?: string,
    location?: ILocation,
    xcoordinate?: number,
    ycoordinate?: number
}