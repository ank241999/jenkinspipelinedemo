import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';


import { HexwavetogateComponent } from './hexwavetogate.component';
import { AddgateComponent } from './addgate/addgate.component';
import { DeletegateComponent } from './deletegate/deletegate.component';
import { ViewmapComponent } from './viewmap/viewmap.component';
// import { DashboardResolver } from './devicesetup.resolver';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export const HexwavetogateRoutes = [
  {
    path: '',
    component: HexwavetogateComponent,
    resolve: {
      // data: DashboardResolver,
      // chart: Ng2ChartsResolver,
      // table: ExtendedTablesResolver
      data : Ng2ChartsResolver
    }
  },

  {
    path: 'viewmap',
    component: ViewmapComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
    // resolve: {
    //   data: 
    },

  {
    path: 'addgate',
    component: AddgateComponent,
    // resolve: {
    //   data : Ng2ChartsResolver
    // }
    // resolve: {
    //   data: 
    },
    {
      path: 'deletegate',
      component: DeletegateComponent,
      // resolve: {
      //   data : Ng2ChartsResolver
      // }
      // resolve: {
      //   data: 
      }
];

@NgModule({
  declarations: [
    HexwavetogateComponent,
    AddgateComponent,
    DeletegateComponent,
    ViewmapComponent
  ],
  imports: [
    RouterModule.forChild(HexwavetogateRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    DragDropModule,
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
  ]
})
export class HexwavetogateModule { }
export function HttpLoaderFactory(http : HttpClient){
  return new TranslateHttpLoader(http);
}
