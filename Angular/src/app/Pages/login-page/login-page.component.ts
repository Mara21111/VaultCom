import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { catchError } from 'rxjs';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [NgIf, NgClass, ReactiveFormsModule, RouterLink, RouterLinkActive ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})

export class LoginPageComponent {

  form: FormGroup;
  errorMessage: boolean = false;

  public constructor(
              private authentication: AuthenticationService,
              private fb: FormBuilder,
              private router: Router) {
    this.form = this.fb.group({
      username: '',
      password: ''
    });
  }

  public save(): void {
    this.errorMessage = false;

    console.log('Trying to log in with:', this.form.value);

    this.authentication.login(this.form.value).pipe(catchError(error => {
        this.errorMessage = true;
        setTimeout(() => {
          this.errorMessage = false;
        }, 500);
        throw error;
      })
    ).subscribe(result => this.router.navigate([ '/main' ]));
  }
}
