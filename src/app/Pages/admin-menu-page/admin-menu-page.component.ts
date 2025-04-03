import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-menu-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-menu-page.component.html',
  styleUrl: './admin-menu-page.component.scss'
})
export class AdminMenuPageComponent {

}
