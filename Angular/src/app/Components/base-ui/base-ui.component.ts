import { CommonModule, NgIf } from '@angular/common';
import { Component, input, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { UserService } from '../../services/User.service';
import { User } from '../../models/User';
import { EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../services/Authentication.service';
import { FormsModule } from '@angular/forms';

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

  public user: User = new User;

  @Output() searchChanged = new EventEmitter<string>();

  searchValue: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => this.user = result);
  }

  public onSearchChange(value: string){
    this.searchValue = value;
    this.searchChanged.emit(value);
  }

  public logout(){
    this.authService.logout();
    this.router.navigate([ '/' ])
  }
}
