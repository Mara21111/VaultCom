import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { SidePanelComponent } from '../../Components/side-panel/side-panel.component';
import { ReportLog } from '../../models/ReportLog';
import { User } from '../../models/User';
import { ReportsService } from '../../services/reports.service';
import { UserService } from '../../services/user.service';
import { report } from 'process';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, SidePanelComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  @ViewChild(BaseUiComponent) baseComp!: BaseUiComponent;

  data: ReportLog[] = [];
  users: User[] = [];
  selectedUser: User = new User;
  reportsCount: number = 0;
  panelVisible = false;
  searchValue: string = '';

  public constructor(private reportsService: ReportsService, private userService: UserService, private router: Router) {
    this.reportsService.GetAllReports().subscribe(result => this.data = result)
    this.reportsService.UserReportCount(this.selectedUser.id).subscribe(result => this.reportsCount = result)
    this.userService.GetAllUsers().subscribe(result => this.users = result)
  }

  public goToUser(user_id: number): void{
    this.userService.GetUser(user_id).subscribe(result => this.selectedUser = result)
    this.panelVisible = true;
    console.log(this.panelVisible)
  }

  getUsername(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  closePanel() {
    this.panelVisible = false;
  }

  public getReports(): ReportLog[]{
      const reports = this.data;

      if (!this.searchValue?.trim()) {
        return reports;
      }

      const query = this.searchValue.toLowerCase();
      return reports.filter(report =>
        this.getUsername(report.userId).toLowerCase().includes(query)
      );
    }

    onSearchChanged(value: string) {
      this.searchValue = value;
    }
}
