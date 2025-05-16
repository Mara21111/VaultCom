import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../models/User';
import { NgIf, CommonModule } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { UserService } from '../../services/user.service';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-admin-user-info-page',
  standalone: true,
  imports: [CommonModule, NgIf, BaseUiComponent],
  templateUrl: './admin-user-info-page.component.html',
  styleUrl: './admin-user-info-page.component.scss'
})
export class AdminUserInfoPageComponent {

  user: User = new User();
  reportCount: number;

  constructor(private route: ActivatedRoute, private userService: UserService, private reportService: ReportsService) {
  }

  ngOnInit() {
    this.userService.GetUser(this.route.snapshot.params['id']).subscribe(result => {
        this.user = result;
        this.reportService.UserReportCount(this.user.Id).subscribe(result => this.reportCount = result);
      })
  }
}
