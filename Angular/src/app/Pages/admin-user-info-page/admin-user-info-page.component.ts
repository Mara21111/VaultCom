import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../models/User';
import { NgIf, CommonModule } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { UserService } from '../../services/user.service';
import { ReportsService } from '../../services/reports.service';
import { Report_log } from '../../models/Report_log';

@Component({
  selector: 'app-admin-user-info-page',
  standalone: true,
  imports: [CommonModule, NgIf, BaseUiComponent],
  templateUrl: './admin-user-info-page.component.html',
  styleUrl: './admin-user-info-page.component.scss'
})
export class AdminUserInfoPageComponent {

  user: User;
  reportCount: number;

  constructor(private route: ActivatedRoute, private userService: UserService, private reportService: ReportsService) {
  }

  ngOnInit() {
    this.userService.getById(this.route.snapshot.params['id'])
      .subscribe(result => {
        this.user = result;
        this.reportService.userReportCount(this.user.id).subscribe(result => this.reportCount = result);
      })
  }
}
