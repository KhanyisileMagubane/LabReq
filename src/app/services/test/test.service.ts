import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Test } from '../../models/test';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private testDataUrl = 'assets/tests.json';
  usedTests: Test[] = [];
  constructor(private http: HttpClient) {}

  getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.testDataUrl);
  }

  setCurrentTest(tests: Test[]) {
    this.usedTests = tests;
  }

  getUsedTests() {
    return this.usedTests;
  }
}
