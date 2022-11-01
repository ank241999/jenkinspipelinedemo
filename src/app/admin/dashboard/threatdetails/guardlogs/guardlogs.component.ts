import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { IUser } from '../../../../../assets/interfaces/iuser';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-guardlogs',
  templateUrl: './guardlogs.component.html',
  styleUrls: ['./guardlogs.component.scss']
})
export class GuardlogsComponent implements OnInit {

  constructor(private router: Router,
    private dialogRef: MatDialogRef<MatDialog>) { }
    
    filteredUsers: IUser[] = [];

    dataSourceUserLogs: MatTableDataSource<IUser>;
    @ViewChild(MatPaginator, { static: false }) paginatorLogs: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortUserLogs: MatSort;
    displayedColumnsLogs = [
      'firstName',
      'firstName',
      'creationDate',
      'LoggedInTime',
      'LoggedOutTime',
      'roleName',
      'email'
    ];

  ngOnInit() {
  }

  filterDeployments(filter: string) {
    setTimeout(() => {
      this.dataSourceUserLogs = new MatTableDataSource<IUser>(this.filteredUsers);
      this.dataSourceUserLogs.paginator = this.paginatorLogs;
      this.dataSourceUserLogs.sort = this.sortUserLogs;
    }, 0);
  }

  close(){
    this.dialogRef.close();
  }

}
