import { Component, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { EntranceService } from '../../../assets/services/entrance.service';
import { NotificationService } from '../../../assets/services/notification.service';
import { IEntrance } from '../../../assets/interfaces/ientrance';
import { SelectionModel } from '@angular/cdk/collections';
import { isPlatformBrowser } from '@angular/common';
import { json } from 'd3';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';

@Component({
  selector: 'app-tablettohexwave',
  templateUrl: './tablettohexwave.component.html',
  styleUrls: ['./tablettohexwave.component.scss']
})
export class TablettohexwaveComponent implements OnInit {
  gates: IEntrance[] = [];

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<IEntrance>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;

  selection = new SelectionModel<IEntrance>(true, []);
  isBrowser: boolean;

  progress = '0';
  form: FormGroup;
  formcontrol: FormControl;
  validationMessages = {
    field: [
      { type: 'required', message: 'This field is required.' }
    ]
  }

  constructor(
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    // public dialog: MatDialog,
    public entranceservice: EntranceService,
    // private translate: TranslateService,
    private notificationService: NotificationService,
    private router: Router,
    private shareDataService: ShareDataService,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    this.translateValidationMessages();

    this.isBrowser = isPlatformBrowser(platformId);
  };

  ngOnInit() {
    this.spinnerService.show();
    this.entranceservice.getEntranceByLocationId(1).subscribe(res => {
      if (res["status"] == 200) {
        this.gates = res["data"];
        this.filterDeployments();
        this.spinnerService.hide();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
      });
  }

  translateValidationMessages() {
    this.translate.get('requiredfield').subscribe((text: string) => {
      this.validationMessages.field[0].message = text;
    });
  }
  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.gates);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        // case 'expiryDate': return new Date(item.expiryTimestamp);
        default: return item[property];
      }
    };
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
  }

  validateFields(): void {
    if (!this.form.valid) {
      // Mark the form and inputs as touched so the errors messages are shown
      this.form.markAsTouched();
      for (const control in this.form.controls) {
        if (this.form.controls.hasOwnProperty(control)) {
          this.form.controls[control].markAsTouched();
          this.form.controls[control].markAsDirty();
        }
      }
    }
  }

  showEntranceDetails(row) {
    this.shareDataService.setGlobalObject(row);
    this.router.navigate(['./admin/tablettohexwave/hexwavepairdetails']);
  }

  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }
}
