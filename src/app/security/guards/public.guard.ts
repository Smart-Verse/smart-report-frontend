import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {CookiesService} from '../../shared/services/cookies/cookies.service';
import {EnumCookie} from '../../shared/services/cookies/cookie.enum';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const cookiesService = inject(CookiesService);
  return cookiesService.get(EnumCookie.AUTHORIZATION)
    ? router.createUrlTree(['/home'])
    : true;
};
