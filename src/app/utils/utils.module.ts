import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared';

import { AutoCompleterService } from './services/auto-completer.service';
import { AlertsPageComponent } from './pages/alerts/alerts.page.component';
import { AutoCompleterPageComponent } from './pages/auto-completer/auto-completer.component';
import { FileUploaderPageComponent } from './pages/file-uploader/file-uploader.page.component';
import { ModalsPageComponent } from './pages/modals/modals.component';
import { NotificationsPageComponent } from './pages/notifications/notifications.page.component';

import { LoginModalComponent } from './pages/modals/templates/login/login.component';
import { RegisterModalComponent } from './pages/modals/templates/register/register.component';

export const utilsRoutes = [
  {
    path: '',
    redirectTo: 'file-uploader'
  },
  {
    path: 'file-uploader',
    component: FileUploaderPageComponent
  },
  {
    path: 'auto-completer',
    component: AutoCompleterPageComponent
  },
  {
    path: 'modals',
    component: ModalsPageComponent
  },
  {
    path: 'notifications',
    component: NotificationsPageComponent
  },
  {
    path: 'alerts',
    component: AlertsPageComponent
  }
];

@NgModule({
  declarations: [
    FileUploaderPageComponent,
    AutoCompleterPageComponent,
    ModalsPageComponent,
    NotificationsPageComponent,
    LoginModalComponent,
    RegisterModalComponent,
    AlertsPageComponent
  ],
  providers: [
    AutoCompleterService,
  ],
  entryComponents: [
    LoginModalComponent,
    RegisterModalComponent
  ],
  imports: [
    RouterModule.forChild(utilsRoutes),
    SharedModule
  ]
})
export class UtilsModule { }
