import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerURLComponent } from './server-url.component';

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
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { Observable, of } from 'rxjs';
// import { NotifierService } from 'angular-notifier';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { NotifierModule } from 'angular-notifier';
import { FormBuilder } from '@angular/forms';
import { IResponse } from '../../../../assets/interfaces/iresponse';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injector } from "@angular/core";
import { NotificationService } from '../../../../assets/services/notification.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AlreadyloginalertComponent } from '../../alreadyloginalert/alreadyloginalert.component';
import { RegisterComponent } from '../../register/register.component';
import { By } from '@angular/platform-browser';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

let translations: any = { "CARDS_TITLE": "This is a test" };
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('ServerURLComponent', () => {
  let component: ServerURLComponent;
  let fixture: ComponentFixture<ServerURLComponent>;
  let translate: TranslateService;
  let injector: Injector;
  let shareDataServicespy: jasmine.SpyObj<ShareDataService>;

  // it('true is true', () => expect(true).toBe(true));

  const MockElementRef: any = {
    get offsetLeft() {
      return 0;
    }
  };


  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'setApplicationVariables']);

    TestBed.configureTestingModule({
      declarations: [ServerURLComponent, AlreadyloginalertComponent, RegisterComponent],
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
        MatDialogModule,
        FormsModule, ReactiveFormsModule, HttpClientModule,
        RouterModule.forRoot([{
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
          path: 'admin/activitymonitoring',
          component: RegisterComponent,
          data: {
            title: 'Active monitoring'
          },
          pathMatch: 'full'
        }]),
        Ng4LoadingSpinnerModule.forRoot(),
        BrowserAnimationsModule,
        // NotifierModule.withConfig({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        ServerURLComponent,
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: ElementRef, useValue: MockElementRef },
        { provide: ShareDataService, useValue: shareDataServicespy },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerURLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
