import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { ChartsDataService } from '../../charts/services/charts-data.service';
import { Ng2ChartsResolver } from '../../charts/resolvers/charts.resolver';

import { SharedModule } from '../../shared';

import { TableDataService } from './services/table-data.service';
import { MatTableModule } from '@angular/material/table';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ReportsComponent } from './reports.component';
import { DashboardResolver } from './reports.resolver';

import { NouisliderModule } from 'ng2-nouislider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { RegularTablesResolver, SmartTablesResolver } from './resolvers/tables.resolver';
import { ThreatActivityReportComponent } from './threatactivityreport/threatactivityreport.component';
import { ThroughputComponent } from './throughput/throughput.component';
import { PositionwiseComponent } from './positionwise/positionwise.component';
import { DatewiseComponent } from './datewise/datewise.component';
import { ReportService } from '../../../assets/services/report.service';
import { ReportdashboardComponent } from './reportdashboard/reportdashboard.component';
// import 'chart.js';

import { NvD3Module } from 'ng2-nvd3';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import 'chart.js';
import 'd3';
import 'nvd3';

import { MatTabsModule } from '@angular/material/tabs';
import { CamelCase } from '../../../assets/pipes/camel-case';
import { UtcToLocal } from '../../../assets/pipes/utc-to-local';
import { HttpClient } from '@angular/common/http';
import { ThreatlogsreportComponent } from './threatlogsreport/threatlogsreport.component';
import { AnalyticsdatareportComponent } from './analyticsdatareport/analyticsdatareport.component';
import { PersonspecificthreatreportComponent } from './personspecificthreatreport/personspecificthreatreport.component';
import { PersonscanneddetailsComponent } from './personscanneddetails/personscanneddetails.component';


export const UserRoutes = [
  {
    path: '',
    component: ReportsComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      //data : Ng2ChartsResolver,
      tableData: SmartTablesResolver
    }
  },
  {
    path: 'threatactivityreport',
    component: ThreatActivityReportComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
  },
  {
    path: 'betatestmodereport',
    component: ThreatlogsreportComponent,
  },
  {
    path: 'analyticdatareport',
    component: AnalyticsdatareportComponent,
    resolve: {
      data: Ng2ChartsResolver
    }
  },
  {
    path: 'throughput',
    component: ThroughputComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
  },
  {
    path: 'positionwise',
    component: PositionwiseComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
  },
  {
    path: 'datewise',
    component: DatewiseComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
  },
  {
    path: 'reportdashboard',
    component: ReportdashboardComponent,
    resolve: {
      data: Ng2ChartsResolver
    }
  },
  {
    path: 'Personspecificthreatreport',
    component: PersonspecificthreatreportComponent,
  },
  {
    path: 'personscanneddetails',
    component: PersonscanneddetailsComponent,
  }
];

@NgModule({
  declarations: [
    ReportsComponent,
    ThreatActivityReportComponent,
    ThroughputComponent,
    PositionwiseComponent,
    DatewiseComponent,
    ReportdashboardComponent,
    CamelCase,
    UtcToLocal,
    ThreatlogsreportComponent,
    AnalyticsdatareportComponent,
    PersonspecificthreatreportComponent,
    PersonscanneddetailsComponent
  ],
  imports: [
    RouterModule.forChild(UserRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NouisliderModule, MatPaginatorModule, MatSortModule, NvD3Module, MatTabsModule, NgbModule
  ],
  // exports: [RouterModule],
  providers: [
    DashboardResolver,
    Ng2ChartsResolver,
    ChartsDataService,
    TableDataService,
    RegularTablesResolver,
    // ExtendedTablesResolver,
    SmartTablesResolver,
    ReportService
  ]
})
export class ReportsModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
