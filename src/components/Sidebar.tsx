import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout, useCurrentUser } from '../redux/features/auth/authSlice';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Grid3x3,
  CalendarDays,
  LogOut,
  ChefHat
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export function Sidebar({
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(useCurrentUser);

  const rolePath = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user';

  const navItems = [
    {
      id: 'dashboard',
      path: rolePath,
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'orders',
      path: '/dashboard/orders',
      label: user?.role === 'admin' ? 'Order Management' : 'My Orders',
      icon: ClipboardList
    },
    {
      id: 'menu',
      path: '/dashboard/menu',
      label: user?.role === 'admin' ? 'Menu Management' : 'Our Menu',
      icon: UtensilsCrossed
    },
    {
      id: 'tables',
      path: '/dashboard/tables',
      label: 'Tables',
      icon: Grid3x3,
      adminOnly: true
    },
    {
      id: 'reservations',
      path: '/dashboard/reservations',
      label: user?.role === 'admin' ? 'Reservations' : 'My Reservations',
      icon: CalendarDays
    }
  ];

  const filteredNavItems = navItems.filter(item => {
    if ('adminOnly' in item && item.adminOnly && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

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
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

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
              <p className="text-xs text-slate-400">{user?.role === 'admin' ? 'Admin Portal' : 'User Portal'}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}