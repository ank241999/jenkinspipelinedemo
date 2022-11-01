import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NetworksetupComponent } from './networksetup.component';
import { LaneintegrationComponent } from './laneintegration/laneintegration.component';
import { HttpClient } from '@angular/common/http';
// import { DashboardResolver } from './devicesetup.resolver';

export const NetworksetupRoutes = [
  {
    path: '',
    component: NetworksetupComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      data : Ng2ChartsResolver
    }
  },

  // {
  //   path: 'laneintegration',
  //   component: LaneintegrationComponent
  // }
];

@NgModule({
  declarations: [
    NetworksetupComponent,
    // LaneintegrationComponent
  ],
  imports: [
    RouterModule.forChild(NetworksetupRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
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
    Ng2ChartsResolver,
    ChartsDataService,
    ExtendedTablesResolver,
    TableDataService
  ]
})
export class NetworksetupModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
