import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ITablet } from '../../../assets/interfaces/itablet';
import { TabletService } from '../../../assets/services/tablet.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from "../../../assets/constants/activity-constants";
import { ShareDataService } from '../../../assets/services/share-data.service';
import { AlertComponent } from '../../shared';

@Component({
  selector: 'app-tablet',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabletComponent implements OnInit {

  tablet: ITablet[] = [];
  displayedColumns: string[] = ['select', 'name', 'id', 'macAddress'];
  dataSource: MatTableDataSource<ITablet>;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<ITablet>(true, []);

  filtersVisible = true;
  isBrowser: boolean;

  constructor(public dialog: MatDialog,
    public tabletService: TabletService,
    private router: Router,
    private shareDataService: ShareDataService,
    private translate: TranslateService) {
      translate.setDefaultLang(ActivityConstants.browserLanguage);
     }

  ngOnInit() {
    this.getTablet();
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.tablet);
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

  getTablet() {
    this.tabletService.getTablets().subscribe(res => {
      if (res['status'] == 200) {
        this.tablet = res["data"];
        this.filterDeployments();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      })
  }

  deleteTablets = function () {
    let deleteConfirmMessage: string = "";
    let selectedTablets: string = "";
    if (this.selection.selected.length > 1) {
      this.selection.selected.forEach(element => {
        selectedTablets = selectedTablets + ', ' + element.tabletName;
      });

      selectedTablets = selectedTablets.substring(1, selectedTablets.length);
      deleteConfirmMessage = "Delete Tablets ?";
    }
    else if (this.selection.selected.length == 1) {
      selectedTablets = this.selection.selected[0].tabletName;
      deleteConfirmMessage = "Delete Tablets " + selectedTablets + "?";
    }

    if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          // icon: 'exclamation-circle',
          // iconColor: 'success',
          title: deleteConfirmMessage,//'Are you sure you want to delete this tablet?',
          text: selectedTablets,//'Think it twice',
          options: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let selectedTabletIds: number[] = [];
          this.selection.selected.forEach(element => {
            selectedTabletIds.push(element.id);
          });
          // alert(JSON.stringify(selectedTabletIds))
          this.tabletService.deleteTablet(selectedTabletIds).subscribe(res => {
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

  editTablet() {
    if (this.selection.selected.length > 0) {
      this.shareDataService.setSharedData(this.selection.selected[0]);
      this.router.navigate(['./admin/tablet/edittablet']);
    }
  }


  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

}
