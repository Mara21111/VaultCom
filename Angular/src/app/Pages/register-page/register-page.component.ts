import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService} from '../../services/User.service';
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
  user: CreateUserDTO;
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

    // Služba pro vytvoření uživatele
    this.userService.createUser(this.user).pipe(
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
    ).subscribe(_ => {
      // Po úspěšné registraci se pokusíme přihlásit
      let loginDTO = new LoginDTO();
      loginDTO.username = this.user.username;
      loginDTO.password = this.user.password;

      this.authService.login(loginDTO).pipe(
        catchError(error => {
          this.errorText = 'Přihlášení po registraci selhalo.';
          this.errorMessage = true;
          this.isLoading = false;
          this.triggerShake();  // Zaklepání username a hesla
          throw error;
        })
      ).subscribe(result => {
        if (result) {
          this.router.navigate(['/main']);
        }
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
    this.user = new CreateUserDTO;
    this.user.username = this.form.value.username;
    this.user.email = this.form.value.email;
    this.user.password = this.form.value.password;
    this.user.bio = '';
    this.user.isAdmin = false;
    this.rPassword = this.form.value.rPassword;
  }
}