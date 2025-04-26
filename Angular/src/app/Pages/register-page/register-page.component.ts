import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterOutlet],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterComponent {
  
  form: FormGroup;
  errorMessage: boolean = false;
  user: User;
  rPassword: string;
  
  public constructor (private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.form = this.fb.group({
      username: '',
      email: '',
      password: '',
      rPassword: ''
    })

    this.user = this.userService.getNewUser();
  }

  public save(): void {
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

    console.log(this.user)
    
    this.userService.createUser(this.user).pipe(
      catchError(error =>{throw error})
    ).subscribe(response => console.log(response));
  }

  public GetValues(): void{
    this.user.username = this.form.get('username')!.value;
    this.user.email = this.form.get('email')?.value;
    this.user.password = this.form.get('password')!.value;
    this.rPassword = this.form.get('rPassword')!.value;
  }
}
