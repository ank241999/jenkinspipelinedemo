import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-deletegate',
  templateUrl: './deletegate.component.html',
  styleUrls: ['./deletegate.component.scss']
})
export class DeletegateComponent implements OnInit {
  // inputData: '';

  constructor
  (private dialogRef: MatDialogRef<DeletegateComponent>,
    private translate: TranslateService
    // @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      translate.setDefaultLang(ActivityConstants.browserLanguage);
      document.body.style.background = '#EBEBEB';
    }


  ngOnInit() {
  }

  onScreenClose() {
    this.dialogRef.close();
  }
}
