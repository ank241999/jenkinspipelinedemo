import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { ModifyaccountComponent } from './modifyaccount/modifyaccount.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertComponent } from '../../shared';
import { NotificationService } from '../../../assets/services/notification.service';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
var $ = require('jquery');

@Component({
  selector: 'app-accountmanagement-page',
  templateUrl: './accountmanagement.component.html',
  styleUrls: ['./styles/accountmanagement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class AccountManagementComponent {
  users: IUser[] = [];

  displayedColumns: string[] = ['select', 'firstName', 'email', 'roleName', 'tabletID', 'gateName', 'expirydate'];//, 'expiryTimestamp', 'lastName', 'edit', 'delete'];
  dataSource: MatTableDataSource<IUser>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IUser>(true, []);

  filtersVisible = true;
  isBrowser: boolean;
  rowId: number = 0;
  // creationTimestam: string;
  loggedInUserId: string;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private router: Router,
    private shareDataService: ShareDataService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    translate.setDefaultLang(ActivityConstants.browserLanguage);
    document.body.style.background = '#EBEBEB';
    this.isBrowser = isPlatformBrowser(platformId);
    this.loggedInUserId = shareDataService.email;
  }

  ngOnInit() {
    this.spinnerService.show();
    this.userService.getUsers("").subscribe(res => {
      if (res["status"] == 200) {
        this.users = res["data"];
        this.users.forEach(usr => {
          usr.roleName = usr.role.replace("[", "").replace("]", "");
          usr.expirydate = this.datePipe.transform(usr.expiryTimestamp, 'MM/dd/yyyy');

          if (usr.roleName == "ADVANCE") {
            usr.expirydate = "N/A";
          }
        });
        this.filterDeployments();
        this.spinnerService.hide();
      }
    },
      err => {
        console.log("Error occurred: " + err.message);
        this.spinnerService.hide();
      });
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'expiryDate': return new Date(item.expiryTimestamp);
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
      this.router.navigate(['./admin/accountmanagement/modifyaccount']);
    }
  }

  deleteAccount = function () {
    let deleteConfirmMessage: string = "";
    let selectedUsers: string = "";
    if (this.selection.selected.length > 1) {
      this.selection.selected.forEach(element => {
        selectedUsers = selectedUsers + ', ' + element.firstName + ' ' + element.lastName;
      });

      selectedUsers = selectedUsers.substring(1, selectedUsers.length);
      deleteConfirmMessage = "Delete Accounts ?";
    }
    else if (this.selection.selected.length == 1) {
      selectedUsers = this.selection.selected[0].firstName + ' ' + this.selection.selected[0].lastName;
      deleteConfirmMessage = "Delete Account " + selectedUsers + "?";
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
          let selectedUserIds: number[] = [];
          this.selection.selected.forEach(element => {
            selectedUserIds.push(element.id);
          });
          // alert(JSON.stringify(selectedUserIds))
          this.userService.deleteUser(selectedUserIds).subscribe(res => {
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

  // userRowClick(row, even) {
  //   if (this.rowId > 0 && this.rowId != row.id) {
  //     this.selection.clear();
  //     this.selection.select(row);
  //   }
  //   else {
  //     event.stopPropagation();
  //   }
  //   this.rowId = row.id;
  // }

  isAllSelected() {
    this.deleteAccounts();
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

  deleteAccounts() {
    if (this.selection.selected.length > 1) {
      $("#btnDelete").text("DELETE ACCOUNTS");
    }
    else {
      $("#btnDelete").text("DELETE ACCOUNT");

    }
  }
}