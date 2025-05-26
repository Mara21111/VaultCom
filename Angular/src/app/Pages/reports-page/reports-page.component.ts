import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { UserInfoSidePanelComponent } from '../../Components/user-info-side-panel/user-info-side-panel.component';
import { ReportLog } from '../../models/ReportLog';
import {User, UserGetterDTO, UserPanelInfo} from '../../models/User';
import { ReportsService} from '../../services/reports.service';
import { UserService } from '../../services/User.service';
import {catchError, forkJoin, of, switchMap} from 'rxjs';

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
  public isLoading: boolean = false;

  public constructor(
    private reportsService: ReportsService,
    private userService: UserService,
    private router: Router) {

  }

  ngOnInit() {
    this.isLoading = true;

    forkJoin({
      loggedInUser: this.userService.getFromToken(),
      users: this.userService.getAllUsersAdminView()
    }).subscribe({
      next: ({loggedInUser, users}) => {
        this.loggedInUser = loggedInUser;
        this.users = users;
        this.reportsService.getReportsAdminView(loggedInUser.id).subscribe(result => this.data = result);
      },
      complete: () => this.isLoading = false
    });
  }


  public goToUser(userId: number): void {
    const user = this.users.find(user => user.id === userId);

    this.selectedUser = {
      id: user?.id ?? 0,
      username: user?.username ?? 'Not found',
      email: user?.email ?? 'Private account',
      bio: user?.bio ?? 'Not set',
      createdAt: user?.createdAt ?? 'Not created',
      banEnd: user?.banEnd ?? 'Not banned',
      reportCount: user?.reportCount ?? 'Not reported',
      password: ''
    };

    this.panelVisible = true;
  }

  getUsername(userId: number): string {
    const username = this.users.find(u => u.id === userId)?.username;
    return username ? username : 'Unknown';
  }

  closePanel() {
    this.panelVisible = false;
  }

  public getReports(): ReportLog[] {
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
