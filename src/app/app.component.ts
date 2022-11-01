import { AfterContentInit, Component, ViewChild, ViewEncapsulation, PLATFORM_ID, Inject } from '@angular/core';
import { MessagesMenuService, NotificationsMenuService, SideMenuService } from './core';
import { isPlatformBrowser } from '@angular/common';
import { ShareDataService } from '../assets/services/share-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./styles/app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterContentInit {
  @ViewChild('drawerContainer', { static: true }) drawerContainer;
  @ViewChild('sideMenu', { static: true }) sideMenu;
  @ViewChild('sideNotifications', { static: true }) sideNotifications;

  notifications = [];
  messages = [];
  open_menu = false;

  constructor(
    private sideMenuService: SideMenuService,
    private notificationsMenuService: NotificationsMenuService,
    private messagesMenuService: MessagesMenuService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private shareDataService: ShareDataService
  ) {
    shareDataService.setApplicationVariables();
    notificationsMenuService.getNotifications().then((notifications: any) => {
      this.notifications = notifications;
    });
    messagesMenuService.getMessages().then((messages: any) => {
      this.messages = messages;
    });    
  }

  ngAfterContentInit(): void {
    this.sideMenuService.sidenav = this.sideMenu;
    this.sideMenuService.drawerContainer = this.drawerContainer;
    this.notificationsMenuService.sidenav = this.sideNotifications;
    if (isPlatformBrowser(this.platformId)) {
      this.open_menu = true;
    }
  }
}
