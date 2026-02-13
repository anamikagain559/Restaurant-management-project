import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/features/auth/authSlice';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Grid3x3,
  CalendarDays,
  LogOut,
  ChefHat
} from
  'lucide-react';
type View = 'dashboard' | 'orders' | 'menu' | 'tables' | 'reservations';
interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}
export function Sidebar({
  activeView,
  onNavigate,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ClipboardList
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: UtensilsCrossed
    },
    {
      id: 'tables',
      label: 'Tables',
      icon: Grid3x3
    },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: CalendarDays
    }] as
    const;
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0
  `;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen &&
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)} />

      }

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="p-2 bg-orange-500 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">RestoManager</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}>

                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>);

            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>);

}