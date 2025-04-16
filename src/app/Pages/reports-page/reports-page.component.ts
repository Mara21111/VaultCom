import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {

  data = inject(DataService)
}
