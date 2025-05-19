import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from './services/Authentication.service';

export const authenticaionInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthenticationService).getToken();

  const newReq = req.clone({
    headers: req.headers.append('Authorization', 'Bearer' + token),
  });

  return next(req);
};
