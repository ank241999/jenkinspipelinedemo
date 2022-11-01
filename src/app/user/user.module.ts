import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { LoginComponent } from './login/login.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CoreModule } from '../core/core.module';

import {
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule
} from '@angular/material';
import {
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatSortModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { AlreadyloginComponent } from './alreadylogin/alreadylogin.component';
import { AlreadyloginalertComponent } from './alreadyloginalert/alreadyloginalert.component';
import { RegisteragainComponent } from './registeragain/registeragain.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServerURLComponent } from './login/server-url/server-url.component';
import { TermsComponent } from './terms/terms.component';
import { IntermediateComponent } from './login/intermediate.component';


@NgModule({
  imports: [
    CommonModule, UserRoutingModule,
    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    // FlexLayoutModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CoreModule
  ],
  declarations: [UserComponent, LoginComponent, RegisterComponent, BlockCopyPasteDirective, 
    AlreadyloginComponent, AlreadyloginalertComponent, RegisteragainComponent, ServerURLComponent,
    TermsComponent, IntermediateComponent],
  providers: [DatePipe]
})
export class UserModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
