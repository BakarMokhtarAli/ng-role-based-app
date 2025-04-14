import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../model/user';

@Component({
  selector: 'app-make-transaction',
  imports: [FormsModule],
  templateUrl: './make-transaction.component.html',
  styles: ``,
})
export class MakeTransactionComponent {
  userService = inject(UserService);
  transactionService = inject(TransactionService);
  users = signal<User[]>([]);

  amount = signal<number>(0);
  description = signal<string>('');
  // senderId = signal<string>('');
  recipientId = signal<string>('');
  date = signal<string>(new Date().toISOString());

  @Output() onCloseModal = new EventEmitter<void>();

  ngOnInit(): void {
    this.userService.fetchUsers();
    console.log('users:', this.userService.users());
  }

  handleCloseModel() {
    this.onCloseModal.emit();
  }
  onSubmit() {
    const transaction = {
      id: this.transactionService.generateId(),
      amount: this.amount(),
      description: this.description(),
      date: this.date(),
      recipientId: Number(this.recipientId()),
      senderId: Number(this.userService.currentUser()?.id),
    };
    if (this.recipientId() == this.userService.currentUser()?.id) {
      alert('You can not send money to yourself');
      return;
    }
    this.transactionService.makeTransaction(transaction).subscribe({
      next: (transaction) => {
        this.transactionService.transactions.set([
          ...this.transactionService.transactions(),
          transaction,
        ]);
        console.log('transaction created sucessfully:', transaction);
        this.handleCloseModel();
      },
      error: (err) => {
        console.log('err:', err);
      },
    });
  }
}
