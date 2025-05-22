import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { UserInfoSidePanelComponent } from '../../Components/user-info-side-panel/user-info-side-panel.component';
import { ReportLog } from '../../models/ReportLog';
import {User, UserGetterDTO, UserPanelInfo} from '../../models/User';
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
  users: UserGetterDTO[] = [];
  loggedInUser: User;
  selectedUser: UserPanelInfo = new UserPanelInfo();
  panelVisible = false;
  searchValue: string = '';

  public constructor(private reportsService: ReportsService, private userService: UserService, private router: Router) {
    this.userService.getFromToken().subscribe(result => {
      this.loggedInUser = result;
      this.reportsService.getReportsAdminView(this.loggedInUser.id).subscribe(result => this.data = result);
    });
    this.userService.getAllUsersAdminView().subscribe(result => this.users = result);
  }

  public goToUser(userId: number): void{
    this.userService.getUser(userId).subscribe(result => {
      this.selectedUser.username = result.username;
      this.selectedUser.email = result.email ?? 'Private profile';
      this.selectedUser.bio = result.bio ?? 'Not set';
      this.selectedUser.createdAt = result.createdAt ?? 'Not created';
      this.selectedUser.banEnd = result.banEnd ?? 'Not banned';
      this.selectedUser.reportCount = result.reportCount ?? 'Not reported';
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
