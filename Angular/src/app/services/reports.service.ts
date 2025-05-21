import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateReportDTO, ReportLog, UserReportDTO } from '../models/ReportLog';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  public constructor(private http: HttpClient) {

  }

  public sendReport(report: CreateReportDTO): Observable<CreateReportDTO> {
    return this.http.post<CreateReportDTO>('http://localhost:5000/api/Reports/send-report', report);
  }

  public timeoutUser(userReportDTO: UserReportDTO): Observable<UserReportDTO> {
    return this.http.put<UserReportDTO>('http://localhost:5000/api/Reports/timeout-user', userReportDTO);
  }

  public banUser(userReportDTO: UserReportDTO): Observable<UserReportDTO> {
    return this.http.put<UserReportDTO>('http://localhost:5000/api/Reports/ban-user', userReportDTO);
  }

  public deleteReport(userReportDTO: UserReportDTO): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/Reports/ban-user');
  }

  public getReportsAdminView(userId: number): Observable<ReportLog[]> {
    return this.http.get<ReportLog[]>(`http://localhost:5000/api/Reports/get-reports-admin-view-${userId}`);
  }

  public getReportCountOfUser(userId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:5000/api/Reports/get-report-count-of-user-${userId}`);
  }
}

export class userReportCount {
  userId: number;
  count: number;
}
