import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCurrentUser } from './redux/features/auth/authSlice';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { OrdersView } from './components/OrdersView';
import { MenuView } from './components/MenuView';
import { TablesView } from './components/TablesView';
import { ReservationsView } from './components/ReservationsView';
import { RestaurantFrontend } from './components/frontend/RestaurantFrontend';
import { Menu, Bell, Search, Globe, LayoutDashboard } from 'lucide-react';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { UserDashboard } from './components/UserDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const user = useSelector(useCurrentUser);
  console.log('ProtectedRoute check:', { user, requiredRole: role });

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    console.log(`ProtectedRoute: Role mismatch (got ${user.role}, expected ${role}), redirecting to home`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

type View = 'dashboard' | 'orders' | 'menu' | 'tables' | 'reservations';

function AdminDashboard() {
  const user = useSelector(useCurrentUser);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mode, setMode] = useState<'admin' | 'frontend'>('admin');

  if (!user || user.role?.toLowerCase() !== 'admin') {
    console.log('AdminDashboard: Access denied. User:', user);
    return <Navigate to="/login" replace />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrdersView />;
      case 'menu':
        return <MenuView />;
      case 'tables':
        return <TablesView />;
      case 'reservations':
        return <ReservationsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* Mode Toggle Button (Admin only) */}
      <button
        onClick={() => setMode(mode === 'admin' ? 'frontend' : 'admin')}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 hover:scale-105 transition-all duration-300 font-medium border border-slate-700">

        {mode === 'admin' ?
          <>
            <Globe className="w-5 h-5 text-orange-500" />
            <span>View Website</span>
          </> :

          <>
            <LayoutDashboard className="w-5 h-5 text-orange-500" />
            <span>Admin Panel</span>
          </>
        }
      </button>

      {mode === 'frontend' ?
        <RestaurantFrontend /> :

        <div className="flex h-screen bg-slate-50 overflow-hidden">
          <Sidebar
            activeView={activeView}
            onNavigate={setActiveView}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen} />


          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden">

                  <Menu className="w-6 h-6" />
                </button>
                <div className="relative hidden sm:block">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none w-64" />

                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-700">
                      {user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-slate-500 uppercase">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm">
                    {user.email[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">{renderView()}</div>
            </main>
          </div>
        </div>
      }
    </>);
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<RestaurantFrontend />} />
    </Routes>
  );
}