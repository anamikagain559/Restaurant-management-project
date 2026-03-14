import React from 'react';
import { Menu as MenuIcon, X, LayoutDashboard, LogOut, User, ShoppingBasket } from 'lucide-react';
import logo from '../../assets/logo.png';

interface NavbarProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  user: any;
  handleLogout: () => void;
  navigate: (path: string) => void;
  scrollToSection: (id: string) => void;
  navItems: string[];
  isCartOpen?: boolean;
  setIsCartOpen?: (open: boolean) => void;
  cartCount?: number;
}

export const FrontendNavbar: React.FC<NavbarProps> = ({
  isScrolled,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  handleLogout,
  navigate,
  scrollToSection,
  navItems,
  setIsCartOpen,
  cartCount = 0
}) => {
  const handleNavClick = (item: string) => {
    setIsMobileMenuOpen(false);
    if (item === 'Home') navigate('/');
    else if (item === 'Menu') navigate('/menu');
    else if (item === 'Events') navigate('/events');
    else if (item === 'Contact') navigate('/contact');
    else {
      // If we are not on the home page, go home first
      if (window.location.pathname !== '/') {
        navigate('/?scroll=' + item.toLowerCase());
      } else {
        scrollToSection(item.toLowerCase());
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${
      isScrolled ? 'bg-slate-950/80 backdrop-blur-2xl py-4 shadow-2xl' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer -ml-5" onClick={() => navigate('/')}>
          <div className="w-12 h-12 glass-card rounded-full p-1 border border-white/20 group-hover:border-kona-teal/50 transition-all">
            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white text-glow uppercase">SUNFLOWER</span>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-[35px]">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all hover:scale-110 relative group px-2"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-kona-teal transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions - Right */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-3 bg-white/5 hover:bg-white text-white hover:text-slate-950 px-6 py-2.5 rounded-full border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <LayoutDashboard className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-500 rounded-full border border-white/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="group flex items-center gap-4 bg-white text-slate-950 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-glow"
            >
              Authenticate
              <User className="w-4 h-4" />
            </button>
          )}

          {setIsCartOpen && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="glass-card px-5 py-2.5 rounded-full flex items-center gap-3 hover:bg-white/10 transition-all relative group"
            >
              <div className="relative">
                <ShoppingBasket className="w-4 h-4 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-kona-teal text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-white font-black text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100">Cart</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-4">
          {setIsCartOpen && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-12 h-12 glass-card flex items-center justify-center text-white relative"
            >
              <ShoppingBasket className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-kona-teal text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-12 h-12 text-white glass-card flex items-center justify-center border border-white/10"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[88px] bg-slate-950/95 backdrop-blur-3xl z-[65] animate-in fade-in slide-in-from-top duration-500">
          <div className="px-6 py-12 flex flex-col items-center gap-8">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-2xl font-black text-white/40 hover:text-white uppercase tracking-tighter"
              >
                {item}
              </button>
            ))}
            <div className="w-full h-px bg-white/10 my-4"></div>
            {user ? (
               <>
                 <button onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }} className="text-white font-black uppercase tracking-widest flex items-center gap-3">
                   <LayoutDashboard className="w-5 h-5 text-kona-teal" /> Dashboard
                 </button>
                 <button onClick={handleLogout} className="text-rose-500 font-black uppercase tracking-widest flex items-center gap-3">
                   <LogOut className="w-5 h-5" /> Terminate Session
                 </button>
               </>
            ) : (
               <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="bg-white text-slate-950 px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] text-xs">
                 Authenticate
               </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
