import { Component } from '@angular/core';
import {User, UserPanelInfo} from '../../models/User';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { UserService } from '../../services/User.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import {UserInfoSidePanelComponent} from '../../Components/user-info-side-panel/user-info-side-panel.component';
import {ReportsService} from '../../services/reports.service';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, BaseUiComponent, CommonModule, ReactiveFormsModule, UserInfoSidePanelComponent],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})


export class UserProfilePageComponent {

  darkMode: Boolean = true;
  form: FormGroup;
  errorMessage: string = '';

  public panelVisible: boolean = false;
  public userPanelInfo: UserPanelInfo = new UserPanelInfo()

  user: User = new User;
this: any;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private reportService: ReportsService,
    private router: Router) {
  }

  ngOnInit(){
    this.userService.getFromToken().subscribe(result => {
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

  getProfilePicture(): string {
    return this.user ? this.user.profilePicture : '/uploads/pfps/default.png';
  }

  updateUser() {
    this.user.username = this.form.value.username;
    this.user.email = this.form.value.email;
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
    this.router.navigate([ '/' ])
  }

  public editUser() {
    this.userPanelInfo.username = this.user.username;
    this.userPanelInfo.email = this.user.email;
    this.userPanelInfo.bio = this.user.bio;
    this.userPanelInfo.createdAt = this.user.createdAt.toString();
    this.userPanelInfo.banEnd = this.user.banEnd.toString();

    this.reportService.getReportCountOfUser(this.user.id).subscribe(result => this.userPanelInfo.reportCount = result.toString())

    this.panelVisible = true;
  }

  public closePanel() {
    this.panelVisible = false;
    this.userPanelInfo = new UserPanelInfo();
  }
}
