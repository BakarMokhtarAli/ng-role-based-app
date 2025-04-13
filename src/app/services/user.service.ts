import { effect, Injectable, signal } from '@angular/core';
import { User } from '../model/user';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  of,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseURL = 'http://localhost:3001/users';
  users = signal<User[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  isLoggedIn = signal<boolean>(!!localStorage.getItem('user'));

  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // effect(() => {
    //   this.users();
    // });
  }

  fetchUsers() {
    this.isLoading.set(true);
    this.error.set(null); // reset error
    return this.http
      .get<User[]>(this.baseURL)
      .pipe(
        catchError((err) => {
          this.error.set('Server error. Please try again.');
          return of([]);
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (users) => {
          this.users.set(users);
        },
        error: (err) => {
          this.error.set(err || 'Server error. Please try again.');
          console.log('err:', err);
        },
      });
  }

  loadUserFromStorage() {
    const data = localStorage.getItem('user');
    if (data) {
      this.currentUser.set(JSON.parse(data));
    }
  }

  login(email: string, password: string) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.get<User[]>(this.baseURL).pipe(
      catchError((err) => {
        this.error.set('Server error. Please try again.');
        return of([]);
      }),
      finalize(() => {
        this.isLoading.set(false);
      })
    );
  }
  logout() {
    localStorage.removeItem('user');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  registerUser(user: User) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.post<User>(this.baseURL, user).pipe(
      finalize(() => this.isLoading.set(false)),
      tap((newUser) => {
        // 👇 Update the users signal after successful post
        const currentUsers = this.users();
        if (currentUsers) {
          this.users.set([newUser, ...currentUsers]);
        }
      }),
      catchError((err) => {
        this.error.set('Failed to register user');
        return of(user); // or throwError if you want to break
      })
    );
  }

  getUser(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.get<User>(`${this.baseURL}/${id}`).pipe(
      finalize(() => this.isLoading.set(false)),
      catchError((err) => {
        this.error.set('Failed to get user');
        return of(null); // or throwError if you want to break
      })
    );
  }

  //update user
  updateUser(user: User) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http
      .put<User>(`${this.baseURL}/${user.id}`, user)
      .pipe(
        catchError((err) => {
          this.error.set('Failed to update user');
          return of(user); // or throwError if you want to break
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((user) => {
        // 👇 Update the users signal after successful post
        // const currentUsers = this.users();
        // if (currentUsers) {
        //   this.users.set(
        //     currentUsers.map((u) => (u.id === user.id ? user : u))
        //   );
        // }
        console.log('user updated sucessfully:', user);

        this.router.navigate(['/users']);
      });
  }

  deleteUser(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http
      .delete(`${this.baseURL}/${id}`)
      .pipe(
        catchError((err) => {
          this.error.set('Failed to delete user');
          return of(id); // or throwError if you want to break
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((user) => {
        // 👇 Update the users signal after successful post
        // const currentUsers = this.users();
        // if (currentUsers) {
        //   this.users.set(currentUsers.filter((u) => u.id !== id));
        // }
        console.log('user deleted sucessfully:', user);

        this.router.navigate(['/users']);
      });
  }

  generateId(): string {
    // Get current year
    const year = new Date().getFullYear().toString().slice(-2);

    // Generate random 3 digit number
    const randomNum = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, '0');

    // Combine into student ID format YYXXXX
    return `${year}${randomNum}`;
  }
}
