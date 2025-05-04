import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-admin-all-users-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, BaseUiComponent, FormsModule],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {

  users: User[] = [];
  selectedUser: User = new User;
  reportCount: number = 0;
  reportCounts: userReportCount[] = [];
  panelVisible: boolean = false;

  isTimeoutOrBanSelected: boolean = false;
  selectedDateTime: string = '';

  constructor(private userService: UserService, private router: Router, private reportService: ReportsService) {
  }

  public ngOnInit(){
    this.refresh();
  }

  public goToUser(user_id: number): void{
    this.userService.getById(user_id).subscribe(userdata => {
      this.selectedUser = userdata;
      this.reportService.userReportCount(this.selectedUser.id);
      this.panelVisible = true;
    })
  }
  
  closePanel(): void {
    this.panelVisible = false;
  }

  public refresh(): void{
    this.userService.getAll().subscribe(result => this.users = result);
    this.reportService.getAllUserReportsCount().subscribe(result => this.reportCounts = result);
  }

  public getReportsCount(id: number): number{
    return this.reportCounts.find(x => x.userId == id)?.count ?? 0;
  }


  // Triggered when the timeout button is clicked
  public onTimeoutClick(): void {
    this.isTimeoutOrBanSelected = true;
  }

  // Triggered when the ban button is clicked
  public onBanClick(): void {
    this.isTimeoutOrBanSelected = true;
  }

  // Method triggered when 'confirm' is clicked
  public onConfirm(): void {
    console.log('Selected Date and Time:', this.selectedDateTime);
    // Process the selected date and time here (update the user ban/timeout in the system)
    this.resetPopup();
  }

  // Method triggered when 'cancel' is clicked
  public onCancel(): void {
    this.resetPopup();
  }

  // Reset the state of the popup and input
  private resetPopup(): void {
    this.isTimeoutOrBanSelected = false;
    this.selectedDateTime = '';  // Reset selected date-time
  }
}

export class userReportCount {
  userId: number;
  count: number;
}