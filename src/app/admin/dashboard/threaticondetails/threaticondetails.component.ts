import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IActivityDashboard } from '../../../../assets/interfaces/iactivitydashboard';
import { IDashboardDetails } from '../../../../assets/interfaces/idashboarddetails';

@Component({
  selector: 'app-threaticondetails',
  templateUrl: './threaticondetails.component.html',
  styleUrls: ['./threaticondetails.component.scss']
})
export class ThreaticondetailsComponent implements OnInit {
  activityDashboard: IDashboardDetails = {};

  constructor(private router: Router,
    private dialogRef: MatDialogRef<IActivityDashboard>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.activityDashboard = data;
  }

  ngOnInit() {
  }

  viewActivity() {
    this.router.navigate(['./admin/activitymonitoring/activitythreats']);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
