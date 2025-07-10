# 💸 Expense Tracker Assignment (Final Stage)

This is a **personal finance tracker** built using **Next.js 15**, **MongoDB**, **Shadcn UI**, and **Recharts**. It allows users to add, view, and manage their income and expenses in a user-friendly dashboard.

---

## 🚀 Features

* Add, update, and delete transactions
* Budget with Category ( for each month )
* Dashboard with Pichart , Monthly expense , Budget vs Actual 
* Filter transactions by type, date, and category
* Bar and Pie charts with **Recharts**
* Stylish UI with **Shadcn UI**
* Backend with **Next.js App Router API Routes**
* Data persistence using **MongoDB**

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 15, Shadcn UI, TailwindCSS
* **Backend:** App Router (API Routes)
* **Database:** MongoDB (with Mongoose)
* **Charts:** Recharts

---

## 🧾 Installation Guide

### ✅ Prerequisites

* Node.js (v18 or above)
* MongoDB URI (You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 🌀 Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

### 📦 Install Dependencies

```bash
npm install
```

### 🛠️ Set Up Environment Variables

Create a `.env.local` file in the root folder:

```env
NEXT_PUBLIC_MONGODB_URI= "your_mongodb_connection_string"
```

> Replace `your_mongodb_connection_string` with your actual MongoDB URI.

---

### 🔃 Run the Development Server

```bash
npm run dev
```

Open your browser and visit: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

All API routes are built using **Next.js App Router** under `/app/api`.

| Method | Endpoint                           | Description                 |
| ------ |------------------------------------|-----------------------------|
| GET    | `/api/transactions`                | Fetch all transactions      |
| POST   | `/api/transactions`                | Add a new transaction       |
| PUT    | `/api/transactions/:id`            | Update a transaction by ID  |
| DELETE | `/api/transactions/:id`            | Delete a transaction by ID  |
| GET    | `/api/budgets`                     | Fetch all budgets           |
| POST   | `/api/budgets`                     | Add a new budget            |
| PUT    | `/api/budgets/:id`                 | Update a budget by ID       |
| DELETE | `/api/budgets/:id`                 | Delete a budget by ID       |
| GET    | `/api/analytics/dashboard-summary` | monthly summary data        |
| GET    | `/api/analytics/monthly-expenses`  | monthly expense data        |
| GET    | `/api/analytics/budget-comparison` | budget vs actual comparison |
| GET    | `/api/analytics/category-breakdown` | category wise expenses      |



## Happy Coding ( waiting for your Response )