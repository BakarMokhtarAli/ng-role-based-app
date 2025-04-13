import { Component, effect, inject, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { CurrencyPipe, NgIf } from '@angular/common';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-users',
  imports: [CurrencyPipe, NgIf, AddUserComponent, RouterLink],
  templateUrl: './users.component.html',
  styles: ``,
})
export class UsersComponent {
  userService = inject(UserService);
  transActionService = inject(TransactionService);
  // constructor(private userService: UserService) {}

  isOpenModel = signal(false);

  ngOnInit(): void {
    this.userService.fetchUsers();
    this.transActionService.getUsersTransactions().subscribe({
      next: (transactions) => {
        console.log('transactions:', transactions);
        // this.userService.users.set(transactions);
      },
      error: (err) => {
        console.log('err:', err);
      },
    });
  }
  handleOpenModel() {
    this.isOpenModel.set(true);
  }
  handleCloseModel() {
    this.isOpenModel.set(false);
    console.log('isOpenModel closed');
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id);
  }
}
