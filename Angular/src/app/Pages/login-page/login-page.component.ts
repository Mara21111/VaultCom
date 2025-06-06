import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { catchError } from 'rxjs';
import { NgIf, NgClass } from '@angular/common';
import { of } from 'rxjs';
import { LoginDTO } from '../../models/User';

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
  isLoading: boolean = false;

  public constructor(
    private authentication: AuthenticationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      Username: '',
      Password: ''
    });
  }

  public save(): void {
    this.isLoading = true;
    this.errorMessage = false; // Resetujeme chybovou zprávu

    var loginDTO = new LoginDTO();
    loginDTO.password = this.form.value.Password;
    loginDTO.username = this.form.value.Username;

    this.authentication.login(loginDTO).pipe(
      catchError(error => {
        this.isLoading = false;
        this.errorMessage = error.error?.message;
        this.triggerShake();
        return of(null);
      })
    ).subscribe(result => {
      if (result) {
        this.router.navigate(['/main']);
      }
      this.isLoading = false; // Nastavíme loading na false i po úspěchu
    });
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
