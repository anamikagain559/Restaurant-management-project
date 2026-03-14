import logo from '../assets/logo.png';
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
  User,
  Home
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
      id: 'profile',
      path: '/dashboard/profile',
      label: 'My Profile',
      icon: User,
      userOnly: true
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
      label: 'Menu Management',
      icon: UtensilsCrossed,
      adminOnly: true
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
    if ('userOnly' in (item as any) && (item as any).userOnly && user?.role === 'admin') {
        return false;
    }
    return true;
  });


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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-900 transform transition-transform duration-200 ease-in-out border-r border-kona-teal/10 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-kona-teal/5">
            <div className="relative w-11 h-11 glass-card rounded-full p-1 border border-kona-teal/20 flex items-center justify-center">
              <img 
                src={logo} 
                alt="Sunflower Logo" 
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-kona-maroon tracking-tighter">SUNFLOWER</h1>
              <p className="text-[10px] text-kona-teal font-black uppercase tracking-widest">{user?.role === 'admin' ? 'Manager Portal' : 'Guest Portal'}</p>
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
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest
                    ${isActive ? 'bg-kona-teal text-white shadow-xl shadow-kona-teal/30 scale-[1.02]' : 'text-slate-400 hover:bg-kona-light hover:text-kona-teal'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Navigation Links */}
          <div className="p-4 border-t border-kona-teal/5 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-kona-teal hover:bg-kona-light rounded-xl transition-all font-black text-xs uppercase tracking-widest border border-transparent hover:border-kona-teal/10"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-kona-maroon rounded-xl transition-all font-black text-xs uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}