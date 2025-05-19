import { Component } from '@angular/core';
import { User } from '../../models/User';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
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

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router){
  }

  ngOnInit(){
    this.userService.GetFromToken().subscribe(result => {
      this.user = result;
      this.form = this.fb.group({
        username: this.user.username,
        email: this.user.email,
        curPassword: '',
        password: '',
        bio: this.user.bio,
      });
    });
  }

  togglePublicAccount() {
    this.user.isPublic = !this.user.isPublic;
  }

  toggleKidsMode() {
    this.user.safeMode = !this.user.safeMode;
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
    this.user.bio = this.form.value.bio;
  }

  save() {
    this.updateUser();
    this.errorMessage = '';

    this.userService.EditUser(this.user).subscribe({
      error: (err) => {this.errorMessage = err.error, this.panelVisible = true}
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate([ '/' ])
  }
}
