import { NgIf } from '@angular/common';
import { Component, input, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

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

  user: User = new User;

  @Output() searchChanged = new EventEmitter<string>();

  searchValue: string = '';

  constructor(private userService: UserService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => this.user = result);
  }
}
