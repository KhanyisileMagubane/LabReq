import { Injectable } from '@angular/core';
import { Requisition } from '../../models/requisition';
import { Test } from '../../models/test';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor() {}

  generateReports(
    requisition: Requisition,
    availableTests: Test[],
    fileType: 'json' | 'text'
  ): void {
    const reportName = `requisition-${requisition.requisitionId}-${requisition.firstName}-${requisition.surname}`;
    if (fileType === 'json') {
      const jsonReport = this.generateJSONReport(requisition, availableTests);
      const jsonBlob = new Blob([JSON.stringify(jsonReport, null, 2)], {
        type: 'application/json',
      });
      FileSaver.saveAs(jsonBlob, `${reportName}.json`);
    }

    if (fileType === 'text') {
      const textReport = this.generateTextReport(requisition, availableTests);
      const textBlob = new Blob([textReport], { type: 'text/plain' });
      FileSaver.saveAs(textBlob, `${reportName}.txt`);
    }
  }

  private generateJSONReport(
    requisition: Requisition,
    availableTests: Test[]
  ): any {
    const timeSampleTaken = new Date(requisition.timeSampleTaken);
    const dateOfBirth = new Date(requisition.dateOfBirth);

    if (isNaN(timeSampleTaken.getTime())) {
      throw new Error('Invalid date for timeSampleTaken');
    }
    return {
      requisitionId: requisition.requisitionId,
      timeSampleTaken: timeSampleTaken.toISOString(),
      firstName: requisition.firstName,
      surname: requisition.surname,
      gender: requisition.gender,
      dateOfBirth: dateOfBirth.toISOString(),
      age: requisition.age,
      mobileNumber: requisition.mobileNumber,
      requestedTests: requisition.requestedTests.map((test) => {
        const testDetails = availableTests.find(
          (t) => t.testId === test.testId
        );
        return {
          testId: test.testId,
          mnemonic: testDetails ? testDetails.mnemonic : 'Unknown',
          description: testDetails ? testDetails.description : 'Unknown',
          result: test.result,
          comment: test.comment,
        };
      }),
    };
  }

  private generateTextReport(
    requisition: Requisition,
    availableTests: Test[]
  ): string {
    const timeSampleTaken = new Date(requisition.timeSampleTaken);
    const dateOfBirth = new Date(requisition.dateOfBirth);

    if (isNaN(timeSampleTaken.getTime())) {
      throw new Error('Invalid date for timeSampleTaken');
    }

    let report = `Requisition Report\n\n`;
    report += `Requisition ID: ${requisition.requisitionId}\n`;
    report += `Time Sample Taken: ${timeSampleTaken.toISOString()}\n`;
    report += `Patient Name: ${requisition.firstName} ${requisition.surname}\n`;
    report += `Gender: ${requisition.gender}\n`;
    report += `Date of Birth: ${dateOfBirth.toISOString().split('T')[0]}\n`;
    report += `Age: ${requisition.age}\n`;
    report += `Mobile Number: ${requisition.mobileNumber}\n\n`;
    report += `Requested Tests:\n`;

    requisition.requestedTests.forEach((test, index) => {
      const testDetails = availableTests.find((t) => t.testId === test.testId);
      report += `  Test ${index + 1}:\n`;
      report += `    Test ID: ${test.testId}\n`;
      report += `    Mnemonic: ${
        testDetails ? testDetails.mnemonic : 'Unknown'
      }\n`;
      report += `    Description: ${
        testDetails ? testDetails.description : 'Unknown'
      }\n`;
      report += `    Result: ${test.result}\n`;
      report += `    Comment: ${test.comment}\n\n`;
    });

    return report;
  }
}
