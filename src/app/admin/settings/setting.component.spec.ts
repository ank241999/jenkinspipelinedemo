import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsDataService, Ng2ChartsResolver } from '../../charts';
import { Component, EventEmitter, Output, ViewEncapsulation, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { MessagesMenuService, NotificationsMenuService, SideMenuService } from '../../core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { isPlatformBrowser, CommonModule } from '@angular/common';

import { UserSettingService } from '../../../assets/services/userSettingService';
import { IUserSetting } from '../../../assets/interfaces/iuser-setting';
import { NotificationService } from '../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { environment } from '../../../environments/environment';


import { settingsPageComponent } from './settings.component';

import { HttpLoaderFactory } from './settings.module';
import { ExtendedTablesResolver } from '../../tables';
import { TableDataService } from '../accountmanagement/services/table-data.service';
import { SharedModule } from '../../shared/shared.module';
import { MatTableModule } from '@angular/material';
import { ShareDataService } from '../../../assets/services/share-data.service';



const translation: any = { 'CARDS_TITLE': 'This is a test' };

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(translation);
    }
}

describe('settingsPageComponent', () => {
    let component: settingsPageComponent;
    let fixture: ComponentFixture<settingsPageComponent>;
    let translate: TranslateService;
    let injector: Injector;


      const settingsRoutes = [
  {
    path: 'settingsPageComponent',
    component: settingsPageComponent,
    resolve: {
      data : Ng2ChartsResolver
    }
  }
]  ;
    beforeEach(async(() => {
        const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
        const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
        shareDataServicespy.getSharedData.and.returnValue(true);

        TestBed.configureTestingModule({
          declarations: [
            settingsPageComponent
          ],
          imports: [
            RouterModule.forChild(settingsRoutes),
            CommonModule,
            SharedModule,
            MatTableModule,
            BrowserAnimationsModule,
            HttpClientModule, TranslateModule.forRoot({
              loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
              }
            })
          ],

          providers: [
            Ng2ChartsResolver,
            ChartsDataService,
            ExtendedTablesResolver,
            TableDataService,
            SideMenuService,
            MessagesMenuService,
            UserSettingService,
            NotificationsMenuService,
            NotificationService,
            ShareDataService,
            ActivityConstants

          ]
        })
            .compileComponents();
        injector = getTestBed();
        translate = injector.get(TranslateService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(settingsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('component should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`should call the getUserSettings method`, () => {
        component.getUserSettings();
        expect(component.getUserSettings).toBeTruthy();
    });

    it(`should call the setUserSettingVaules method`, () => {
        component.setUserSettingVaules();
        expect(component.setUserSettingVaules).toBeTruthy();
    });

    it(`should call the onSubmit() method`, () => {
        component.onSubmit();
        expect(component.onSubmit).toBeTruthy();
    });

    it(`should call the colorSelect method`, () => {
        component.colorSelect('nn', 'green');
        expect(component.colorSelect).toBeTruthy();
    });
    it(`should call the setCTAValues method`, () => {
        component.setCTAValues();
        expect(component.setCTAValues).toBeTruthy();
    });
    it(`should call the showColorPopup method`, () => {
        component.showColorPopup(1);
        expect(component.showColorPopup).toBeTruthy();
    });


});
