import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { MatDialog, MatDialogRef, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { EntranceService } from '../../../../assets/services/entrance.service';

@Component({
  selector: 'app-entrancedetails',
  templateUrl: './entrancedetails.component.html',
  styleUrls: ['./entrancedetails.component.scss']
})
export class EntrancedetailsComponent implements OnInit {
  entrance: IEntrance = { "id": 0, "name": "Test" };

  gates: IEntrance[] = [];

  displayedColumns: string[] = ['name','xCoordinate','yCoordinate','id'];
  dataSource: MatTableDataSource<IEntrance>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;

  constructor(private location: Location,
    private router: Router,
    private shareDataService: ShareDataService,
    private entranceService: EntranceService) {
    this.entrance = shareDataService.getSharedData();
    // this.shareDataService.setSharedData(null);
  }

  ngOnInit() {
    this.entranceService.getEntranceByLocationId(1).subscribe(res => {
      this.gates = res;
      this.filterDeployments();
    },
      err => {
        console.log("Error occurred: " + err.message);
      });
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

  onSwitchGates() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  onScreenClose() {
    this.router.navigate(['/admin/dashboard'])
  }

}
