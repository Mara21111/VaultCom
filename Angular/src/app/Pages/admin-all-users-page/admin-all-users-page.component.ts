import { Component, inject } from '@angular/core';
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

  users: User[] = [];
  selectedUser: User = new User;
  reportCounts: userReportCount[] = [];
  panelVisible: boolean = false;

  isTimeoutOrBanSelected: boolean = false;
  selectedDateTime: string = '';

  constructor(private userService: UserService, private router: Router, private reportService: ReportsService) {
  }

  public ngOnInit() {
    this.refresh();
  }

  public goToUser(user_id: number): void{
    this.userService.getById(user_id).subscribe(userdata => {
      this.selectedUser = userdata;
      this.panelVisible = true;
    })
  }

  public refresh(): void{
    this.userService.getAll().subscribe(result => this.users = result);
    this.reportService.getAllUserReportsCount().subscribe(result => this.reportCounts = result);
  }

  public getReportsCount(id: number): number{
    return this.reportCounts.find(x => x.userId == id)?.count ?? 0;
  }

  closePanel() {
    this.panelVisible = false;
  }
}

export class userReportCount {
  userId: number;
  count: number;
}