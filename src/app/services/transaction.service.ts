import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
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
}
