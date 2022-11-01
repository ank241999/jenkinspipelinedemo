import { Injectable, EventEmitter,  } from "@angular/core";
@Injectable()
export class CommunicationService {
    // 1
    id: Object;
     
     
    receivedFilter: EventEmitter<Object>;
    constructor() {
        this.receivedFilter = new EventEmitter<number>();
    }
    // 2
    raiseEvent(id: Object): void {
        this.id = id;
        this.receivedFilter.emit(id);
    }
}