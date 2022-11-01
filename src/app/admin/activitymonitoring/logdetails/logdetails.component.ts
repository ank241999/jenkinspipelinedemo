import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IActivityMonitoring } from '../../../../assets/interfaces/iactivity-monitoring';
import { IThreatLog } from '../../../../assets/interfaces/ithreatlog';
import { ThreatLogService } from '../../../../assets/services/threatlog.service';

@Component({
  selector: 'app-logdetails',
  templateUrl: './logdetails.component.html',
  styleUrls: ['./logdetails.component.scss']
})
export class LogdetailsComponent implements OnInit {
  threatdetail: IActivityMonitoring;
  logWeapon: string;
  logLocation: string;
  logThreat: string;
  note: string;
  actualWeapon: string;
  actualLocation: string;
  actualThreat: string;

  constructor(private dialogRef: MatDialogRef<MatDialog>, public threatLogService: ThreatLogService, private spinnerService: Ng4LoadingSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) data) {
    this.threatdetail = data;

    this.threatLogService.getThreatLog(this.threatdetail.logId).subscribe(res => {
      if (res['status'] == 200) {
        let threatLog: IThreatLog = res["data"];
        this.logWeapon = threatLog.typeOfWeapon;
        this.logLocation = threatLog.threatLocation;
        this.logThreat = threatLog.threatType;
        if (threatLog.note == "") {
          this.note = "No Note Available.";
        }
        else {
          this.note = threatLog.note;
        }
        this.spinnerService.hide();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      })

    //cellphone
    if (this.threatdetail.anomalies.cellphone.length > 0) {
      this.actualWeapon = "Cellphone";
      this.actualLocation = this.threatdetail.anomalies.cellphone[0];
      this.actualThreat = "Anomaly";
    }

    //keys
    if (this.threatdetail.anomalies.keys.length > 0) {
      this.actualWeapon = "Keys";
      this.actualLocation = this.threatdetail.anomalies.keys[0];
      this.actualThreat = "Anomaly";
    }

    //anomalies
    if (this.threatdetail.anomalies.genericAnomaly.length > 0) {
      this.actualWeapon = "Generic Anomaly";
      this.actualThreat = "Anomaly";
      this.actualLocation = this.threatdetail.anomalies.genericAnomaly[0];
    }

    //Handgun
    if (this.threatdetail.threats.handgun.length > 0) {
      this.actualWeapon = "Handgun";
      this.actualLocation = this.threatdetail.threats.handgun[0];
      this.actualThreat = "Threat";
    }

    //Rifle
    if (this.threatdetail.threats.rifle.length > 0) {
      this.actualWeapon = "Rifle";
      this.actualLocation = this.threatdetail.threats.rifle[0];
      this.actualThreat = "Threat";
    }

    //pipes
    if (this.threatdetail.threats.pipeBomb.length > 0) {
      this.actualWeapon = "Pipe bomb";
      this.actualLocation = this.threatdetail.threats.pipeBomb[0];
      this.actualThreat = "Threat";
    }

    //knife
    if (this.threatdetail.threats.knife.length > 0) {
      this.actualWeapon = "Knife";
      this.actualLocation = this.threatdetail.threats.knife[0];
      this.actualThreat = "Threat";
    }

    //Threat
    if (this.threatdetail.threats.genericThreat.length > 0) {
      this.actualWeapon = "Threat";
      this.actualLocation = this.threatdetail.threats.genericThreat[0];
      this.actualThreat = "Threat";
    }

  }

  ngOnInit(): void {
  }

  onScreenClose() {
    this.dialogRef.close();
  }

}
