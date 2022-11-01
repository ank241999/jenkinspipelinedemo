import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
// import { NotifierModule } from 'angular-notifier';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AlreadyloginalertComponent } from './alreadyloginalert/alreadyloginalert.component';
import { AlreadyloginComponent } from './alreadylogin/alreadylogin.component';
import { RegisteragainComponent } from './registeragain/registeragain.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  MatSortModule, MatRowDef
} from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let translate: TranslateService;
  const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent,
      data: {
        title: 'Login'
      },
      pathMatch: 'full'
    },
    {
      path: 'alreadylogin',
      component: AlreadyloginComponent,
      data: {
        title: 'Login'
      },
      pathMatch: 'full'
    },
    {
      path: 'alreadyloginalert',
      component: AlreadyloginalertComponent,
      data: {
        title: 'Login'
      },
      pathMatch: 'full'
    },
    {
      path: 'register',
      component: RegisterComponent,
      data: {
        title: 'User Registration'
      },
      pathMatch: 'full'
    },
    {
      path: 'registeragain',
      component: RegisteragainComponent,
      data: {
        title: 'Login'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent, LoginComponent, RegisterComponent, AlreadyloginalertComponent, AlreadyloginComponent, RegisteragainComponent],
      imports: [
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
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        //RouterModule.forChild(routes),
        RouterModule.forRoot(routes, { useHash: true }),
        // UserRoutingModule,NotifierModule,
        FormsModule, ReactiveFormsModule
      ],
      //providers:[{provide: MessagingService,useClass: mockMessagingService}],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
