import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'utcToLocal' })
export class UtcToLocal implements PipeTransform {
    transform(value: number): string {
        let timeOffset: number = new Date().getTimezoneOffset();
        var d = new Date(value);
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
        var nd = new Date(utc - (3600000*timeOffset));
        // return nd.toLocaleString();
        return new Date(new Date(utc) + "UTC").toLocaleString();


        // var newStr = new Date(new Date(value) + "UTC");

        // return newStr.toLocaleString();
    }
}