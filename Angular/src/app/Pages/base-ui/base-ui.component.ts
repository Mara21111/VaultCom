import { NgIf } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-base-ui',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './base-ui.component.html',
  styleUrl: './base-ui.component.scss'
})
export class BaseUiComponent {

  @Input() title: string = 'test';
  @Input() searchOn: boolean = false;
  @Input() titleOn: boolean = false;
  @Input() friendsOn: boolean = false;
  @Input() profileOn: boolean = false;
  @Input() logOutOn: boolean = false;
  @Input() adminMenuOn: boolean = false;
  @Input() closeOn: boolean = false;
  @Input() closeRoute: string = 'test'
}
