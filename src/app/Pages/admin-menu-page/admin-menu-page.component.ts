import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-admin-menu-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, BaseUiComponent],
  templateUrl: './admin-menu-page.component.html',
  styleUrl: './admin-menu-page.component.scss'
})
export class AdminMenuPageComponent {

}
