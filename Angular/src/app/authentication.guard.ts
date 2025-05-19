import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from './services/Authentication.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authenticated = inject(AuthenticationService).isAuthenticated();
  const router = inject(Router);

  if (!authenticated) {
    router.navigate([ '/' ]);
    return false;
  }

  return true;
};
