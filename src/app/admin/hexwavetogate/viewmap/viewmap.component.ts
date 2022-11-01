import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { EntranceService } from '../../../../assets/services/entrance.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddgateComponent } from '../addgate/addgate.component';
import { NotificationService } from '../../../../assets/services/notification.service';
import { AlertComponent } from '../../../shared';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';

var $ = require('jquery');

@Component({
  selector: 'app-viewmap',
  templateUrl: './viewmap.component.html',
  styleUrls: ['./viewmap.component.scss']
})
export class ViewmapComponent implements OnInit {
  gates: IEntrance[] = [];
  personaldetails = [];
  dragPosition = { x: 0, y: 0 };
  footPrintImagePath: string = "../../../../assets/images/footprint.JPG";
  button: any;
  isConfirm: boolean = false;
  doneAndEdit: boolean = false;

  constructor(private location: Location,
    private router: Router,
    public entranceService: EntranceService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private shareDataService: ShareDataService,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
    if (shareDataService.footPrintImagePath) {
      this.footPrintImagePath = shareDataService.footPrintImagePath;
    }

    this.entranceService.getEntranceByLocationId(1).subscribe(res => {

      if (res["status"] == 200) {
        this.gates = res["data"];
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  ngOnInit() {
    setTimeout(() => {
      this.gates.forEach(e => {
        if (e.ycoordinate != 0) {
          document.getElementById("dvdrop_" + e.ycoordinate).appendChild(document.getElementById("img_" + e.id));
        }
      });
    }, 1000);
  }

  onListView() {
    this.router.navigate(['/admin/hexwavetogate']);
  }

  changePosition() {
    // this.dragPosition = {x: this.dragPosition.x + 50, y: this.dragPosition.y + 50};
    this.dragPosition = { x: 0, y: 0 };
  }

  // initialPosition = { x: 100, y: 100 };
  initialPosition = { x: 0, y: 0 };
  position = { ...this.initialPosition };
  offset = { x: 0, y: 0 };

  dragEnd(event: CdkDragEnd, id) {
    this.offset = { ...(<any>event.source._dragRef)._passiveTransform };

    this.position.x = this.initialPosition.x + this.offset.x;
    this.position.y = this.initialPosition.y + this.offset.y;

    let gate: IEntrance[] = this.gates.filter(a => a.id == id);
    if (gate != undefined && gate.length > 0) {
      gate[0].xcoordinate = this.position.x;
      gate[0].ycoordinate = this.position.y;
    }
  }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(AddgateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

  submit() {
    let locationsObj = [];
    this.gates.forEach(element => {
      let locationObj = {
        id: element.id,
        name: element.name,
        locationId: 1,
        xcoordinate: element.xcoordinate,
        ycoordinate: element.ycoordinate
      }

      locationsObj.push(locationObj);
    });

    this.entranceService.updateEntrance(locationsObj).subscribe(res => {
      if (res["status"] == 201) {
        this.notificationService.showNotification("Gates successfully assigned on the venue.", 'top', 'center', '', 'info-circle');
        this.doneAndEdit = true;
        this.isConfirm = false;
      }
    },
      err => {
        this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        console.log("Error occurred: " + err.message);
      });
  }

  onAddClick() {
    this.openAddDialog();
  }

  onDone() {
    this.router.navigateByUrl('/admin/tablettohexwave');
  }

  editMap() {
    this.doneAndEdit = false;
    this.isConfirm = true;
  }

  deleteGate = function (id, name) {
    let deleteConfirmMessage: string = "";
    deleteConfirmMessage = "Delete " + name + "?";

    if (id != undefined) {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          icon: 'exclamation-circle',
          iconColor: 'success',
          title: deleteConfirmMessage,
          options: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let selectedGateIds: number[] = [id];
          this.entranceService.deleteEntrance(selectedGateIds).subscribe(res => {
            if (res['status'] == 200) {
              this.dialog.open(AlertComponent, {
                data: {
                  name: this.name,
                  title: 'Congrats!',
                  text: 'Successfully deleted.',
                  button: 'OK'
                }
              });

              // this.reLoad("/admin/hexwavetogate/viewmap");
              $("#" + id).hide();
            }
          },
            err => {
              console.log("Error occurred: " + err.message);
              this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
            });
        }
      });
    }
  }

  // reLoad(val) {
  //   if (val == this.router.url) {
  //     this.spinnerService.show();
  //     this.router.routeReuseStrategy.shouldReuseRoute = function () {
  //       return false;
  //     };
  //   }
  // }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

    let destinationCellId: number = ev.target.id.split("_")[1];
    let gateId: number = parseInt(data.split("_")[1]);
    let gate: IEntrance[] = this.gates.filter(a => a.id == gateId);
    if (gate != undefined && gate.length > 0) {
      gate[0].xcoordinate = gateId;
      gate[0].ycoordinate = destinationCellId;
      this.isConfirm = true;
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  reverseGate(id) {
    // let resetId: any = this.gates.filter(a => a.id == id)[0].ycoordinate;
    document.getElementById(id).appendChild(document.getElementById("img_" + id));
  }
}
