import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { Report_log } from '../../models/Report_log';
import { User } from '../../models/User';
import { ReportsService } from '../../services/reports.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {

  data: Report_log[] = [];
  users: User[] = [];

  public constructor(private reportsService: ReportsService, private userService: UserService, private router: Router) {
    this.reportsService.getAll().subscribe(result => this.data = result)
    this.userService.getAll().subscribe(result => this.users = result)
  }

  public goToUser(id: number): void{
    this.router.navigate(['/admin-user-info/', id])
  }

  getUsername(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }
}