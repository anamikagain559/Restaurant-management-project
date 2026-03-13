import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { 
  UtensilsCrossed, 
  ShoppingBasket, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Search,
  Filter,
  Menu as MenuIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  ArrowLeft,
  User
} from 'lucide-react';

import logo from '../../assets/logo.png';
import heroBg from '../../assets/hero-bg.png';

import { useCurrentUser, logout } from '../../redux/features/auth/authSlice';
import { useGetAllMenuQuery } from '../../redux/features/menu/menuApi';
import { useCreateOrderMutation } from '../../redux/features/order/orderApi';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

type Category = 'All' | 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  isAvailable: boolean;
}

export function Menu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ item: MenuItem, quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'ADDRESS'>('CART');
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    deliveryAddress: ''
  });

  const { data: menuData, isLoading: isMenuLoading } = useGetAllMenuQuery(undefined);
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  const menuItems: MenuItem[] = menuData?.data || [];
  const navItems = ['Home', 'About', 'Menu', 'Reservations', 'Contact'];

  useEffect(() => {
    if (user) {
      setAddressData(prev => ({ ...prev, name: user.email.split('@')[0] }));
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (id === 'menu') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item._id === item._id);
      if (existing) {
        return prev.map(i => i.item._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
    setCheckoutStep('CART');
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.item._id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item._id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);

  const handleCheckoutClick = () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to proceed to checkout.',
        icon: 'info',
        confirmButtonColor: '#f97316',
        showCancelButton: true,
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        }
      });
      return;
    }
    setCheckoutStep('ADDRESS');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!addressData.phone || !addressData.deliveryAddress) {
      Toast.fire({
        icon: 'warning',
        title: 'Please provide all delivery details'
      });
      return;
    }

    try {
      await createOrder({
        email: user?.email,
        items: cart.map(i => ({
          menuItem: i.item._id,
          quantity: i.quantity,
          price: i.item.price
        })),
        tableNumber: Math.floor(Math.random() * 20) + 1,
        totalAmount: cartTotal,
        customerName: addressData.name,
        phone: addressData.phone,
        address: addressData.deliveryAddress
      }).unwrap();

      Swal.fire({
        title: 'Order Placed!',
        text: 'Your culinary journey has begun. We are preparing your order!',
        icon: 'success',
        confirmButtonColor: '#f97316'
      });
      setCart([]);
      setIsCartOpen(false);
      setCheckoutStep('CART');
      setAddressData(prev => ({ ...prev, phone: '', deliveryAddress: '' }));
    } catch (err: any) {
      const getFriendlyMessage = (errorObj: any) => {
        const data = errorObj?.data;
        const formatError = (e: any) => {
          const field = e.path?.[e.path.length - 1] || '';
          if (field === 'phone') return 'Mobile number must be 11 digits (e.g., 01XXXXXXXXX).';
          if (field === 'address' || field === 'deliveryAddress') return 'Please provide a valid delivery address.';
          return e.message?.replace(/Invalid string: must match pattern .*/, 'is not in the correct format.');
        };

        if (Array.isArray(data)) return data.map(formatError).join('\n');
        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed.map(formatError).join('\n');
          } catch { return data; }
        }
        return errorObj?.data?.message || errorObj?.message || 'Failed to place order. Please try again.';
      };

      Swal.fire({
        title: 'Order Details',
        text: getFriendlyMessage(err),
        icon: 'info',
        confirmButtonColor: '#f97316',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl px-8 py-3 font-bold'
        }
      });
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-panel py-3 m-4 rounded-3xl' : 'bg-transparent py-6'}`}>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center text-glow">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative w-14 h-14 animate-float">
              <img 
                src={logo} 
                alt="Sunflower Logo" 
                className="w-full h-full object-cover rounded-full border-2 border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:rotate-12 transition-transform duration-700"
              />
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
            </div>
            <span
              className="text-3xl font-black tracking-tighter text-white drop-shadow-lg">
              SUNFLOWER
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map(
              (item) =>
                item === 'Menu' ? (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-xs font-black uppercase tracking-[0.3em] text-white border-b-2 border-white pb-1"
                  >
                    {item}
                  </button>
                ) : (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-xs font-black uppercase tracking-[0.3em] text-white/90 hover:text-white transition-all hover:scale-110">
                    {item}
                  </button>
                )
            )}

            {user ? (
              <div className="flex items-center gap-4 border-l border-white/20 pl-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all">
                  <LayoutDashboard className="w-4 h-4" />
                  Portal
                </button>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white hover:bg-white hover:text-kona-maroon transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-black uppercase tracking-[0.3em] text-white/90 hover:text-white transition-all">
                Login
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="glass-card px-5 py-2.5 rounded-full flex items-center gap-4 hover:bg-white/30 transition-all relative group"
            >
                <div className="relative">
                  <ShoppingBasket className="w-5 h-5 text-white" />
                  {cart.length > 0 && (
                    <span className="absolute -top-3 -right-3 bg-white text-kona-maroon text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-kona-teal shadow-xl">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </div>
              <span className="text-white font-black text-xs tracking-wider">
                {cartTotal.toFixed(2)} <span className="opacity-60">TK</span>
              </span>
            </button>

            <button
              onClick={() => scrollToSection('reservations')}
              className="bg-white text-kona-maroon hover:bg-kona-pink hover:text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95">
              Secure Table
            </button>
          </div>

          {/* Mobile Menu Button - Styled for AI */}
          <button
            className="md:hidden w-12 h-12 glass-card flex items-center justify-center text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>

            {isMobileMenuOpen ?
              <X className="w-6 h-6" /> :

              <MenuIcon className="w-6 h-6" />
            }
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen &&
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-100 p-4 flex flex-col gap-4">
            {navItems.map(
              (item) =>
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-left font-medium py-2 hover:text-orange-500 ${item === 'Menu' ? 'text-orange-500 font-bold' : 'text-slate-600'}`}>
                  {item}
                </button>
            )}

            {user ? (
              <>
                <button
                  onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                  className="text-left text-slate-600 font-medium py-2 hover:text-orange-500 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-slate-600 font-medium py-2 hover:text-orange-500 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-left text-slate-600 font-medium py-2 hover:text-orange-500">
                Login
              </button>
            )}

            <button
              onClick={() => scrollToSection('reservations')}
              className="bg-orange-500 text-white py-3 rounded-lg font-medium text-center">
              Reserve a Table
            </button>
          </div>
        }
      </nav>

      {/* Hero Section - AI Premium */}
      <section className="relative pt-64 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-mesh opacity-30 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mb-12 animate-shimmer overflow-hidden">
             <span className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-kona-teal animate-pulse"></span>
               Biological Selection
             </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85] text-glow">
            Discovery <br/> <span className="text-kona-teal italic font-light drop-shadow-lg">Prototypes</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/40 text-lg font-light leading-relaxed italic">
            Each entry represents a unique iteration of seasonal perfection, 
            optimized for biological satisfaction and sensory excellence.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent z-10" />
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-32">
        {/* Search and Filters */}
        <div className="glass-panel p-6 rounded-[3rem] shadow-glow-teal border border-white/10 flex flex-col lg:flex-row items-center gap-8 mb-20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-kona-teal/30 to-transparent"></div>
          
          <div className="flex-1 w-full lg:w-auto relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-kona-teal transition-colors" />
            <input 
              type="text" 
              placeholder="Search Biological Selection..."
              className="w-full pl-14 pr-6 py-5 bg-white/5 rounded-2xl border border-white/5 focus:border-kona-teal/50 focus:ring-4 focus:ring-kona-teal/5 outline-none transition-all font-medium text-white placeholder:text-white/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-4 p-1">
              {(['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-500
                    ${activeCategory === category 
                      ? 'bg-white text-slate-950 shadow-glow scale-105' 
                      : 'text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        {isMenuLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <div className="w-20 h-20 relative">
                <div className="absolute inset-0 border-4 border-kona-teal/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-kona-teal rounded-full border-t-transparent animate-spin" />
             </div>
             <p className="mt-8 text-kona-maroon font-black tracking-widest uppercase text-[10px] animate-pulse">Setting the table...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredItems.map((item, idx) => (
              <div 
                key={item._id}
                className="glass-card group overflow-hidden rounded-[3rem] hover:bg-white/5 transition-all duration-700 border border-white/10 hover:border-white/30 shadow-2xl relative"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="h-64 relative overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-1000"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-mesh opacity-20">
                       <UtensilsCrossed className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  
                  <div className="absolute top-6 left-6">
                    <span className="px-5 py-2 bg-slate-950/80 backdrop-blur-md text-white/60 text-[8px] font-black tracking-[0.32em] uppercase rounded-full shadow-2xl border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-10">
                      <span className="px-8 py-3 bg-white text-slate-950 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-glow">Depleted</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-black text-white group-hover:text-kona-teal transition-colors line-clamp-1 pr-2 uppercase tracking-tighter text-glow">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-white/30 line-clamp-2 leading-relaxed mb-10 h-10 font-light italic">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <span className="text-xl font-black text-white/80">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:bg-white hover:text-slate-950 hover:scale-110 active:scale-95 transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                      <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Filter className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">No delicacies found</h3>
             <p className="text-slate-400 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </main>

      {/* Cart Drawer - AI Style */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md glass-panel shadow-glow-teal flex flex-col animate-in slide-in-from-right duration-500 m-4 rounded-[3rem] border border-white/10">
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass-card flex items-center justify-center rounded-2xl shadow-glow">
                    <ShoppingBasket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase text-glow">
                      {checkoutStep === 'CART' ? 'Selection' : 'Coordinates'}
                    </h2>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
                      {checkoutStep === 'CART' ? `${cart.length} Iterations` : 'Final Protocol'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {checkoutStep === 'CART' ? (
                <>
                  <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 glass-card rounded-full flex items-center justify-center mb-8 opacity-20">
                          <ShoppingBasket className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-white/20 font-black tracking-[0.4em] uppercase text-[10px]">Registry Empty</p>
                        <button 
                          onClick={() => setIsCartOpen(false)}
                          className="mt-8 text-kona-teal font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:gap-5 transition-all"
                        >
                          Initialize Search <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      cart.map((i) => (
                        <div key={i.item._id} className="flex gap-8 group">
                          <div className="w-24 h-24 glass-card rounded-3xl overflow-hidden flex-shrink-0 border border-white/10">
                            {i.item.image ? (
                               <img src={i.item.image} alt="" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-mesh opacity-10">
                                 <UtensilsCrossed className="w-8 h-8 text-white/20" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 py-1">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-black text-white text-lg leading-tight line-clamp-1 uppercase tracking-tighter">{i.item.name}</h4>
                              <button onClick={() => removeFromCart(i.item._id)} className="text-white/10 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                              <div className="flex items-center gap-5 glass-card rounded-2xl p-1.5 border border-white/10">
                                <button 
                                  onClick={() => updateQuantity(i.item._id, -1)}
                                  className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-xl text-white/40 hover:text-white active:scale-90 transition-all"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-[10px] font-black w-4 text-center text-white">{i.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(i.item._id, 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-xl text-white/40 hover:text-white active:scale-90 transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-black text-white/80 text-sm italic">${(i.item.price * i.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-10 bg-white/5 backdrop-blur-3xl border-t border-white/10 rounded-b-[3rem] space-y-8">
                      <div className="space-y-4">
                        <div className="flex justify-between text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">
                          <span>Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-white font-black text-3xl tracking-tighter">
                          <span>TOTAL</span>
                          <span className="text-glow">${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleCheckoutClick}
                        className="w-full relative group overflow-hidden bg-white text-slate-950 py-6 rounded-2xl font-black tracking-[0.4em] uppercase text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-glow"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-4">
                          Initiate Protocol
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                  <button 
                    onClick={() => setCheckoutStep('CART')}
                    className="flex items-center gap-3 text-white/30 hover:text-kona-teal transition-colors font-black text-[9px] uppercase tracking-[0.3em] mb-12"
                  >
                    <ArrowLeft className="w-4 h-4" /> Return to Selection
                  </button>

                  <form onSubmit={handlePlaceOrder} className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Authorized Name</label>
                       <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input 
                            type="text" 
                            required
                            placeholder="Identify guest"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 focus:ring-2 focus:ring-kona-teal outline-none font-medium text-white placeholder:text-white/10 text-sm transition-all"
                            value={addressData.name}
                            onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Communication Link</label>
                       <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input 
                            type="tel" 
                            required
                            placeholder="Mobile frequency"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 focus:ring-2 focus:ring-kona-teal outline-none font-medium text-white placeholder:text-white/10 text-sm transition-all"
                            value={addressData.phone}
                            onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Target Coordinates</label>
                       <div className="relative">
                          <MapPin className="absolute left-5 top-6 w-4 h-4 text-white/20" />
                          <textarea 
                            required
                            placeholder="Delivery sector"
                            rows={4}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 focus:ring-2 focus:ring-kona-teal outline-none font-medium text-white placeholder:text-white/10 text-sm transition-all resize-none"
                            value={addressData.deliveryAddress}
                            onChange={(e) => setAddressData({...addressData, deliveryAddress: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="pt-10 border-t border-white/5">
                       <div className="flex justify-between items-center mb-8">
                          <span className="text-white/20 font-black uppercase text-[9px] tracking-[0.4em]">Final Energy Value</span>
                          <span className="text-3xl font-black text-white text-glow">${cartTotal.toFixed(2)}</span>
                       </div>
                       <button
                        type="submit"
                        disabled={isOrdering}
                        className="w-full bg-white text-slate-950 py-6 rounded-2xl font-black tracking-[0.4em] uppercase text-[10px] transition-all hover:scale-[1.02] shadow-glow disabled:opacity-50"
                      >
                        {isOrdering ? 'Orchestrating...' : 'Authorize Delivery'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer - AI Premium */}
      <footer className="bg-slate-950 text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 glass-card rounded-full p-1 border border-white/20">
                  <img src="https://images.unsplash.com/photo-1597843798133-e157ad0563f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-4xl font-black tracking-tighter text-glow">SUNFLOWER</h3>
              </div>
              <p className="text-white/30 text-lg font-light leading-relaxed max-w-md italic mb-12">
                Merging biological aesthetics with technological precision. 
                Experience the next iteration of culinary excellence.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all hover:scale-110">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-10">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-kona-teal mb-8">Navigation</h4>
                <ul className="space-y-4">
                  {navItems.map(item => (
                    <li key={item}>
                      <button onClick={() => scrollToSection(item.toLowerCase())} className="text-white/40 hover:text-white text-xs font-medium transition-all hover:translate-x-2 flex items-center gap-2 group">
                        <span className="w-0 h-px bg-kona-teal group-hover:w-4 transition-all"></span>
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-kona-teal mb-8">Connect</h4>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 group">
                    <MapPin className="w-5 h-5 text-white/20 group-hover:text-kona-teal transition-colors" />
                    <span className="text-xs text-white/40 leading-relaxed font-light">Biological District 01,<br/>Global Synthesis Park</span>
                  </li>
                  <li className="flex items-center gap-4 group">
                    <Phone className="w-5 h-5 text-white/20 group-hover:text-kona-teal transition-colors" />
                    <span className="text-xs text-white/40 font-light">+1 (555) AI-EXPERIENCE</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
              &copy; {new Date().getFullYear()} SUNFLOWER SYNDICATE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
