import { Request } from './request';

export class Requisition {
  requisitionId: string = '0000';
  timeSampleTaken: Date = new Date();
  firstName: string = '';
  surname: string = '';
  gender: 'M' | 'F' | 'U' = 'U';
  dateOfBirth: Date = new Date('1990-01-01');
  age: number = 33;
  mobileNumber: string = '+27123456789';
  requestedTests: Request[] = [];
}
