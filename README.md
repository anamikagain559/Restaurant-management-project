# 🍽️ Savory Management System

A premium, full-stack restaurant management dashboard designed for seamless kitchen operations, guest reservations, and table management. Built with a modern tech stack focused on performance, aesthetics, and real-time data integration.

---

## 🔗 Live Deployments

- **Frontend Application**: [https://restaurant-management-frontend-two.vercel.app/](https://restaurant-management-frontend-two.vercel.app/)
- **Backend API**: [https://restaurant-management-backend-three.vercel.app](https://restaurant-management-backend-three.vercel.app)

---

## ✨ Core Features

### 👑 Admin Dashboard (Management Suite)
- **Real-time Analytics**: Live tracking of Today's Revenue, Active Orders, Occupied Tables, and Daily Reservations.
- **Kitchen Display System**: A command center for managing incoming orders with one-click status transitions (New → Preparing → Ready → Served → Completed).
- **Reservation Control**: Manage guest bookings, confirm pending requests, and track party sizes.
- **Table Seating management**: Visual grid for managing restaurant tables, capacity settings, and real-time availability toggles.

### 👤 User Dashboard (Guest Experience)
- **Order Tracking**: Live status updates on personal orders.
- **My Reservations**: View and manage upcoming dining bookings.
- **Profile Management**: Personalized settings and activity history.

### 🍱 General Features
- **Modern UI/UX**: Premium design with glassmorphism, dynamic animations, and responsive layouts.
- **SweetAlert2 Integration**: Polished user feedback via interactive modals and toast notifications.
- **Secure Authentication**: Role-based access control for Admins and Users.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **State Management**: Redux Toolkit & RTK Query
- **User Feedback**: SweetAlert2
- **Backend API**: Node.js / Express (deployed on Vercel)
- **Type Safety**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-link]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://restaurant-management-backend-three.vercel.app/api/v1
   ```

4. Start Development Server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components
├── pages/          # Full page views (Dashboard, Orders, Tables, etc.)
├── redux/          # State management and API slices
│   ├── api/        # Base API configuration
│   └── features/   # Feature-specific slices (Auth, Orders, Tables, etc.)
├── assets/         # Images and global styles
└── App.tsx         # Main application routing
```

---

## 👨‍💻 Development

Developed with a focus on **Premium Design Aesthetics** and **Agentic Coding Practices**. Every interaction is designed to feel high-end and production-ready.

---

> [!TIP]
> This project follows the best practices for modern web development, prioritizing visual excellence and user engagement.
