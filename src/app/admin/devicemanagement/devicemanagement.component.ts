import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from "../../../assets/constants/activity-constants";
import { ShareDataService } from '../../../assets/services/share-data.service';
import { AlertComponent } from '../../shared';
import { DevicemanagementService } from '../../../assets/services/devicemanagement.service';
import { IDevice } from '../../../assets/interfaces/idevice';

@Component({
  selector: 'app-devicemanagement',
  templateUrl: './devicemanagement.component.html',
  styleUrls: ['./devicemanagement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DevicemanagementComponent implements OnInit {

  device: IDevice[] = [];
  displayedColumns: string[] = ['select', 'name', 'macAddress', 'lightingaddress', 'soundAddress', 'status'];
  dataSource: MatTableDataSource<IDevice>;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IDevice>(true, []);

  filtersVisible = true;
  isBrowser: boolean;
  notificationService: any;

  constructor(public dialog: MatDialog,
    public deviceService: DevicemanagementService,
    private router: Router,
    private shareDataService: ShareDataService,
    private translate: TranslateService) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
  }

  ngOnInit() {
    this.getDevice();
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.device);
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

  applyFilter(filterValue: string) {
    this.selection.clear();
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === 0 ? false : numSelected === numRows;
  }
  selectAll() {
    this.selection.clear();
    this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selectAll();
  }

  getDevice() {
    this.deviceService.getDevices().subscribe(res => {
      if (res['status'] == 200) {
        this.device = res["data"];
        this.filterDeployments();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      })
  }

  editDevice() {
    if (this.selection.selected.length > 0) {
      this.shareDataService.setSharedData(this.selection.selected[0]);
      localStorage.setItem("alldevices", JSON.stringify(this.device));
      this.router.navigate(['./admin/devicemanagement/editdevice']);
    }
  }

  createDevice() {
    localStorage.setItem("alldevices", JSON.stringify(this.device));
    this.router.navigate(['./admin/devicemanagement/createdevice']);
  }

  deleteDevice() {
    let deleteConfirmMessage: string = "";
    let selectedUsers: string = "";
    if (this.selection.selected.length > 1) {
      this.selection.selected.forEach(element => {
        selectedUsers = selectedUsers + ', ' + element.name;
      });

      selectedUsers = selectedUsers.substring(1, selectedUsers.length);
      deleteConfirmMessage = "Delete Devices ?";
    }
    else if (this.selection.selected.length == 1) {
      selectedUsers = this.selection.selected[0].name;
      deleteConfirmMessage = "Delete Device " + selectedUsers + "?";
    }

    if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          // icon: 'exclamation-circle',
          // iconColor: 'success',
          title: deleteConfirmMessage,//'Are you sure you want to delete this user?',
          text: selectedUsers,//'Think it twice',
          options: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {

          let selectedDeviceIds: number[] = [];
          this.selection.selected.forEach(element => {
            selectedDeviceIds.push(element.id);
          });

          this.deviceService.deleteDevice(selectedDeviceIds.toString()).subscribe(res => {
            if (res['status'] == 200) {
              this.dialog.open(AlertComponent, {
                data: {
                  icon: 'check-circle',
                  iconColor: 'success',
                  title: 'Congrats!',
                  text: 'Successfully deleted.',
                  button: 'OK'
                }
              });

              this.selection.clear();
              this.ngOnInit();
            }
          },
            err => {
              console.log("Error occurred: " + err.message);

              if (err["status"] == 500) {
                this.notificationService.showNotification(err["error"]["error"], 'top', 'center', 'danger', 'info-circle');
              }
              else {
                this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
              }
            });
        }
        else {
          // this.selection.clear();
        }
      });
    }
  }


  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

}
