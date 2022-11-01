import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';

import { ActivityMonitoringComponent } from './activitymonitoring.component';
import { DashboardResolver } from './activitymonitoring.resolver';

import { NouisliderModule } from 'ng2-nouislider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityThreatsComponent } from './activitythreats.component';
import { AddnoteComponent } from './addnote/addnote.component';
import { LogdetailsComponent } from './logdetails/logdetails.component';

export const UserRoutes = [
  {
    path: '',
    component: ActivityMonitoringComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      data : Ng2ChartsResolver
    }
  },
  {
    path: 'activitythreats',
    component: ActivityThreatsComponent,
    resolve: {
      data : Ng2ChartsResolver
    }
  },
  {
      path: 'addnote',
      component: AddnoteComponent,
      resolve: {
        data : Ng2ChartsResolver
      }
  }
];

@NgModule({
  declarations: [
    ActivityMonitoringComponent,
    ActivityThreatsComponent,
    AddnoteComponent,
    LogdetailsComponent
  ],
  imports: [
    RouterModule.forChild(UserRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
    NouisliderModule,MatPaginatorModule,MatSortModule,
    HttpClientModule,TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:[HttpClient]
      }
    }),
    FormsModule, ReactiveFormsModule
  ],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    DashboardResolver,
    Ng2ChartsResolver,
    ChartsDataService,
    ExtendedTablesResolver,
    TableDataService
  ],
  entryComponents: [
    LogdetailsComponent
  ]
})
export class ActivityMonitoringModule { }
export function HttpLoaderFactory(http : HttpClient){
  return new TranslateHttpLoader(http);
}