import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LaneintegrationComponent } from './laneintegration.component';
import { Ng2ChartsResolver } from '../../../charts';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export const LaneintegrationRoutes = [
  {
    path: '',
    component: LaneintegrationComponent,
    resolve: {
      data: Ng2ChartsResolver
    }
  }
];

@NgModule({
  declarations: [
    LaneintegrationComponent
  ],
  imports: [
    RouterModule.forChild(LaneintegrationRoutes),
    CommonModule,
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
    Ng2ChartsResolver
  ]
})
export class LaneintegrationModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}