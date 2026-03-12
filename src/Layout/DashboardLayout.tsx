import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, Search, Bell } from 'lucide-react';
import { useCurrentUser } from '../redux/features/auth/authSlice';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout = () => {
  const user = useSelector(useCurrentUser);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen} 
      />
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
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
