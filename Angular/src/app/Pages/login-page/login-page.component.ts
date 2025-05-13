import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

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
    console.log('usernameInput:', this.usernameInput);
    console.log('passwordInput:', this.passwordInput);

    this.errorMessage = false;

    console.log('Trying to log in with:', this.form.value);

    this.authentication.login(this.form.value).pipe(catchError(error => {
        this.errorMessage = true;
        this.triggerShake();
        throw error;
      })
    ).subscribe(result => this.router.navigate([ '/main' ]));
  }


  private triggerShake(): void {
    const inputs = [this.usernameInput.nativeElement, this.passwordInput.nativeElement];
    inputs.forEach(input => {
      input.classList.remove('shake-error');
      setTimeout(() => {
        input.classList.add('shake-error');
      }, 10);
    });
  }
}
