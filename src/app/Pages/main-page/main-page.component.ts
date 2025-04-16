import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BaseUiComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
