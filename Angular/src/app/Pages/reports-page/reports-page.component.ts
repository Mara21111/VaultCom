import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { Report_log } from '../../models/Report_log';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {

  data: Report_log[] = [];

  public constructor(private service: ReportsService)
  {
    this.service.getAll().subscribe(result => this.data = result)
  }
}
