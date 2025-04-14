import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, forkJoin, map, Observable, of } from 'rxjs';
import { User } from '../model/user';
import { Transaction } from '../model/transaction';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseURL = 'http://localhost:3001';
  users = signal<User[]>([]);
  transactions = signal<Transaction[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  userService = inject(UserService);

  constructor(private http: HttpClient) {}

  // get users transactions
  getUsersTransactions(): Observable<any[]> {
    const currentUser = this.userService.currentUser();
    if (!currentUser) return of([]); // fallback if no user

    // forkJoin is an RxJS function that lets you:
    //  Run multiple Observables in parallel and wait for all of them to complete, then combine the results into one single object or array.
    return forkJoin({
      transactions: this.http.get<Transaction[]>(
        `${this.baseURL}/transactions`
      ),
      users: this.http.get<User[]>(`${this.baseURL}/users`),
    }).pipe(
      map(({ transactions, users }) => {
        return transactions
          .filter(
            (tx) =>
              tx.senderId.toString() == currentUser.id ||
              tx.recipientId.toString() == currentUser.id
          )
          .map((tx) => {
            const sender = users.find((u) => u.id == tx.senderId.toString());
            const recipient = users.find((u) => u.id == String(tx.recipientId));
            return {
              ...tx,
              senderName: sender?.fullName || 'Unknown',
              recipientName: recipient?.fullName || 'Unknown',
            };
          });
      })
    );
  }

  // get all transactions by admin
  getAllTransactions(): Observable<Transaction[]> {
    const currentUser = this.userService.currentUser();
    if (!currentUser) return of([]); // fallback if no user

    // forkJoin is an RxJS function that lets you:
    //  Run multiple Observables in parallel and wait for all of them to complete, then combine the results into one single object or array.
    return forkJoin({
      transactions: this.http.get<Transaction[]>(
        `${this.baseURL}/transactions`
      ),
      users: this.http.get<User[]>(`${this.baseURL}/users`),
    }).pipe(
      map(({ transactions, users }) => {
        return transactions.map((tx) => {
          const sender = users.find((u) => u.id == tx.senderId.toString());
          const recipient = users.find((u) => u.id == String(tx.recipientId));
          return {
            ...tx,
            senderName: sender?.fullName || 'Unknown',
            recipientName: recipient?.fullName || 'Unknown',
          };
        });
      })
    );
  }

  // make transaction
  makeTransaction(transaction: Transaction): Observable<Transaction> {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http
      .post<Transaction>(`${this.baseURL}/transactions`, transaction)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        catchError((err) => {
          this.error.set('Failed to create transaction');
          return of(transaction); // or throwError if you want to break
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
