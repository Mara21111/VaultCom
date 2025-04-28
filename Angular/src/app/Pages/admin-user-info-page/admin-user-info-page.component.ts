import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models/User';
import { NgIf } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-admin-user-info-page',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, NgIf, BaseUiComponent],
  templateUrl: './admin-user-info-page.component.html',
  styleUrl: './admin-user-info-page.component.scss'
})
export class AdminUserInfoPageComponent {

  user: User | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit() {
    console.log(this.route.snapshot.params['id']);
    this.userService.getById(this.route.snapshot.params['id'])
      .pipe(
        catchError(error => 
          error = "Uživatel nebyl nalezen."
        )
      )
      .subscribe(result => this.user == result);
  }
}
