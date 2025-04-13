export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  accountNumber: string;
  balance: number;
  role?: 'user' | 'admin';
}
