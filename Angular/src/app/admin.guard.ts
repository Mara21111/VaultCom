import { CanActivateFn } from '@angular/router';
import { UserService } from './services/User.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/User';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router)
  let user = new User;

  return userService.getFromToken().pipe(
    map(user => {
      if (user && user.isAdmin) {
        return true;
      } else {
        router.navigate(['/main']);
        return false;
      }
    }),
  );
};

