import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { BaseUiComponent } from '../../Components/base-ui/base-ui.component';
import { UserInfoSidePanelComponent } from '../../Components/user-info-side-panel/user-info-side-panel.component';
import { UserService } from '../../services/User.service';
import { User, UserPanelInfo } from '../../models/User';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-admin-all-users-page',
  standalone: true,
  imports: [NgFor, NgIf, BaseUiComponent, UserInfoSidePanelComponent, FormsModule],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {
  public users: User[] = [];
  public filteredUsers: User[] = [...this.users]

  public selectedUser: UserPanelInfo = new UserPanelInfo();
  public panelVisible: boolean = false;


  constructor(private userService: UserService, private reportsService: ReportsService) {

  }


  public ngOnInit(): void {
    this.userService.getAllUsersAdminView().subscribe(result => {
      this.users = result;
      this.filteredUsers = [...this.users];
    });
  }

  public onSearchChanged(value: string) {
    this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(value.toLowerCase()));
  }

  public reportCount(userId: number): number {
    return 0;
  }

  public goToUser(userId: number): void {
    this.userService.getUser(userId).subscribe(result => {
      this.selectedUser.username = result.username;
      this.selectedUser.email = result.email ?? 'Not set';
      this.selectedUser.bio = result.bio ?? 'Not set';
      this.selectedUser.createdAt = result.createdAt.toString() || 'Not created';
      this.selectedUser.banEnd = result.banEnd ? new Date(result.banEnd).toDateString() : 'Not banned';
      this.reportsService.getReportCountOfUser(userId).subscribe(result => this.selectedUser.reportCount = result.toString())
    });

    this.reportsService.getReportCountOfUser(userId).subscribe(result => this.selectedUser.reportCount = result.toString());

    this.panelVisible = true;
  }

  public closePanel() {
    this.panelVisible = false;
    this.selectedUser = new UserPanelInfo();
  }
}
