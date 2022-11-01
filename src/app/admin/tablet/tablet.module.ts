import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabletComponent } from './tablet.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AddtabletComponent } from './addtablet/addtablet.component';
import { EdittabletComponent } from './edittablet/edittablet.component';
import {
    FormsValidationsResolver
  } from '../../forms/forms.resolver';


export const TabletRoutes = [
    {
        path: '',
        component: TabletComponent,
        resolve: {
            data: Ng2ChartsResolver
        }
    },
    {
        path: 'addtablet',
        component: AddtabletComponent,
        // resolve: {
        //   data : Ng2ChartsResolver
        // }
        resolve: {
          data: FormsValidationsResolver
        }
      },
      {
        path: 'edittablet',
        component: EdittabletComponent,
        // resolve: {
        //   data : Ng2ChartsResolver
        // }
      }
];

@NgModule({
    declarations: [
        TabletComponent,
        AddtabletComponent,
        EdittabletComponent
    ],
    imports: [
        RouterModule.forChild(TabletRoutes),
        CommonModule,
        ng2ChartsModule,
        SharedModule,
        MatTableModule,
        MatPaginatorModule,
        HttpClientModule,
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
          TableDataService,
          FormsValidationsResolver
        ]
    })
export class TabletModule {}
export function HttpLoaderFactory(http : HttpClient){
    return new TranslateHttpLoader(http);
}
