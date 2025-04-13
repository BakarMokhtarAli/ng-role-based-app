import { NgClass, NgIf } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../services/user.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  isNavOpen = signal<boolean>(false);
  isLoggedIn = signal<boolean>(false);
  // user = signal<User | null>(null);
  userService = inject(UserService);

  // constructor(private userService: UserService) {
  //   const user = JSON.parse(localStorage.getItem('user') || 'null');
  //   effect(() => {
  //     if (user) {
  //       this.isLoggedIn.set(true);
  //       // this.user.set(user);
  //     } else {
  //       this.isLoggedIn.set(false);
  //     }
  //     console.log('isLoggedIn:', this.isLoggedIn());
  //   });
  // }
  handleToggleNavBar() {
    this.isNavOpen.set(!this.isNavOpen());
  }
  logout() {
    this.userService.logout();
  }
}
