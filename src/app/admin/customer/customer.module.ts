import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';

// import { ActivityMonitoringComponent } from './activitymonitoring.component';
// import { DashboardResolver } from './activitymonitoring.resolver';
import { CustomerComponent } from './customer.component';

import { NouisliderModule } from 'ng2-nouislider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddcustomerComponent } from './addcustomer/addcustomer.component';
// import { ModifycustomerComponent } from './modifycustomer/modifycustomer.component';
import { ResolversComponent } from './resolvers/resolvers.component';
import { ModifycustomerComponent } from './modifycustomer/modifycustomer.component';

export const CustomerRoutes = [
  {
    path: '',
    component: CustomerComponent,
  //   resolve: {
  //     // data: DashboardResolver,
  //     // chart: Ng2ChartsResolver,
  //     // table: ExtendedTablesResolver
  //     data : Ng2ChartsResolver
  //   }
  },
  {
    path: 'modifycustomer',
    component: ModifycustomerComponent,
  },
  {
    path: 'addcustomer',
    component: AddcustomerComponent,
  }
];

@NgModule({
  declarations: [
    CustomerComponent,
    AddcustomerComponent,
    ModifycustomerComponent,
    ResolversComponent
  ],
  imports: [
    RouterModule.forChild(CustomerRoutes),
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
    // DashboardResolver,
    Ng2ChartsResolver,
    ChartsDataService,
    ExtendedTablesResolver,
    TableDataService
  ]
})
export class CustomerModule { }
export function HttpLoaderFactory(http : HttpClient){
  return new TranslateHttpLoader(http);
}