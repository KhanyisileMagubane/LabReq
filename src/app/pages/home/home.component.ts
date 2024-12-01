import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Requisition } from '../../models/requisition';
import {
  IRequisitionData,
  RequisitionModalComponent,
} from '../../component/requisition-modal/requisition-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DestroyedSubject } from '../../services/destroyed.service';
import { takeUntil } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { Test } from '../../models/test';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReportService } from '../../services/report/report.service';
import { TestService } from '../../services/test/test.service';
import { RequisitionService } from '../../services/requisition/requisition.service';

@Component({
  selector: 'app-home',
  imports: [MaterialModule],
  providers: [DestroyedSubject],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name', 'surname', 'actions'];
  dataSource = new MatTableDataSource<Requisition>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  requisitions: Requisition[] = [];
  requisitionNew = new Requisition();

  tests: Test[] = [];

  constructor(
    private dialog: MatDialog,
    private readonly destroyed$: DestroyedSubject,
    private testService: TestService,
    private requisitionService: RequisitionService,
    private reportService: ReportService
  ) {
    this.getData();
  }

  ngOnInit(): void {
    this.tests = this.testService.usedTests;
  }

  getData() {
    this.requisitionService
      .getRequisitions()
      .subscribe((requisitions: Requisition[]) => {
        this.requisitions = requisitions;
        this.dataSource = new MatTableDataSource(this.requisitions);
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(requisitionData: Requisition, isNew = false) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 0,
      title: 'Requisition Data ' + requisitionData.requisitionId,
      isNewData: isNew,
      requisition: requisitionData,
      requisitionsData: this.requisitions,
    } as IRequisitionData;

    const dialogRef = this.dialog.open(RequisitionModalComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.getData();
        console.log(data);
      });
  }

  generateReport(requisition: Requisition, fileType: 'json' | 'text') {
    this.reportService.generateReports(
      requisition,
      this.testService.usedTests,
      fileType
    );
  }
}
