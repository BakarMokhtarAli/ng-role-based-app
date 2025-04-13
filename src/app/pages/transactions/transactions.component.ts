import { Component, inject, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../model/transaction';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-transactions',
  imports: [RouterLink, CurrencyPipe, DatePipe, NgIf],
  templateUrl: './transactions.component.html',
  styles: ``,
})
export class TransactionsComponent {
  transactionService = inject(TransactionService);
  userService = inject(UserService);
  transactions = signal<Transaction[]>([]);

  // constructor(private transActionSerice: TransactionService) { }

  ngOnInit(): void {
    if (this.userService.currentUser()?.role === 'admin') {
      this.transactionService.getAllTransactions().subscribe({
        next: (transactions) => {
          console.log('transactions:', transactions);
          this.transactions.set(transactions);
        },
        error: (err) => {
          console.log('err:', err);
        },
      });
    } else {
      this.transactionService.getUsersTransactions().subscribe({
        next: (transactions) => {
          console.log('transactions:', transactions);
          this.transactions.set(transactions);
        },
        error: (err) => {
          console.log('err:', err);
        },
      });
    }
  }
}
