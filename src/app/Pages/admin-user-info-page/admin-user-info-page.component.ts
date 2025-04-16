import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models/User';
import { NgIf } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-admin-user-info-page',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, NgIf, BaseUiComponent],
  templateUrl: './admin-user-info-page.component.html',
  styleUrl: './admin-user-info-page.component.scss'
})
export class AdminUserInfoPageComponent {

  data = inject(DataService)

  user: User = this.data.users[0];
}
