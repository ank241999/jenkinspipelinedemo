import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';


import { VenuesetupComponent } from './venuesetup.component';
import { InstallationtypeComponent } from './installationtype/installationtype.component';
// import { DashboardResolver } from './devicesetup.resolver';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { GenetecsettingsComponent } from './genetecsettings/genetecsettings.component';

export const VenuesetupRoutes = [
  {
    path: '',
    component: VenuesetupComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      data: Ng2ChartsResolver
    }
  },

  {
    path: 'installationtype',
    component: InstallationtypeComponent
  }
];

@NgModule({
  declarations: [
    VenuesetupComponent,
    InstallationtypeComponent,
    GenetecsettingsComponent
  ],
  imports: [
    RouterModule.forChild(VenuesetupRoutes),
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
  ],
  entryComponents: [
    GenetecsettingsComponent
  ]
})
export class VenuesetupModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
