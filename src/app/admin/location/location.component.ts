// import { Component, OnInit } from '@angular/core';
import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerService } from '../../../assets/services/customer.service';
import { LocationService } from '../../../assets/services/location.service';
import { ModifylocationComponent } from './modifylocation/modifylocation.component'
// import { ModifyaccountComponent } from './admin/accountmanagement/modifyaccount/modifyaccount.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertComponent } from '../../shared';
import { NotificationService } from '../../../assets/services/notification.service';
import { ILocation } from '../../../assets/interfaces/ilocation';
import { ICustomer } from '../../../assets/interfaces/icustomer';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../assets/services/share-data.service';

@Component({
  selector: 'app-location',
  templateUrl: `./location.component.html`,
  styleUrls: ['./styles/location.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class LocationComponent implements OnInit {
  loc: ILocation[] = [];

  displayedColumns: string[] = ['select', 'customer.name', 'name'];
  dataSource: MatTableDataSource<ILocation>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<ILocation>(true, []);

  filtersVisible = true;
  isBrowser: boolean;
  rowId: number = 0;
  constructor(public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private locationService: LocationService,
    private customerService: CustomerService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private shareDataService: ShareDataService,
    private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit() {
    let id: number;

    this.locationService.getLocation().subscribe(res => {
      if (res["status"] == 200) {
        this.loc = res["data"];
        this.filterDeployments();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.loc);
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

  openDialog() {
    if (this.selection.selected.length > 0) {
      this.shareDataService.setSharedData(this.selection.selected[0]);
      this.router.navigate(['./admin/location/modifylocation']);
    }
  }

  deleteLocation = function () {
    let deleteConfirmMessage: string = "";
    let selectedLocations: string = "";
    if (this.selection.selected.length > 1) {
      this.selection.selected.forEach(element => {
        selectedLocations = selectedLocations + ', ' + element.name;
      });

      selectedLocations = selectedLocations.substring(1, selectedLocations.length);
      deleteConfirmMessage = "Delete Locations";
    }
    else if (this.selection.selected.length == 1) {
      selectedLocations = this.selection.selected[0].name;
      deleteConfirmMessage = "Delete Location " + selectedLocations + "?";
    }

    if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          icon: 'exclamation-circle',
          iconColor: 'success',
          title: deleteConfirmMessage,//'Are you sure you want to delete this Location?',
          text: selectedLocations,//'Think it twice',
          options: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let selectedLocationIds: number[] = [];
          this.selection.selected.forEach(element => {
            selectedLocationIds.push(element.id);
          });
          // alert(JSON.stringify(selectedLocationIds))
          this.locationService.deleteLocation(selectedLocationIds).subscribe(res => {
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

  applyFilter(filterValue: string) {
    this.selection.clear();
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  userRowClick(row, even) {
    if (this.rowId > 0 && this.rowId != row.id) {
      this.selection.clear();
      this.selection.select(row);
    }
    else {
      event.stopPropagation();
    }
    this.rowId = row.id;
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
}