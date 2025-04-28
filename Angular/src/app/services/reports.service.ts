import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report_log } from '../models/Report_log';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  public constructor(private http: HttpClient) {}

  public getAll(): Observable<Report_log[]> {
    return this.http.get<Report_log[]>('http://localhost:5000/api/Reports');
  }
}
