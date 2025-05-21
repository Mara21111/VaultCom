import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportLog } from '../models/ReportLog';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  public constructor(private http: HttpClient) {

  }
  public getAllReports(): Observable<ReportLog[]> {
    return this.http.get<ReportLog[]>('http://localhost:5000/api/Reports/get-all-reports');
  }

  public getReportCountOfUser(userId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:5000/api/Reports/get-report-count-of-user-${userId}`)
  }

  public GetAllUserId(id: number): Observable<ReportLog[]> {
    return this.http.get<ReportLog[]>('http://localhost:5000/api/Reports/get-all-reports-user-id?Id=' + id);
  }

  public UserReportCount(id: number): Observable<number> {
    return this.http.get<number>('http://localhost:5000/api/Reports/reportsCount-user' + id);
  }

  public GetAllUserReportsCount(): Observable<userReportCount[]>{
    return this.http.get<userReportCount[]>('http://localhost:5000/api/Reports/reportsCount-AllUsers')
  }

  public CreateReport(report: ReportLog): Observable<ReportLog> {
    return this.http.post<ReportLog>('http://localhost:5000/api/Reports/create-report', report)
  }
}

export class userReportCount {
  userId: number;
  count: number;
}
