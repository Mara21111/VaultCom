import { Component } from '@angular/core';
import {EditUserDTO, ProfilePictureDTO, ToggleUserDTO, User, UserPanelInfo} from '../../models/User';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { UserService } from '../../services/User.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import {UserInfoSidePanelComponent} from '../../Components/user-info-side-panel/user-info-side-panel.component';
import {ReportsService} from '../../services/reports.service';
import {delay, switchMap} from 'rxjs';

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
}
