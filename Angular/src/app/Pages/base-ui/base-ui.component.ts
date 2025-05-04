import { NgIf } from '@angular/common';
import { Component, input, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-base-ui',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, FormsModule],
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

  @Output() searchChanged = new EventEmitter<string>();

  searchValue: string = '';
  user: User = new User;

  constructor(private userService: UserService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => this.user = result);
  }

  onSeachChange(value: string){
    this.searchValue = value;
    this.searchChanged.emit(value);
  }

  logout(){
    this.authService.logout();
  }
}
