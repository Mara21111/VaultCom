import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-admin-all-users-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {

  users: User[] = [];
  reportCount: userReportCount[] = [];

  constructor(private userService: UserService, private router: Router, private reportService: ReportsService) {
  }

  public ngOnInit(){
    this.refresh();
  }

  public goToUser(id: number): void{
    this.router.navigate(['/admin-user-info/', id])
  }

  public refresh(): void{
    this.userService.getAll().subscribe(result => this.users = result);
    this.reportService.getAllUserReportsCount().subscribe(result => this.reportCount = result);
  }

  public getReportsCount(id: number): number{
    return this.reportCount.find(x => x.userId == id)?.count ?? 0;
  }
}

export class userReportCount {
  userId: number;
  count: number;
}