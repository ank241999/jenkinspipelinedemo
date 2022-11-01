import { Component, OnInit, ViewEncapsulation, ViewChild, Inject, PLATFORM_ID, ɵConsole } from '@angular/core';
import { AddgateComponent } from './addgate/addgate.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertComponent } from '../../shared';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { IEntrance } from '../../../assets/interfaces/ientrance';
import { EntranceService } from '../../../assets/services/entrance.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';


@Component({
  selector: 'app-hexwavetogate',
  templateUrl: './hexwavetogate.component.html',
  styleUrls: ['./hexwavetogate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]

})
export class HexwavetogateComponent implements OnInit {
  gates: IEntrance[] = [];
  displayedColumns: string[] = ['select', 'name', 'id'];
  dataSource: MatTableDataSource<IEntrance>;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IEntrance>(true, []);

  filtersVisible = true;
  isBrowser: boolean;

  constructor(private router: Router,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    public entranceservice: EntranceService,
    private translate: TranslateService

  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';

    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.entranceservice.getEntranceByLocationId(1).subscribe(res => {
      if (res["status"] == 200) {
        this.gates = res["data"];
        this.filterDeployments();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
  }

  onMapView() {
    this.router.navigateByUrl('/admin/hexwavetogate/viewmap');
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

  onAddClick() {
    this.openAddDialog();
  }

  deleteGate = function () {
    let deleteConfirmMessage: string = "";
    let selectedGates: string = "";
    if (this.selection.selected.length > 1) {
      this.selection.selected.forEach(element => {
        selectedGates = selectedGates + ', ' + element.name;
      });

      selectedGates = selectedGates.substring(1, selectedGates.length);
      deleteConfirmMessage = "Delete Gates?";
    }
    else if (this.selection.selected.length == 1) {
      selectedGates = this.selection.selected[0].name;
      deleteConfirmMessage = "Delete " + selectedGates.trimRight() + "?";
    }

    if (this.selection.selected.length > 0) {
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
          let selectedGateIds: number[] = [];
          this.selection.selected.forEach(element => {
            selectedGateIds.push(element.id);
          });
          // alert(JSON.stringify(selectedGateIds))
          this.entranceservice.deleteEntrance(selectedGateIds).subscribe(res => {
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
              this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
            });
        }
      });
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

  onAssignGate() {
    this.router.navigateByUrl('/admin/hexwavetogate/viewmap');
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

  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }
}
