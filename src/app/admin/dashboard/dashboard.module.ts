import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';
import { MatSliderModule } from '@angular/material/slider';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
// import { DashboardResolver } from './threatmanagement.resolver';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng5SliderModule } from 'ng5-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { DevicedetailsComponent } from './devicedetails/devicedetails.component';
import { ThreatdetailsComponent} from './threatdetails/threatdetails.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ThreaticondetailsComponent } from './threaticondetails/threaticondetails.component';
import { GuarddetailsComponent } from './guarddetails/guarddetails.component';
import { GuardlogsComponent } from './threatdetails/guardlogs/guardlogs.component';



export const DeviceSetupRoutes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      data: Ng2ChartsResolver
    }
  },//,
  // {
  //   path: 'devicesetup',
  //   component: DeviceSetupPageComponent,
  //   resolve: {
  //     data : Ng2ChartsResolver
  //   }
  // }
  

  {
    path: 'devicedetails',
    component: DevicedetailsComponent
  },

  {
    path: 'threatdetails',
    component: ThreatdetailsComponent
  },

  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'guarddetails',
    component: GuarddetailsComponent
  },
  {
    path: 'threaticondetails',
    component: ThreaticondetailsComponent
  },
  {
    path: 'guardlogs',
    component: GuardlogsComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    DevicedetailsComponent,
    ThreatdetailsComponent,
    NotificationsComponent,
    ThreaticondetailsComponent,
    GuarddetailsComponent,
    GuardlogsComponent
  ],
  imports: [
    RouterModule.forChild(DeviceSetupRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
    MatSliderModule,
    Ng5SliderModule,
    MatPaginatorModule, 
    MatSortModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  exports: [RouterModule],
  providers: [
    // DashboardResolver,
    Ng2ChartsResolver,
    ChartsDataService,
    ExtendedTablesResolver,
    TableDataService
  ]
})
export class DashboardModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}