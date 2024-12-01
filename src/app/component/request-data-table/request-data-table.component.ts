import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Request } from '../../models/request';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { TestService } from '../../services/test/test.service';
import { Test } from '../../models/test';
import { takeUntil } from 'rxjs';
import { DestroyedSubject } from '../../services/destroyed.service';
@Component({
  selector: 'app-request-data-table',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  providers: [DestroyedSubject],
  templateUrl: './request-data-table.component.html',
  styleUrl: './request-data-table.component.scss',
})
export class RequestDataTableComponent implements ControlValueAccessor, OnInit {
  formArray: FormArray = new FormArray<any>([]);

  displayedColumns: string[] = ['testId', 'result', 'comment', 'action'];

  private onTouched: any = () => {};
  usedTests: Test[] = [];
  formGroup: FormGroup | undefined;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fb: FormBuilder,
    testService: TestService,
    private readonly destroyed$: DestroyedSubject
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.usedTests = testService.getUsedTests();
  }

  getControls(f: FormGroup) {
    const formArray = f.get('formArray') as FormArray;
    return [...formArray.controls];
  }

  ngOnInit(): void {
    if (this.formArray.length === 0) {
      this.addTest();
    }

    this.formGroup = this.fb.group({
      formArray: this.formArray,
    });
  }

  writeValue(value: Request[]): void {
    console.log(value, 'got');
    if (value) {
      this.setRequestedTests(value);
    }
  }

  registerOnChange(fn: any): void {
    this.formArray.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((x) => fn(x));
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setRequestedTests(tests: Request[]): void {
    this.formArray.clear();
    const testFormGroups = tests.map((test) =>
      this.fb.group({
        testId: [test.testId],
        result: [test.result],
        comment: [test.comment],
      })
    );
    testFormGroups.forEach((group) => this.formArray.push(group));
  }

  addTest(): void {
    const newTestGroup = this.fb.group({
      testId: [this.usedTests[0].testId],
      result: [''],
      comment: [''],
    });
    this.formArray.push(newTestGroup);
  }

  deleteTest(index: number): void {
    this.formArray.removeAt(index);
  }
}
