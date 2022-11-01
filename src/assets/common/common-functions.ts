import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class CommonFunctions {
    constructor(private http: HttpClient) {
    }

    httpGet(url: string): Observable<Object> {
        return this.http.get<Object>(url)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    httpGetList(url: string): Observable<Object[]> {
        return this.http.get<Object[]>(url)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    handleError(error) {
        if (error.error instanceof ErrorEvent) {
            // client-side error
            return throwError({ message: error.error.message });
        } else {
            // server-side error
            return throwError(error);
        }
    }
}