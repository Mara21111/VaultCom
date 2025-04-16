import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-admin-all-users-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {

  data = inject(DataService)
}
