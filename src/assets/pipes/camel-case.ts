import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'camelCase' })
export class CamelCase implements PipeTransform {
    transform(value: string): string {
        let newStr: string = "";
        if (value != null && value.length > 0) {
            newStr = value.substring(0, 1).toUpperCase() + value.substring(1, value.length);
        }
        return newStr;
    }
}