import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
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

  users: User[] = [];
  selectedUser: User = new User;
  reportCounts: userReportCount[] = [];
  panelVisible: boolean = false;

  isTimeoutOrBanSelected: boolean = false;
  selectedDateTime: string = '';
  searchValue: string = '';

  constructor(private userService: UserService, private router: Router, private reportService: ReportsService) {
  }

  public ngOnInit() {
    this.refresh();
    this.searchValue = this.baseComp?.searchValue;
  }

  public goToUser(user_id: number): void{
    this.userService.getUser(user_id).subscribe(userdata => {
      this.selectedUser = userdata;
      this.panelVisible = true;
    })
  }

  public refresh(): void{
    this.userService.getAllUsersAdminView().subscribe(result => this.users = result);
    this.reportService.getAllUserReportsCount().subscribe(result => this.reportCounts = result);
  }

  public getReportsCount(id: number): number{
    return this.reportCounts.find(x => x.userId == id)?.count ?? 0;
  }

  closePanel() {
    this.panelVisible = false;
  }

  onSearchChanged(value: string) {
    this.searchValue = value;
  }

  public getUsers(): User[]{
      const chats = this.users;

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
