import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-devicedetails',
  templateUrl: './devicedetails.component.html',
  styleUrls: ['./devicedetails.component.scss']
})
export class DevicedetailsComponent implements OnInit {
  deviceName: string = "";

  constructor(private dialogRef: MatDialogRef<MatDialog>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.deviceName = data;
  }

  ngOnInit() {

  }

  onScreenClose() {
    this.dialogRef.close();
  }
}
