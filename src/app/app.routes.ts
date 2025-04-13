import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { LoansComponent } from './pages/loans/loans.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { authGuard } from './guards/auth.guard';
import { EditUserComponent } from './pages/edit-user/edit-user.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
    data: {
      roles: ['admin'], // ✅ only admins can access
    },
  },
  {
    path: 'users/:id',
    component: EditUserComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] }, // only admin can access this route
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'loans',
    component: LoansComponent,
    // canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '**',
    redirectTo: '/users',
  },
];
