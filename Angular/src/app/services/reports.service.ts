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
    return this.http.get<Report_log[]>('http://localhost:5000/api/Reports/get-all-reports');
  }

  public getAllUserId(id: number): Observable<Report_log[]> {
    return this.http.get<Report_log[]>('http://localhost:5000/api/Reports/get-all-reports-user-id?Id=' + id);
  }

  public userReportCount(id: number): Observable<number> {
    console.log(id);
    return this.http.get<number>('http://localhost:5000/api/Reports/reportsCount-user' + id);
  }

  public getAllUserReportsCount(): Observable<userReportCount[]>{
    return this.http.get<userReportCount[]>('http://localhost:5000/api/Reports/reportsCount-AllUsers')
  }

  public createReport(report: Report_log): Observable<Report_log> {
    return this.http.post<Report_log>('http://localhost:5000/api/Reports/create-report', report)
  }
}

export class userReportCount {
  userId: number;
  count: number;
}
