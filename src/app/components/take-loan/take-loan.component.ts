import {
  Component,
  effect,
  EventEmitter,
  inject,
  Output,
  output,
  signal,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { LoanService } from '../../services/loan.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-loan',
  imports: [FormsModule],
  templateUrl: './take-loan.component.html',
  styles: ``,
})
export class TakeLoanComponent {
  userService = inject(UserService);
  loanService = inject(LoanService);

  @Output() onCloseModal = new EventEmitter<void>();

  amount = signal<number>(0);
  termMonths = signal<number>(0);
  interestRate = signal<number>(0);
  status = signal<'pending' | 'approved' | 'rejected'>('pending');
  createdAt = signal<string>(new Date().toISOString());

  constructor() {
    effect(() => {
      this.loanService.loans();
    });
  }
  handleCloseModel() {
    this.onCloseModal.emit();
  }

  isOpen = signal(false);

  handleOpenModel() {
    this.isOpen.set(true);
  }

  onSubmit() {
    const loan = {
      id: this.loanService.generateId(),
      userId: Number(this.userService.currentUser()?.id),
      amount: this.amount(),
      termMonths: this.termMonths(),
      interestRate: this.interestRate(),
      status: this.status(),
      createdAt: this.createdAt(),
    };
    this.loanService.createLoan(loan).subscribe({
      next: (loan) => {
        this.loanService.loans.set([...this.loanService.loans(), loan]);
        this.handleCloseModel();
      },
      error: (err) => {
        console.log('err:', err);
      },
    });
  }
}
