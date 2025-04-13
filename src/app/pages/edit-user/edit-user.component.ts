import {
  Component,
  inject,
  input,
  Input,
  linkedSignal,
  signal,
} from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  imports: [FormsModule],
  templateUrl: './edit-user.component.html',
  styles: ``,
})
export class EditUserComponent {
  // @Input() id!: string;
  id = input<string>('');
  user = signal<User | null>(null);

  fullName = linkedSignal(() => this.user()?.fullName ?? '');
  // fullName = '';
  email = linkedSignal(() => this.user()?.email ?? '');
  accountNumber = linkedSignal(() => this.user()?.accountNumber ?? '');
  balance = linkedSignal(() => this.user()?.balance ?? 0);
  password = linkedSignal(() => this.user()?.password ?? '');
  role = linkedSignal(() => this.user()?.role ?? 'user');

  showSuccess = signal(false);

  userService = inject(UserService);
  // users = signal<User[]>([]);

  ngOnInit(): void {
    this.userService.getUser(this.id()).subscribe({
      next: (user) => {
        console.log('user:', user);
        this.user.set(user);
      },
      error: (err) => {
        console.log('err:', err);
      },
    });
  }

  onSubmit() {
    const updatedUser = {
      id: this.id(),
      fullName: this.fullName(),
      email: this.email(),
      accountNumber: this.accountNumber(),
      balance: this.balance(),
      password: this.password(),
      role: this.role(),
    };
    this.userService.updateUser(updatedUser);
  }
}
