import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';
import {MatSliderModule} from '@angular/material/slider';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ThreatmanagementComponent } from './threatmanagement.component';
// import { DashboardResolver } from './threatmanagement.resolver';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { Ng5SliderModule } from 'ng5-slider';

export const DeviceSetupRoutes = [
  {
    path: '',
    component: ThreatmanagementComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      data : Ng2ChartsResolver
    }
  }//,
  // {
  //   path: 'devicesetup',
  //   component: DeviceSetupPageComponent,
  //   resolve: {
  //     data : Ng2ChartsResolver
  //   }
  // }
];

@NgModule({
  declarations: [
    ThreatmanagementComponent
  ],
  imports: [
    RouterModule.forChild(DeviceSetupRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
    MatSliderModule,
    Ng5SliderModule,
    HttpClientModule,TranslateModule.forRoot({
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
export class ThreatManagementModule { }
export function HttpLoaderFactory(http : HttpClient){
    return new TranslateHttpLoader(http);
  }