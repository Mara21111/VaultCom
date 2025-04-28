import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FormsModule, NgIf ],
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

    this.authentication.login(this.form.value).pipe(
      catchError(error => {
        this.errorMessage = true;
        throw error;
      })
    ).subscribe(result => this.router.navigate([ '/main' ]));
  }
}