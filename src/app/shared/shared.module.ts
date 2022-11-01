import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material modules
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { PreloadImageComponent } from './preload-image/preload-image.component';
import { AlertComponent } from './alert/alert.component';
import { NotificationComponent } from './notification/notification.component';
import { FileUploaderDirective } from './file-uploader/file-uploader.directive';
import { ThreatNotificationComponent } from './threatnotification/threatnotification.component';


@NgModule({
  declarations: [
    // Shared components
    PreloadImageComponent,
    AlertComponent,
    NotificationComponent,
    FileUploaderDirective,
    ThreatNotificationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    // Material modules
    MatAutocompleteModule,
    MatCheckboxModule,
    MatChipsModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule
  ],
  entryComponents: [
    AlertComponent,
    NotificationComponent,
    ThreatNotificationComponent
  ],
  providers: [

  ],
  exports: [
    // Shared components
    PreloadImageComponent,
    AlertComponent,
    NotificationComponent,
    ThreatNotificationComponent,
    FileUploaderDirective,
    // Re-export these modules to prevent repeated imports (see: https://angular.io/guide/ngmodule#re-exporting-other-modules)
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    // Material modules
    MatAutocompleteModule,
    MatCheckboxModule,
    MatChipsModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class SharedModule { }
