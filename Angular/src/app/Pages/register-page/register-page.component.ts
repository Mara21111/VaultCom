import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onRegister() {
    console.log('Name:', this.name);
    console.log('Email/Tel:', this.email);
    console.log('Password:', this.password);
    console.log('Repeat Password:', this.confirmPassword);
  }
}
