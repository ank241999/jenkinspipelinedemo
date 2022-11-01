import { NgModule } from '@angular/core';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

// Top navbar stuff
import { MessagesMenuComponent } from './top-navbar/messages-menu/messages-menu.component';
import { MessagesMenuService } from './top-navbar/messages-menu/messages-menu.service';
import { NotificationsMenuButtonComponent } from './top-navbar/notifications-menu/button/notifications-menu-button.component';
import { NotificationsMenuContentComponent } from './top-navbar/notifications-menu/content/notifications-menu-content.component';
import { NotificationsMenuService } from './top-navbar/notifications-menu/notifications-menu.service';
import { SearchBarComponent } from './top-navbar/search-bar/search-bar.component';
import { TopNavbarContentComponent } from './top-navbar/content/top-navbar-content.component';

// Side menu stuff
import { CondenseMenuComponent } from './side-menu/condense/condense.component';
import { MenuTopItemsComponent } from './side-menu/top-items/top-items.component';
import { SideMenuContentComponent } from './side-menu/content/side-menu-content.component';
import { SideMenuService } from './side-menu/side-menu.service';

// 404 page stuff
import { Error404PageComponent } from './404/error-404-page.component';
import { Error404PageResolver } from './404/error-404-page.resolver';

import { ResponsiveBreakpointsComponent } from './responsive-breakpoints/responsive-breakpoints.component';
import { ResponsiveBreakpointDirective } from './responsive-breakpoints/responsive-breakpoint.directive';
import { ResponsiveBreakpointsService } from './responsive-breakpoints/responsive-breakpoints.service';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Required modules
import { SharedModule } from '../shared';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    // Top navbar stuff
    MessagesMenuComponent,
    NotificationsMenuButtonComponent,
    NotificationsMenuContentComponent,
    SearchBarComponent,
    TopNavbarContentComponent,
    // Side menu stuff
    CondenseMenuComponent,
    MenuTopItemsComponent,
    SideMenuContentComponent,
    // 404
    Error404PageComponent,
    // Responsive stuff
    ResponsiveBreakpointDirective,
    ResponsiveBreakpointsComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule,TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:[HttpClient]
      }
    }),
  ],
  providers: [
    MessagesMenuService,
    NotificationsMenuService,
    SideMenuService,
    // 404
    Error404PageResolver,
    // Responsive stuff
    ResponsiveBreakpointsService
  ],
  exports: [
    BreadcrumbComponent,
    TopNavbarContentComponent,
    SideMenuContentComponent,
    NotificationsMenuContentComponent,
    // 404
    Error404PageComponent,
    // Responsive stuff
    ResponsiveBreakpointsComponent
  ]
})
export class CoreModule { }
export function HttpLoaderFactory(http : HttpClient){
  return new TranslateHttpLoader(http);
}