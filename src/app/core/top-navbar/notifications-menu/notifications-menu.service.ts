import { Injectable } from '@angular/core';

@Injectable()
export class NotificationsMenuService {
  sidenav: any;
  public notifications = [
    // {
    //   type: 'social',
    //   title: 'Lorem Ipsum',
    //   text: 'Lorem Ipsum Lorem Ipsum',
    //   time: 'JUST NOW'
    // },
    // {
    //   type: 'alert',
    //   title: 'Lorem Ipsum',
    //   text: 'Lorem Ipsum Lorem Ipsum',
    //   time: 'Yesterday'
    // },
    // {
    //   type: 'promotion',
    //   title: 'Lorem Ipsum',
    //   text: 'Lorem Ipsum Lorem Ipsum',
    //   time: 'June 4'
    // },
    // {
    //   type: 'update',
    //   title: 'Lorem Ipsum',
    //   text: 'Lorem Ipsum Lorem Ipsum',
    //   time: 'June 2'
    // },
    // {
    //   type: 'done',
    //   title: 'Lorem Ipsum',
    //   text: 'Lorem Ipsum Lorem Ipsum',
    //   time: 'May 28'
    // },
    // {
    //   type: 'contact',
    //   title: 'Lorem Ipsum',
    //   text: 'Lorem Ipsum',
    //   time: 'May 25'
    // }
  ];

  getNotifications(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.notifications), 1000);
    });
  }

  setNotifications(notification: any) {
    this.notifications.push(notification);
  }

  removeNotification(id) {
    let tmpNotifications = this.notifications.filter(a => a.id === id);
    if (tmpNotifications.length > 0) {
      this.notifications.splice(this.notifications.indexOf(tmpNotifications[0]), 1);
    }
  }

  removeAllNotifications() {
    this.notifications = [];
  }
}
