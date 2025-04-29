import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-admin-all-users-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {

  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(){
    this.refresh();
  }

  goToUser(id: number): void{
    this.router.navigate(['/admin-user-info/', id])
  }

  refresh(): void{
    this.userService.getAll().subscribe(result => this.users = result);
  }
}
