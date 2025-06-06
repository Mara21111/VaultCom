import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { BaseUiComponent } from '../../Components/base-ui/base-ui.component';
import { UserInfoSidePanelComponent } from '../../Components/user-info-side-panel/user-info-side-panel.component';
import { UserService } from '../../services/User.service';
import {User, UserGetterDTO, UserPanelInfo} from '../../models/User';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-admin-all-users-page',
  standalone: true,
  imports: [NgFor, NgIf, BaseUiComponent, UserInfoSidePanelComponent, FormsModule],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {
  public users: UserGetterDTO[] = [];
  public filteredUsers: UserGetterDTO[] = [...this.users]

  public selectedUser: UserPanelInfo = new UserPanelInfo();
  public panelVisible: boolean = false;

  public isLoading = false;


  constructor(private userService: UserService, private reportsService: ReportsService) {

  }


  public ngOnInit(): void {
    this.isLoading = true;
    this.userService.getAllUsersAdminView().subscribe(result => {
      this.users = result;
      this.filteredUsers = [...this.users];
      this.isLoading = false;
    });
  }

  public onSearchChanged(value: string) {
    this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(value.toLowerCase()));
  }

  public goToUser(userId: number): void {
    const user = this.users.find(user => user.id === userId);

    this.selectedUser = {
      id: user?.id ?? 0,
      username: user?.username ?? 'Not found',
      email: user?.email ?? 'Private account',
      bio: user?.bio ?? 'Not set',
      createdAt: user?.createDate ?? 'Not created',
      banEnd: user?.banEnd ?? 'Not banned',
      reportCount: user?.reportCount ?? 'Not reported',
      password: ''
    };

    this.panelVisible = true;
  }

  public closePanel() {
    this.panelVisible = false;
    this.selectedUser = new UserPanelInfo();
  }
}
