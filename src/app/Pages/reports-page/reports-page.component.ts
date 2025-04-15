import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reports-page',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {

  data = inject(DataService)
}
