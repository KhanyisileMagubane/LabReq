import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Requisition } from '../../models/requisition';

@Injectable({
  providedIn: 'root',
})
export class RequisitionService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getRequisitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/requisitions`);
  }

  createRequisition(requisition: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/requisitions`, requisition);
  }

  updateRequisition(id: string, requisition: Requisition): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/requisitions/${id}`, requisition);
  }

  deleteRequisition(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/requisitions/${id}`);
  }
}
