import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Report_log } from '../../models/Report_log';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-reports-page',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {

  reports: Report_log[] = [
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
    { user_id: 1, reported_user_id: 2, message: "test"},
  ];
}
