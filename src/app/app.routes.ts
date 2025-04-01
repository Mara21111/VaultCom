import { Routes } from '@angular/router';
import {LoginPageComponent} from './Pages/login-page/login-page.component';
import {SignInPageComponent} from './Pages/sign-in-page/sign-in-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent},
  { path: 'sigin', component: SignInPageComponent}
];
