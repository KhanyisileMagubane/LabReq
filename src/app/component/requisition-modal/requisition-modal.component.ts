import { Component, Inject, OnInit } from '@angular/core';
import { DestroyedSubject } from '../../services/destroyed.service';
import { Requisition } from '../../models/requisition';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValidatorHelper } from './validator-helper';
import { takeUntil } from 'rxjs';
import { RequisitionService } from '../../services/requisition/requisition.service';
import { DialogModule } from '@angular/cdk/dialog';
import { MaterialModule } from '../../material.module';
import { NotificationService } from '../../services/notification.service';
import { RequestDataTableComponent } from '../request-data-table/request-data-table.component';

export interface IRequisitionData {
  id: number;
  title: string;
  isNewData: boolean;
  requisition: Requisition;
  requisitionsData: Requisition[];
}

@Component({
  selector: 'app-requisition-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    MaterialModule,
    RequestDataTableComponent,
  ],
  providers: [DestroyedSubject],
  templateUrl: './requisition-modal.component.html',
  styleUrls: ['./requisition-modal.component.scss'],
})
export class RequisitionModalComponent implements OnInit {
  formGroup: FormGroup;
  title: string;

  constructor(
    private requisitionService: RequisitionService,
    private destroyed$: DestroyedSubject,
    @Inject(MAT_DIALOG_DATA) private dialogData: IRequisitionData,
    private dialogRef: MatDialogRef<RequisitionModalComponent>,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.formGroup = this.createForm(
      dialogData.requisition,
      dialogData.isNewData
    );
    this.title = dialogData.title;
  }

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        ValidatorHelper.calculateAndSetAge(
          this.formGroup,
          'dateOfBirth',
          'timeSampleTaken'
        );
      });
  }

  private createForm(requisition: Requisition, isNewData: boolean): FormGroup {
    return this.formBuilder.group({
      requisitionId: [
        { value: requisition.requisitionId ?? null, disabled: !isNewData },
        [
          Validators.required,
          Validators.pattern(/^\d{4}$/),
          ValidatorHelper.range(1, 9999),
        ],
      ],
      timeSampleTaken: [requisition.timeSampleTaken, Validators.required],
      firstName: [requisition.firstName, Validators.required],
      surname: [requisition.surname, Validators.required],
      gender: [
        requisition.gender,
        [
          Validators.required,
          ValidatorHelper.allowedCharacters(['M', 'F', 'U']),
        ],
      ],
      dateOfBirth: [
        requisition.dateOfBirth,
        [Validators.required, ValidatorHelper.dateBefore('timeSampleTaken')],
      ],
      age: [{ value: requisition.age, disabled: true }],
      mobileNumber: [
        requisition.mobileNumber,
        [Validators.required, ValidatorHelper.southAfricanMobile()],
      ],
      requestedTests: [requisition.requestedTests, Validators.required],
    });
  }

  save(): void {
    if (this.formGroup.invalid) {
      this.notificationService.showNotification(
        'Please fill all required fields',
        'Error'
      );
      return;
    }

    const payload = {
      ...this.formGroup.getRawValue(),
      timeSampleTaken: new Date(
        this.formGroup.value.timeSampleTaken
      ).toISOString(),
      dateOfBirth: new Date(this.formGroup.value.dateOfBirth).toISOString(),
    };

    const requisitionId = payload.id;
    const saveOperation$ = this.dialogData.isNewData
      ? this.requisitionService.createRequisition(payload)
      : this.requisitionService.updateRequisition(requisitionId, payload);

    saveOperation$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: () => {
        this.notificationService.showNotification(
          'Requisition saved successfully',
          'Success'
        );
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Error saving requisition:', err);
        this.notificationService.showNotification('Save failed', 'Error');
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
