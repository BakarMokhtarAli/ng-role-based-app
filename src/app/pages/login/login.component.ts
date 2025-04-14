import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { catchError, finalize, of } from 'rxjs';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  email = '';
  password = '';

  userService = inject(UserService);
  router = inject(Router);
  // constructor(public userService: UserService, router: Router) {}

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/transactions']);
    }
  }

  login() {
    this.userService.login(this.email, this.password).subscribe({
      next: (users) => {
        const user = users.find(
          (u) => u.email === this.email && u.password === this.password
        );
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.userService.isLoggedIn.set(true);
          this.userService.currentUser.set(user);
          if (user.role === 'admin') {
            this.router.navigate(['/users']);
          } else {
            this.router.navigate(['/transactions']);
          }
        } else {
          this.userService.error.set('Invalid email or password.');
        }
      },
      error: (err) => {
        console.log('err:', err);

        this.userService.error.set('Server error. Please try again.');
      },
    });
    // this.userService.users();
  }
}
