import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationComponent } from '../../app/shared';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityConstants } from '../constants/activity-constants';
import { environment } from '../../environments/environment';

@Injectable()
export class NotificationService {
    mySnackBarRef: any;

    constructor(private http: HttpClient, public snackBar: MatSnackBar) { }

    showNotification(message, vpos, hpos, type, icon = ''): void {
        // for more info about Angular Material snackBar check: https://material.angular.io/components/snack-bar/overview
        this.mySnackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
            data: {
                message: message,
                icon,
                type,
                dismissible: true
            },
            duration: environment.notificationDuration,
            horizontalPosition: hpos, // 'start' | 'center' | 'end' | 'left' | 'right'
            verticalPosition: vpos, // 'top' | 'bottom'
            panelClass: ['notification-wrapper']
        });
        // this is to be able to close it from the NotificationComponent
        this.mySnackBarRef.instance.snackBarRef = this.mySnackBarRef;
    }
}
