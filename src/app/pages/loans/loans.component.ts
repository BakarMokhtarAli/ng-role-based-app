import { Component, inject, signal } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../model/loan';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-loans',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './loans.component.html',
  styles: ``,
})
export class LoansComponent {
  loans = signal<Loan[]>([]);
  loanService = inject(LoanService);
  userService = inject(UserService);

  ngOnInit(): void {
    if (this.userService.currentUser()?.role === 'admin') {
      this.loanService.getAllLoans().subscribe({
        next: (loans) => {
          console.log('loans:', loans);
          this.loans.set(loans);
        },
        error: (err) => {
          console.log('err:', err);
        },
      });
    } else {
      this.loanService.getLoansForCurrentUser().subscribe({
        next: (loans) => {
          console.log('loans:', loans);
          this.loans.set(loans);
        },
        error: (err) => {
          console.log('err:', err);
        },
      });
    }
  }
}
