import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { UserInfoSidePanelComponent } from '../../Components/user-info-side-panel/user-info-side-panel.component';
import { ReportLog } from '../../models/ReportLog';
import { User, UserPanelInfo } from '../../models/User';
import { ReportsService} from '../../services/reports.service';
import { UserService } from '../../services/User.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, UserInfoSidePanelComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  @ViewChild(BaseUiComponent) baseComp!: BaseUiComponent;

  data: ReportLog[] = [];
  users: User[] = [];
  logedInUser: User;
  selectedUser: UserPanelInfo = new UserPanelInfo();
  panelVisible = false;
  searchValue: string = '';

  public constructor(private reportsService: ReportsService, private userService: UserService, private router: Router) {
    this.userService.getFromToken().subscribe(result => {
      this.logedInUser = result;
      this.reportsService.getReportsAdminView(this.logedInUser.id).subscribe(result => this.data = result);
    });
    this.userService.getAllUsersAdminView().subscribe(result => this.users = result);
  }

  public goToUser(userId: number): void{
    this.userService.getUser(userId).subscribe(result => {
      this.selectedUser.username = result.username;
      this.selectedUser.email = result.email ?? 'Not set';
      this.selectedUser.bio = result.bio ?? 'Not set';
      this.selectedUser.createdAt = result.createdAt.toString() || 'Not created';
      this.selectedUser.banEnd = result.banEnd ? new Date(result.banEnd).toDateString() : 'Not banned';
      this.reportsService.getReportCountOfUser(userId).subscribe(result => this.selectedUser.reportCount = result.toString())
      });
    this.panelVisible = true;
  }

  getUsername(userId: number): string {
    const username = this.users.find(u => u.id === userId)?.username;
    return username ? username : 'Unknown';
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
