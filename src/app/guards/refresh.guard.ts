import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const refreshGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // navigation.id === 1 means the app was just loaded (refresh or direct URL)
  const navigation = router.getCurrentNavigation();
  const isDirectAccess = !navigation || navigation.id === 1;


  if (isDirectAccess) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
