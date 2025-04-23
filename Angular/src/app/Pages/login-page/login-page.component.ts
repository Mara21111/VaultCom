import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FormsModule ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';

  onLogin() {
    console.log('Email:', this.username);
    console.log('Password:', this.password);
  }
}