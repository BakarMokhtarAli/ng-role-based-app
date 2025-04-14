import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, forkJoin, map, Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { Loan } from '../model/loan';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private baseURL = 'http://localhost:3001';
  loans = signal<Loan[]>([]); // contains enriched loan data
  isLoading = signal(false);
  error = signal<string | null>(null);

  userService = inject(UserService);
  http = inject(HttpClient);

  constructor() {}

  // Get loans for the current user, enriched with user name
  getLoansForCurrentUser(): Observable<Loan[]> {
    const currentUser = this.userService.currentUser();
    if (!currentUser?.id) return of([]);

    return forkJoin({
      loans: this.http.get<Loan[]>(`${this.baseURL}/loans`),
      users: this.http.get<User[]>(`${this.baseURL}/users`),
    }).pipe(
      map(({ loans, users }) => {
        return loans
          .filter((loan) => loan.userId.toString() === currentUser.id)
          .map((loan) => {
            const user = users.find(
              (u) => u.id.toString() === loan.userId.toString()
            );
            return {
              ...loan,
              userName: user?.fullName || 'Unknown',
            };
          });
      })
    );
  }

  // get all loans by admin
  getAllLoans(): Observable<Loan[]> {
    const currentUser = this.userService.currentUser();
    if (!currentUser) return of([]); // fallback if no user

    // forkJoin is an RxJS function that lets you:
    //  Run multiple Observables in parallel and wait for all of them to complete, then combine the results into one single object or array.
    return forkJoin({
      loans: this.http.get<Loan[]>(`${this.baseURL}/loans`),
      users: this.http.get<User[]>(`${this.baseURL}/users`),
    }).pipe(
      map(({ loans, users }) => {
        return loans.map((loan) => {
          const user = users.find(
            (u) => u.id.toString() === loan.userId.toString()
          );
          return {
            ...loan,
            userName: user?.fullName || 'Unknown',
          };
        });
      })
    );
  }

  // create loan
  createLoan(loan: Loan): Observable<Loan> {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.post<Loan>(`${this.baseURL}/loans`, loan).pipe(
      finalize(() => this.isLoading.set(false)),
      catchError((err) => {
        this.error.set('Failed to create loan');
        return of(loan); // or throwError if you want to break
      })
    );
  }
  generateId(): string {
    // Get current year
    const year = new Date().getFullYear().toString().slice(-2);

    // Generate random 2 digit number
    const randomNum = Math.floor(Math.random() * 99)
      .toString()
      .padStart(2, '0');

    // Combine into student ID format YYXXXX
    return `${year}${randomNum}`;
  }
}
