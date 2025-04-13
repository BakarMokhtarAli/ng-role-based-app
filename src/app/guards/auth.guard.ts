import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // inject Router in a functional guard
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // ✅ Check for role if provided in route data
  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // ❌ Not authorized
    router.navigate(['/transactions']); // or /dashboard or somewhere else
    return false;
  }
  return true;

  // simple auth with out checkin user's role
  // if (user) {
  //   return true; // user is logged in
  // }

  // router.navigate(['/login']); // redirect to login
  // return false;
};
