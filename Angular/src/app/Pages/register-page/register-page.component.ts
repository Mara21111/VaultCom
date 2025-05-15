import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, CreateUserDTO, LoginDTO } from '../../models/User';
import { catchError } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, RouterOutlet, NgIf, NgClass],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterComponent {

  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;

  form: FormGroup;
  errorMessage: boolean = false;
  errorText: string = '';
  user: User;
  rPassword: string;
  isLoading: boolean = false;

  public constructor (private fb: FormBuilder, private router: Router, private userService: UserService, private authService: AuthenticationService) {
    this.form = this.fb.group({
      username: '',
      email: '',
      password: '',
      rPassword: ''
    })
  }

  /*public save(): void {
    this.GetValues();
    this.errorMessage = false;

    if(this.user.username == ''){
      this.errorMessage = true;
      throw new Error('Please set username')
    }

    if(this.user.password != this.rPassword){
      this.errorMessage = true;
      throw new Error('Password does not match');
    }

    const cto: CreateUserDTO = {
      Username: this.user.username,
      Email: this.user.email,
      Password: this.user.password,
      Bio: this.user.bio
    }

    this.userService.createUser(cto).pipe(
      catchError(error =>{throw error})
    ).subscribe(response => console.log(response));

    this.authService.login(new Credentials(this.form.value.username, this.form.value.password)).pipe(
      catchError(error => {
        this.errorMessage = true;
        throw error;
      })
    ).subscribe(result => this.router.navigate([ '/main' ]));
  }*/

  public save(): void {
    this.GetValues();
    this.errorMessage = false;
    this.errorText = '';
    this.isLoading = true;

    if (this.user.username === '') {
      this.errorText = 'Zadejte uživatelské jméno.';
      this.errorMessage = true;
      this.isLoading = false;
      this.triggerShake();  // Zaklepání všech polí
      return;
    }

    if (this.user.password !== this.rPassword) {
      this.errorText = 'Hesla se neshodují.';
      this.errorMessage = true;
      this.isLoading = false;
      this.triggerShake();  // Zaklepání hesla
      return;
    }

    const cto: CreateUserDTO = {
      Username: this.user.username,
      Email: this.user.email,
      Password: this.user.password,
      Bio: this.user.bio,
      IsAdmin: false
    };

    // Služba pro vytvoření uživatele
    this.userService.CreateUser(cto).pipe(
      catchError(error => {
        if (error.status === 400) {  // Pokud uživatel nebo email již existuje
          this.errorText = 'Uživatel nebo email již existuje.';
          this.errorMessage = true;
          this.isLoading = false;
          this.triggerShake();  // Zaklepání username a emailu
        } else {
          this.errorText = 'Registrace selhala.';
          this.errorMessage = true;
          this.isLoading = false;
        }
        throw error;
      })
    ).subscribe(() => {
      // Po úspěšné registraci se pokusíme přihlásit
      const dto = new LoginDTO();
      dto.Username = this.form.value.username;
      dto.Password = this.form.value.password;

      this.authService.login(dto).pipe(
        catchError(error => {
          this.errorText = 'Přihlášení po registraci selhalo.';
          this.errorMessage = true;
          this.isLoading = false;
          this.triggerShake();  // Zaklepání username a hesla
          throw error;
        })
      ).subscribe(result => {
        this.router.navigate(['/main']);
        this.isLoading = false;
      });
    });
  }

  triggerShake(): void {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input: any) => {
      input.classList.add('shake-error');
      setTimeout(() => {
        input.classList.remove('shake-error');
      }, 500);
    });
  }

  public GetValues(): void{
    this.user.username = this.form.get('username')!.value;
    this.user.email = this.form.get('email')?.value;
    this.user.password = this.form.get('password')!.value;
    this.rPassword = this.form.get('rPassword')!.value;
  }
}

class Credentials {
  constructor(  public username: string,
                public password: string) {}
}
