import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { User } from '../../models/User';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, BaseUiComponent],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})


export class UserProfilePageComponent {

  data = inject(DataService)

  user: User = this.data.users[0];

  darkMode: Boolean = true;

  togglePublicAccount() {
    this.user.is_public = !this.user.is_public;
  }

  toggleKidsMode() {
    this.user.safe_mode = !this.user.safe_mode;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
}