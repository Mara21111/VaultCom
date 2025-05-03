import { Component } from '@angular/core';
import { User } from '../../models/User';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, BaseUiComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})


export class UserProfilePageComponent {

  darkMode: Boolean = true;
  form: FormGroup;
  errorMessage: string = '';
  panelVisible = false;

  user: User = new User;

  constructor(private userService: UserService, private fb: FormBuilder, private authService: AuthenticationService){
  }

  ngOnInit(){
    this.userService.getFromToken().subscribe(result => {
      this.user = result;
      this.form = this.fb.group({
        username: this.user.username,
        email: this.user.email,
        curPassword: '',
        password: '',
        phone: this.user.phone_Number,
        bio: this.user.bio,
      });
    });
  }

  togglePublicAccount() {
    this.user.is_Public = !this.user.is_Public;
  }

  toggleKidsMode() {
    this.user.safe_mode = !this.user.safe_mode;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  openPanel() {
    this.panelVisible = true;
  }

  closePanel() {
    this.panelVisible = false;
    this.updateUser();
  }
  
  updateUser() {
    this.user.username = this.form.value.username;
    this.user.email = this.form.value.email;
    this.user.phone_Number = this.form.value.phone;
    this.user.bio = this.form.value.bio;
  }

  save() {
    this.updateUser();
    this.errorMessage = '';

    this.userService.editUser(this.user).subscribe({
      error: (err) => {this.errorMessage = err.error, this.panelVisible = true}
    });
  }

  logout() {
    this.authService.logout();
  }
}