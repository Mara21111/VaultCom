import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { BaseUiComponent } from '../../Components/base-ui/base-ui.component';
import { UserInfoSidePanelComponent } from '../../Components/user-info-side-panel/user-info-side-panel.component';
import { UserService } from '../../services/User.service';
import { User, UserPanelInfo } from '../../models/User';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-admin-all-users-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, UserInfoSidePanelComponent, FormsModule],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {
  @ViewChild(BaseUiComponent) baseComp!: BaseUiComponent;

  Users: User[] = [];
  selectedUser: UserPanelInfo = new UserPanelInfo();
  panelVisible: boolean = false;

  isTimeoutOrBanSelected: boolean = false;
  selectedDateTime: string = '';
  searchValue: string = '';

  constructor(private userService: UserService, private router: Router, private reportService: ReportsService) {

  }

  public ngOnInit(): void {
    this.refresh();
    this.searchValue = this.baseComp?.searchValue;
  }

  public goToUser(userId: number): void {
    this.userService.getUser(userId).subscribe(result => {
      this.selectedUser.username = result.username;
      this.selectedUser.email = result.email;
      this.selectedUser.bio = result.bio;
      this.selectedUser.createdAt = result.createdAt.toString() || 'Not created';
      this.selectedUser.banEnd = result.banEnd ? new Date(result.banEnd).toDateString() : 'Not banned';
      this.selectedUser.reportCount = '0';
    })

    this.panelVisible = true;
  }


  public refresh(): void {
    this.userService.getAllUsersAdminView().subscribe(result => this.Users = result);
  }

  closePanel() {
    this.panelVisible = false;
    this.selectedUser = new UserPanelInfo();
  }

  onSearchChanged(value: string) {
    this.searchValue = value;
  }

  public getUsers(): User[] {

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
