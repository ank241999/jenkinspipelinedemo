import { IEntrance } from './ientrance';

export interface ILane {
    id?: number,
    creationTimestamp?: string,
    updateTimestamp?: string,
    laneName?: string,
    entrance?: IEntrance,
}