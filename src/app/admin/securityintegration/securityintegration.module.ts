import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SecurityintegrationComponent } from './securityintegration.component';
import { Ng2ChartsResolver } from '../../charts';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export const SecurityintegrationRoutes = [
  {
    path: '',
    component: SecurityintegrationComponent,
    resolve: {
      data: Ng2ChartsResolver
    }
  }
];

@NgModule({
  declarations: [
    SecurityintegrationComponent
  ],
  imports: [
    RouterModule.forChild(SecurityintegrationRoutes),
    CommonModule,
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
    Ng2ChartsResolver
  ]
})
export class SecurityintegrationModule { }
export function HttpLoaderFactory(http : HttpClient){
  return new TranslateHttpLoader(http);
}

