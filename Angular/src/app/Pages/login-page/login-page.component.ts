import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FormsModule ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';

  onSubmit(form: NgForm) {
    if (form.invalid) {
      // This will trigger the effect if the form is invalid
      console.log('Form is invalid');
    } else {
      console.log('username: ' + this.username);
      console.log('password: ' + this.password)
    }
  }
}