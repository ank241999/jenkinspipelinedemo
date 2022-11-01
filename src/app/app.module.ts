import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';

//import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from './../environments/environment';

import { rootRoutes } from './app.routes';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';

import { ThreatActivityService } from '../assets/services/threat-activity.service';
import { UserService } from "../assets/services/user.service";
import { UserSettingService } from '../assets/services/userSettingService';
import { MessagingService } from '../assets/services/messaging.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../assets/auth/token.interceptor';
import { AuthGuard } from '../assets/auth/auth.guard';
import { ShareDataService } from '../assets/services/share-data.service';
import { ApplicationDataService } from '../assets/services/application-data-service';
import { CommonFunctions } from '../assets/common/common-functions';

import {
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule
} from '@angular/material';
import {
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatSortModule
} from '@angular/material';
import { NotificationService } from '../assets/services/notification.service';
import { LaneDeviceService } from '../assets/services/lanedevice.service';
import { CustomerService } from '../assets/services/customer.service';
import { LocationService } from '../assets/services/location.service';
import { UploadimageService } from '../assets/services/uploadimage.service';
import { EntranceService } from '../assets/services/entrance.service';
import { ThreatNotificationService } from '../assets/services/threatnotification.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { CommunicationService } from '../assets/services/communication-service';
import { ThreatLogService } from '../assets/services/threatlog.service';
import { TabletService } from '../assets/services/tablet.service';
import { DevicemanagementService } from '../assets/services/devicemanagement.service';
import { DeviceDetectSimulatorService } from '../assets/services/device-detect-simulator.service';
import { GenetecConfigurationService } from '../assets/services/genetec-configuration.service';
import { StatemonitoringService } from '../assets/services/statemonitoring.service';
// import { ThreatNotificationComponentModule } from './shared/threatnotification';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    //BrowserModule.withServerTransition({appId: 'my-app'}),
    HttpClientModule,
    RouterModule.forRoot(rootRoutes, {
      // enableTracing :true, // For debugging
      // preloadingStrategy: PreloadAllModules,
      // initialNavigation: 'enabled',
      // useHash: false
      useHash: true
    }),
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    TransferHttpCacheModule,
    NotifierModule,

    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule, //ThreatNotificationComponentModule,
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          //position: 'left',
          position: 'middle',
          distance: 12
        },
        vertical: {
          //position: 'bottom',
          position: 'top',
          distance: 12,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 300,
          easing: 'ease'
        },
        overlap: 150
      }
    }),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    ThreatActivityService, UserService, MessagingService, UserSettingService, NotificationService, LaneDeviceService,
    AuthGuard, CustomerService, LocationService, ShareDataService, ApplicationDataService, CommonFunctions,
    EntranceService, UserSettingService, LaneDeviceService, UploadimageService, ThreatNotificationService, CommunicationService,
    ThreatLogService, CommunicationService, TabletService, DevicemanagementService, DeviceDetectSimulatorService, GenetecConfigurationService, StatemonitoringService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ]
})
export class AppModule { }
