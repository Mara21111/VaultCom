import { Component } from '@angular/core';
import {changePasswordDTO, EditUserDTO, ProfilePictureDTO, ToggleUserDTO, User, UserPanelInfo} from '../../models/User';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { UserService } from '../../services/User.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import {UserInfoSidePanelComponent} from '../../Components/user-info-side-panel/user-info-side-panel.component';
import {ReportsService} from '../../services/reports.service';
import {delay, switchMap} from 'rxjs';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, BaseUiComponent, CommonModule, ReactiveFormsModule, UserInfoSidePanelComponent, FormsModule],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})


export class UserProfilePageComponent {

  darkMode: Boolean = true;
  form: FormGroup;
  errorMessage: string = '';

  public panelVisible: boolean = false;
  public userPanelInfo: UserPanelInfo = new UserPanelInfo()
  public showPasswordPopup: boolean = false;

  user: User = new User;
  this: any;

  password: string = '';
  newPassword: string = '';
  newPassword2: string = '';

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

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  const formData = new FormData();
  formData.append('PFP', file);
  formData.append('Id', this.user.id.toString());

  this.userService.uploadPfp(formData).subscribe(_ => this.ngOnInit());
}

  togglePublicAccount() {
    let edit = new ToggleUserDTO();
    edit.id = this.user.id;
    edit.value = !this.user.isPublic;
    this.userService.toggleUserIsPublic(edit).subscribe(_ => this.ngOnInit());
  }

  toggleKidsMode() {
    let edit = new ToggleUserDTO();
    edit.id = this.user.id;
    edit.value = !this.user.safeMode;
    this.userService.toggleUserSafeMode(edit).subscribe(_ => this.ngOnInit());
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

  public goToUser() {
    console.log('goToUser');
    let reportCount: string = '';
    this.reportService.getReportCountOfUser(this.user.id).subscribe(result => reportCount = result.toString())

    this.userPanelInfo = {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      bio: this.user.bio,
      reportCount: reportCount,
      password: '',
      createdAt: this.user.createdAt.toString(),
      banEnd: this.user.banEnd?.toString() ?? 'Not banned'
    }

    this.panelVisible = true;
    console.log(this.panelVisible);
  }

  public editUser(user: UserPanelInfo) {

    const dto = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      name: user.username,
      password: user.password
    }

    console.log(dto);

    this.userService.editUser(dto).pipe(
      switchMap(() => this.userService.getFromToken())
    ).subscribe(result => {
      this.user = result;
    });

    this.closePanel();
  }

  public closePanel() {
    this.panelVisible = false;
    this.userPanelInfo = new UserPanelInfo();
  }

  public changePasswordPopup() {
    this.closePanel();
    this.showPasswordPopup = true;
  }

  public changePassword() {
    let dto = new changePasswordDTO();
    dto.id = this.user.id;
    dto.password = this.password;
    dto.newPassword = this.newPassword;
    dto.newPassword2 = this.newPassword2;

    this.userService.changePassword(dto).subscribe(_ => this.ngOnInit());
    this.closePasswordPopup();
    this.resetPasswordPopup();
  }

  public closePasswordPopup() {
    this.showPasswordPopup = false;
  }

  public resetPasswordPopup() {
    this.password = '';
    this.newPassword = '';
    this.newPassword2 = '';
  }
}
