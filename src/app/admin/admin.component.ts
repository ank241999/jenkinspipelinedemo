import { Component, ViewChild, ViewEncapsulation, PLATFORM_ID, Inject } from '@angular/core';
import { SideMenuService } from '../core';
import { isPlatformBrowser } from '@angular/common';

import { IActivityMonitoring } from '../../assets/interfaces/iactivity-monitoring';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin.component.html',
  styleUrls: ['../styles/app.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdminComponent {
  @ViewChild('drawerContainer', { static: true }) drawerContainer;
  @ViewChild('sideMenu', { static: true }) sideMenu;

  open_menu = false;

  messages = [];
  notifications = [];
  messageHistory = [];
  acmList: IActivityMonitoring[] = [];
  acm: IActivityMonitoring = {};
  state: string = "NOT CONNECTED";
  timerFlag: boolean = false;

  constructor(
    private sideMenuService: SideMenuService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngAfterContentInit(): void {
    this.sideMenuService.sidenav = this.sideMenu;
    this.sideMenuService.drawerContainer = this.drawerContainer;
    if (isPlatformBrowser(this.platformId)) {
      this.open_menu = false;
    }
  }
}
