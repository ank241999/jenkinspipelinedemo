import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EntranceService } from '../../../../assets/services/entrance.service';
import { AddlaneComponent } from '../devicescan/addlane/addlane.component';
import { LaneDeviceService } from '../../../../assets/services/lanedevice.service';
import { IDevice } from '../../../../assets/interfaces/idevice';
import { AlertComponent } from '../../../shared';
import { IDevicePair, DevicePair } from '../../../../assets/interfaces/idevicepair';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ILocation } from '../../../../assets/interfaces/ilocation';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { ITablet } from '../../../../assets/interfaces/itablet';
import { IDeviceTablet, DeviceTablet } from '../../../../assets/interfaces/idevicetablet';
import { NotificationService } from '../../../../assets/services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-hexwavepairdetails',
  templateUrl: './hexwavepairdetails.component.html',
  styleUrls: ['./hexwavepairdetails.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HexwavepairdetailsComponent implements OnInit {
  entrance: IEntrance = { "id": 0, "name": "Test" };
  locations: ILocation[] = [];
  gates: IEntrance[] = [];
  devices: IDevice[] = [];
  iDevicePairs: IDevicePair[] = [];
  tablets: ITablet[] = [];
  deviceTablets: IDeviceTablet[] = [];
  selection = new SelectionModel<IDevicePair>(true, []);

  // displayedColumns: string[] = ['pairs', 'laneName', 'status', 'viewActiveMonitoring', 'leftDeviceName', 'leftDeviceStatus', 'rightDeviceName', 'rightDeviceStatus', 'tabletId', 'customColumn'];
  displayedColumns: string[] = ['select', 'pairs', 'laneName', 'status', 'leftDeviceName', 'leftDeviceStatus', 'rightDeviceName', 'rightDeviceStatus', 'tabletId', 'customColumn'];
  dataSource: MatTableDataSource<IDevicePair>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;

  deviceInfo: [
    { leftDev: "987654321", rightDev: "123456789" },
    { leftDev: "987654321", rightDev: "123456789" },
    { leftDev: "987654321", rightDev: "123456789" },
    { leftDev: "987654321", rightDev: "123456789" }
  ];

  constructor(private location: Location,
    private router: Router,
    private shareDataService: ShareDataService,
    private entranceService: EntranceService,
    public dialog: MatDialog,
    private laneDeviceService: LaneDeviceService,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService,
    private notificationService: NotificationService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
    this.entrance = shareDataService.getGlobalObject();
  }

  ngOnInit() {
    this.spinnerService.show();
    let entrance: IEntrance = this.shareDataService.getGlobalObject();
    this.laneDeviceService.getTabletInfo().subscribe(result => { 
      if (result["status"] == 200) {
        this.tablets = result["data"];

        this.laneDeviceService.getAllEntranceDevices(entrance.id).subscribe(res => {
          if (res["status"] == 200) {
            this.iDevicePairs = [];
            this.devices = res["data"];
            this.devices.forEach(ele => {

              if (ele.id == null) {
                let devicePair: IDevicePair;
                devicePair = new DevicePair(null, "", "", null, false, null, "", "", null, false, ele.laneName, ele.laneId, 0);
                if (this.tablets.filter(t => t.devices.filter(d => d.id == devicePair.leftDeviceId).length > 0 &&
                  t.devices.filter(d => d.id == devicePair.rightDeviceId).length > 0).length > 0) {
                  devicePair.tabletId = this.tablets.filter(t => t.devices.filter(d => d.id == devicePair.leftDeviceId).length > 0 &&
                    t.devices.filter(d => d.id == devicePair.rightDeviceId).length > 0)[0].id;
                }
                this.iDevicePairs.push(devicePair);
              }


              else {
                let leftDevices: IDevice[] = this.devices.filter(a => a.laneId == ele.laneId && a.side == "left");
                let rightDevices: IDevice[] = this.devices.filter(a => a.laneId == ele.laneId && a.side == "right");
                let devicePair: IDevicePair;

                if (leftDevices.length > 0) {
                  devicePair = new DevicePair(leftDevices[0].id, leftDevices[0].name, leftDevices[0].macAddress, leftDevices[0].status, leftDevices[0].spathFlag, null, "", "", true, false, leftDevices[0].laneName, leftDevices[0].laneId, parseInt(leftDevices[0].tabletId));
                }
                else {
                  devicePair = new DevicePair(null, "", "", true, false, null, "", "", true, false, "", null, 0);
                }
                if (rightDevices.length > 0) {
                  devicePair.laneName = rightDevices[0].laneName;
                  devicePair.laneId = rightDevices[0].laneId;
                  devicePair.rightDeviceId = rightDevices[0].id;
                  devicePair.rightDeviceName = rightDevices[0].name;
                  devicePair.rightDeviceMacAddress = rightDevices[0].macAddress;
                  devicePair.rightDeviceStatus = rightDevices[0].status;
                  devicePair.isrightDeviceSPath = rightDevices[0].spathFlag;
                }

                devicePair.tabletId = 0;
                if (this.tablets.filter(t => t.devices.filter(d => d.id == devicePair.leftDeviceId).length > 0 &&
                  t.devices.filter(d => d.id == devicePair.rightDeviceId).length > 0).length > 0) {
                  devicePair.tabletId = this.tablets.filter(t => t.devices.filter(d => d.id == devicePair.leftDeviceId).length > 0 &&
                    t.devices.filter(d => d.id == devicePair.rightDeviceId).length > 0)[0].id;
                }

                // this.tablets.forEach(tab => {
                //   console.log("L: " + tab.devices.filter(d => d.id == devicePair.leftDeviceId).length);
                //   console.log("R: " + tab.devices.filter(d => d.id == devicePair.rightDeviceId).length);

                //   if (tab.devices.filter(d => d.id == devicePair.leftDeviceId).length > 0 &&
                //     tab.devices.filter(d => d.id == devicePair.rightDeviceId).length > 0) {
                //     devicePair.tabletId = tab.id; console.log(tab.id)
                //   }
                // });

                if (this.iDevicePairs.filter(a => a.laneId == devicePair.laneId).length == 0)
                  this.iDevicePairs.push(devicePair);

              }
            });

            this.filterDeployments();
            this.spinnerService.hide();

            if (this.shareDataService.openPopup) {
              this.shareDataService.openPopup = false;
              this.addLane();
            }
          }
        },
          err => {
            console.log("Error occurred: " + err.message);
            this.spinnerService.hide();
          });
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  getTablets() {
    this.laneDeviceService.getTabletInfo().subscribe(res => {
      if (res["status"] == 200) {
        this.tablets = res["data"];
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.iDevicePairs);
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

  delete(deviceInfo) {
    deviceInfo.hideRow = true;
    this.delete(deviceInfo.leftDev);
  }

  addLane() {
    const dialogConfig = new MatDialogConfig();
    // if (this.selection.selected.length > 0) {
    // dialogConfig.data = this.devices;

    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(AddlaneComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result != "") {
        this.shareDataService.setSharedData(result);
        this.router.navigateByUrl('/admin/tablettohexwave/devicescan');
      }
      // this.ngOnInit();
    });
    // }
  }


  deleteGate = function (laneId, laneName) {
    let entrance: IEntrance = this.shareDataService.getGlobalObject();
    let deleteConfirmMessage: string = "";
    deleteConfirmMessage = "Delete " + laneName + "?";

    if (laneId != undefined) {
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
          let lanetodelete = this.iDevicePairs.filter(a => a.laneId == laneId)[0];
          
          if (lanetodelete.leftDeviceId == null && lanetodelete.rightDeviceId == null) {
            // let selectedGateIds: number[] = [id];
            this.laneDeviceService.deleteLaneInfo(laneId).subscribe(res => {
              if (res['status'] == 200) {
                this.dialog.open(AlertComponent, {
                  data: {
                    name: this.name,
                    title: 'Congrats!',
                    text: 'Successfully deleted.',
                    button: 'OK'
                  }
                });
                this.ngOnInit();
              }
            },
              err => {
                console.log("Error occurred: " + err.message);
                this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
              });
          }
          else {
            this.notificationService.showNotification("Device is paired with this lane", 'top', 'center', 'danger', 'info-circle');
          }
        }
      });
    }
  }

  editLane = function () {
    if (this.selection.selected.length > 0) {
      localStorage.setItem('editLane', JSON.stringify(this.selection.selected[0]));
      this.router.navigate(['/admin/tablettohexwave/editlane'])
    }
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

  onTabletChange(row, val) {
    let tablet: ITablet = this.tablets.filter(t => t.id == val)[0];

    let ideviceTablet: IDeviceTablet = new DeviceTablet([row.leftDeviceId, row.rightDeviceId], val, tablet.tabletMacAddress, tablet.tabletName, tablet.tabletStatus);

    if (this.deviceTablets.filter(d => d.deviceIds.indexOf(ideviceTablet.deviceIds[0]) > -1 &&
      d.deviceIds.indexOf(ideviceTablet.deviceIds[1]) > -1).length > 0) {
      let index: number = this.deviceTablets.indexOf(this.deviceTablets.filter(d => d.deviceIds.indexOf(ideviceTablet.deviceIds[0]) > -1 &&
        d.deviceIds.indexOf(ideviceTablet.deviceIds[1]) > -1)[0]);
      this.deviceTablets.splice(index);

      this.deviceTablets.push(ideviceTablet);
    }
    else {
      this.deviceTablets.push(ideviceTablet);
    }
  }

  save() {
    this.deviceTablets.forEach(device => {
      this.laneDeviceService.updateTabletDevice(device).subscribe(res => {
        if (res["status"] == 200) {
          this.notificationService.showNotification("Tablet: " + device.tabletName + " successfully assigned to the devices.", 'top', 'center', '', 'info-circle');
        }
      }),
        err => {
          console.log("Error occurred: " + err.message);

          if (err["status"] == 500) {
            this.notificationService.showNotification(err["error"], 'top', 'center', 'warning', 'info-circle');
          }
          else {
            this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
          }
        }
    });

    setTimeout(() => {
      // this.router.navigate(['/admin/diagnostics']);
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }, 3000);
  }
}
