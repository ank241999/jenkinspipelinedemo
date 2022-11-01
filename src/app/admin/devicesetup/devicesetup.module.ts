import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';

import { DeviceSetupPageComponent } from './devicesetup.component';
import { DashboardResolver } from './devicesetup.resolver';

export const DeviceSetupRoutes = [
  {
    path: '',
    component: DeviceSetupPageComponent,
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
    DeviceSetupPageComponent
  ],
  imports: [
    RouterModule.forChild(DeviceSetupRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule
  ],
  exports: [RouterModule],
  providers: [
    DashboardResolver,
    Ng2ChartsResolver,
    ChartsDataService,
    ExtendedTablesResolver,
    TableDataService
  ]
})
export class DeviceSetupModule { }
