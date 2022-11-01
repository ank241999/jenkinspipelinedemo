import { Component, Input } from '@angular/core';
import { NotificationsMenuService } from '../notifications-menu.service';
import { Router } from '@angular/router';
import { CommunicationService } from '../../../../../assets/services/communication-service';

@Component({
  selector: 'app-notifications-menu-button',
  styleUrls: ['../../content/styles/menus-buttons.scss'],
  templateUrl: './notifications-menu-button.component.html'
})
export class NotificationsMenuButtonComponent {
  @Input() notifications = [];

  constructor(private notificationsMenuService: NotificationsMenuService,
    private router: Router, private communicationService: CommunicationService) {
    this.notifications = []; 

    notificationsMenuService.getNotifications().then(res => {
      this.notifications = res;
    });
  }

  toggleNotificationsMenu(): void {
    this.notificationsMenuService.sidenav.toggle();
  }

  showNotifications() {
    this.notifications = [];
    this.router.navigateByUrl('/admin/dashboard/notifications');
  }
}
