import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { BaseUiComponent } from '../../Components/base-ui/base-ui.component';
import { SidePanelComponent } from '../../Components/side-panel/side-panel.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-admin-all-users-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, SidePanelComponent, FormsModule],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {
  @ViewChild(BaseUiComponent) baseComp!: BaseUiComponent;

  Users: User[] = [];
  SelectedUser: User = new User;
  ReportCounts: userReportCount[] = [];
  PanelVisible: boolean = false;

  isTimeoutOrBanSelected: boolean = false;
  selectedDateTime: string = '';
  searchValue: string = '';

  constructor(private userService: UserService, private router: Router, private reportService: ReportsService) {

  }

  public ngOnInit(): void {
    this.refresh();
    this.searchValue = this.baseComp?.searchValue;
  }

  public goToUser(user_id: number): void{
    this.userService.GetUser(user_id).subscribe(result => {
      this.SelectedUser = result;
      this.PanelVisible = true;
    })
  }

  public refresh(): void{
    this.userService.GetAllUsersAdminView().subscribe(result => this.Users = result);
    this.reportService.GetAllUserReportsCount().subscribe(result => this.ReportCounts = result);
  }

  public getReportsCount(id: number): number{
    return this.ReportCounts.find(x => x.userId == id)?.count ?? 0;
  }

  closePanel() {
    this.PanelVisible = false;
  }

  onSearchChanged(value: string) {
    this.searchValue = value;
  }

  public getUsers(): User[]{
      const chats = this.Users;

      if (!this.searchValue?.trim()) {
        return chats;
      }

      const query = this.searchValue.toLowerCase();
      return chats.filter(user =>
        user.username.toLowerCase().includes(query)
      );
    }
}

export class userReportCount {
  userId: number;
  count: number;
}
