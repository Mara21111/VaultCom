import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { SidePanelComponent } from '../../Components/side-panel/side-panel.component';
import { Report_log } from '../../models/Report_log';
import { User } from '../../models/User';
import { ReportsService } from '../../services/reports.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, SidePanelComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {

  data: Report_log[] = [];
  users: User[] = [];
  selectedUser: User = new User;
  reportsCount: number = 0;
  panelVisible = false;

  public constructor(private reportsService: ReportsService, private userService: UserService, private router: Router) {
    this.reportsService.getAll().subscribe(result => this.data = result)
    this.reportsService.userReportCount(this.selectedUser.id).subscribe(result => this.reportsCount = result)
    this.userService.getAll().subscribe(result => this.users = result)
  }

  public goToUser(user_id: number): void{
    this.userService.getById(user_id).subscribe(result => this.selectedUser = result)
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
}