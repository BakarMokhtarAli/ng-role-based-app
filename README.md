# 💳 angular-role-based-app

A modern banking dashboard built with **Angular 19**, **Tailwind CSS**, and **RxJS Signals**. It supports role-based login, transaction and loan history, and real-time reactive UI — powered by `json-server` as a fake backend.

---

## 🔧 Features

- 🔐 **Login & Registration**
- 🔄 **Reactive Signal State Management**
- 👤 **Admin vs User Role-Based Access**
- 💸 **Transactions List per Logged-in User**
- 🏦 **Loans List per User**
- 🧪 **Mock API using `json-server`**
- ⚡ Modern Angular Features: `signal()`, `inject()`, functional guards

---

## 🛠️ Tech Stack

- [Angular 19](https://angular.io)
- [Tailwind CSS](https://tailwindcss.com/)
- [RxJS](https://rxjs.dev/)
- [json-server](https://github.com/typicode/json-server)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ng-banking-dashboard.git
cd ng-banking-dashboard
```
### 2. 2. Install dependencies
```bash
npm install
```

### 3. start the angular app
```bash
ng serve
```

### 4. Start the fake API backend
```bash
npx json-server --watch db.json --port 3001
```

