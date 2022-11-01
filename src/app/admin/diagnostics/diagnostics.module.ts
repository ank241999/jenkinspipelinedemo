import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';

import { DiagnosticsComponent } from './diagnostics.component';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RebootComponent } from './reboot/reboot.component';


export const DiagnosticsRoutes = [
  {
    path: '',
    component: DiagnosticsComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      data : Ng2ChartsResolver
    }
  }
];

@NgModule({
  declarations: [
    DiagnosticsComponent,
    RebootComponent
  ],
  imports: [
    RouterModule.forChild(DiagnosticsRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
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
    Ng2ChartsResolver,
    ChartsDataService,
    ExtendedTablesResolver,
    TableDataService
  ],
  entryComponents: [
    RebootComponent
  ]
})
export class DiagnosticsModule { }
export function HttpLoaderFactory(http : HttpClient){
  return new TranslateHttpLoader(http);
}
