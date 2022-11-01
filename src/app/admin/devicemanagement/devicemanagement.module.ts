import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {
  FormsValidationsResolver
} from '../../forms/forms.resolver';
import { DevicemanagementComponent } from './devicemanagement.component';
import { EditdeviceComponent } from './editdevice/editdevice.component';
import { AdddeviceComponent } from './adddevice/adddevice.component';


export const TabletRoutes = [
  {
    path: '',
    component: DevicemanagementComponent,
  },
  {
    path: 'editdevice',
    component: EditdeviceComponent,
  },
  {
    path: 'createdevice',
    component: AdddeviceComponent,
  }
];

@NgModule({
  declarations: [
    DevicemanagementComponent,
    EditdeviceComponent,
    AdddeviceComponent
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
    TableDataService,
    FormsValidationsResolver
  ]
})
export class DevicemanagementModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
