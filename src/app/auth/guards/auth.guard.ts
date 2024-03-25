import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthentication().pipe(
    // tap((isAuth) => console.log('Authenticated: ', isAuth)),
    tap((isAuth) => {
      if (!isAuth) router.navigate(['./auth/login']);
    })
  );
}

export const canActivatedGuard: CanActivateFn = (route, state) => {
  return checkAuthStatus();
};

export const canMatchGuard: CanMatchFn = (route, segments) => {
  return checkAuthStatus();
};
