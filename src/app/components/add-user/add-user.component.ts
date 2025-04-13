import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-user',
  imports: [FormsModule, NgIf],
  templateUrl: './add-user.component.html',
  styles: ``,
})
export class AddUserComponent {
  @Output() handleCloseModel = new EventEmitter<void>();

  fullName = signal<string>('');
  email = signal<string>('');
  accountNumber = signal<string>('');
  balance = signal<number>(0);
  password = signal<string>('');
  roler = signal<'admin' | 'user'>('user');

  showSuccess = signal(false);

  userService = inject(UserService);
  users = signal<User[]>([]);

  // constructor(private userService: UserService) {}

  // ngOnInit(): void {
  //   this.userService.fetchUsers();
  // }

  onCloseModel() {
    this.handleCloseModel.emit();
  }
  onSubmit() {
    // generate string userId based users length
    const userId = this.users().length + 1;
    console.log('userId:', userId);

    const saveUser = {
      id: this.userService.generateId(),
      fullName: this.fullName(),
      email: this.email(),
      accountNumber: this.accountNumber(),
      balance: this.balance(),
      password: this.password(),
      role: this.roler(),
    };
    this.userService.registerUser(saveUser).subscribe({
      next: (user) => {
        // ✅ Show toast
        this.showSuccess.set(true);
        console.log('user:', user);
        this.handleCloseModel.emit(); // close modal

        // ✅ Auto close modal after 1.5s
        setTimeout(() => {
          this.showSuccess.set(false);
          this.handleCloseModel.emit(); // you already have this
        }, 1500);
      },
      error: (err) => {
        console.log('err:', err);
      },
    });
  }
}
