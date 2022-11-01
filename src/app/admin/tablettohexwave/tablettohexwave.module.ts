import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';

import { TablettohexwaveComponent } from './tablettohexwave.component';
import { EntrancedetailsComponent } from './entrancedetails/entrancedetails.component';
import { DevicescanComponent } from './devicescan/devicescan.component';
import { HexwavepairdetailsComponent } from './hexwavepairdetails/hexwavepairdetails.component';
import { AddlaneComponent } from './devicescan/addlane/addlane.component';
import { LdevicescanComponent } from './devicescan/ldevicescan/ldevicescan.component';
import { RdevicescanComponent } from './devicescan/rdevicescan/rdevicescan.component';
import { PortalconfigleftComponent } from './devicescan/ldevicescan/portalconfigleft/portalconfigleft.component';
import { PortalconfigrightComponent } from './devicescan/rdevicescan/portalconfigright/portalconfigright.component';
import { LeftrightdevicesComponent } from './devicescan/leftrightdevices/leftrightdevices.component';
import { SpathleftdeviceComponent } from './devicescan/spathleftdevice/spathleftdevice.component';
import { SpathrightdeviceComponent } from './devicescan/spathrightdevice/spathrightdevice.component';
import { SpathconfigleftComponent } from './devicescan/spathleftdevice/spathconfigleft/spathconfigleft.component';
import { SpathconfigrightComponent } from './devicescan/spathrightdevice/spathconfigright/spathconfigright.component';
import { SpathleftrightdeviceComponent } from './devicescan/spathleftrightdevice/spathleftrightdevice.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { EditlaneComponent } from './devicescan/editlane/editlane.component';
// import { DashboardResolver } from './tablettohexwave.resolver';

export const TablettohexwaveRoutes = [
  {
    path: '',
    component: TablettohexwaveComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      data: Ng2ChartsResolver
    }
  },

  {
    path: 'entrancedetails',
    component: EntrancedetailsComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
    // resolve: {
    //   data: 
  },
  {
    path: 'devicescan',
    component: DevicescanComponent,

    // resolve: {
    //   data : Ng2ChartsResolver
    // }
    // resolve: {
    //   data: 
  },

  {
    path: 'ldevicescan',
    component: LdevicescanComponent,
    // outlet: 'nameldevice'
  },

  {
    path: 'portalconfigleft',
    component: PortalconfigleftComponent,
  },

  {
    path: 'rdevicescan',
    component: RdevicescanComponent,
    // outlet: 'namerdevice'
  },

  {
    path: 'portalconfigright',
    component: PortalconfigrightComponent,
  },

  {
    path: 'spathleftdevice',
    component: SpathleftdeviceComponent
  },

  {
    path: 'spathrightdevice',
    component: SpathrightdeviceComponent
  },

  {
    path: 'spathconfigleft',
    component: SpathconfigleftComponent
  },

  {
    path: 'spathconfigright',
    component: SpathconfigrightComponent
  },


  {
    path: 'addlane',
    component: AddlaneComponent,
  },

  {
    path: 'editlane',
    component: EditlaneComponent,
  },

  {
    path: 'hexwavepairdetails',
    component: HexwavepairdetailsComponent,
  },

  {
    path: 'leftrightdevices',
    component: LeftrightdevicesComponent
  },
  {
    path: 'spathleftrightdevice',
    component: SpathleftrightdeviceComponent
  }
];

@NgModule({
  declarations: [
    TablettohexwaveComponent,
    EntrancedetailsComponent,
    DevicescanComponent,
    HexwavepairdetailsComponent,
    AddlaneComponent,
    LdevicescanComponent,
    RdevicescanComponent,
    PortalconfigleftComponent,
    PortalconfigrightComponent,
    LeftrightdevicesComponent,
    SpathleftdeviceComponent,
    SpathrightdeviceComponent,
    SpathconfigleftComponent,
    SpathconfigrightComponent,
    SpathleftrightdeviceComponent,
    EditlaneComponent
  ],
  imports: [
    RouterModule.forChild(TablettohexwaveRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
    HttpClientModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [RouterModule],
  providers: [
    Ng2ChartsResolver,
    ChartsDataService,
    ExtendedTablesResolver,
    TableDataService
  ]
})
export class TablettohexwaveModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
