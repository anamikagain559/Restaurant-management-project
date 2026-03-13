import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, useCurrentUser } from '../../redux/features/auth/authSlice';
import { useGetAllMenuQuery } from '../../redux/features/menu/menuApi';
import { useCreateReservationMutation } from '../../redux/features/reservation/reservationApi';
import { useCreateOrderMutation } from '../../redux/features/order/orderApi';
import {
  UtensilsCrossed,
  ChefHat,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Star,
  Menu as MenuIcon,
  X,
  Calendar,
  Users,
  Leaf,
  Wine,
  LayoutDashboard,
  LogOut,
  ShoppingBasket,
  Plus,
  Minus,
  Trash2,
  User,
  Mail,
  ArrowLeft
} from
  'lucide-react';

import logo from '../../assets/logo.png';
import heroBg from '../../assets/hero-bg.png';
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

export function RestaurantFrontend() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuCategories: Category[] = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];
  const [activeCategory, setActiveCategory] = useState<typeof menuCategories[number]>('All');

  const [cart, setCart] = useState<{ item: MenuItem, quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'ADDRESS'>('CART');
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    deliveryAddress: ''
  });
  // Reservation Form State
  const [reservation, setReservation] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    requests: ''
  });

  useEffect(() => {
    if (user) {
      setAddressData(prev => ({ ...prev, name: user.email.split('@')[0] }));
    }
  }, [user]);

  // Scroll listener for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const { data: menuData, isLoading: isMenuLoading } = useGetAllMenuQuery(undefined);
  const [createReservation, { isLoading: isReserving }] = useCreateReservationMutation();
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  const menuItems: MenuItem[] = menuData?.data || [];

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
        tableNumber: Math.floor(Math.random() * 20) + 1, // Simulated table for public site
        totalAmount: cartTotal,
        customerName: addressData.name,
        phone: addressData.phone,
        address: addressData.deliveryAddress
      }).unwrap();

      Swal.fire({
        title: 'Order Placed!',
        text: 'Thank you for choosing Sunflower. Your delicious meal is on its way!',
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
        title: 'Order Information',
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

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to make a reservation.',
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

    try {
      await createReservation({
        ...reservation,
        email: user.email,
        guests: Number(reservation.guests)
      }).unwrap();
      Toast.fire({
        icon: 'success',
        title: 'Reservation submitted successfully!'
      });
      setReservation({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        requests: ''
      });
    } catch (err: any) {
      const getFriendlyMessage = (errorObj: any) => {
        const data = errorObj?.data;
        const formatError = (e: any) => {
          const field = e.path?.[e.path.length - 1] || '';
          if (field === 'phone') return 'Contact number must be 11 digits (e.g., 01XXXXXXXXX).';
          if (field === 'date') return 'Please select a valid date for your visit.';
          if (field === 'time') return 'Please select a preferred dining time.';
          return e.message?.replace(/Invalid string: must match pattern .*/, 'is not in the correct format.');
        };

        if (Array.isArray(data)) return data.map(formatError).join('\n');
        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed.map(formatError).join('\n');
          } catch { return data; }
        }
        return errorObj?.data?.message || errorObj?.message || 'Failed to submit reservation. Please try again.';
      };

      Swal.fire({
        title: 'Reservation Status',
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

  const filteredItems =
    activeCategory === 'All' ?
      menuItems :
      menuItems.filter((item) => item.category === activeCategory);

  const navItems = ['Home', 'About', 'Menu', 'Reservations', 'Contact'];

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
                    onClick={() => navigate('/menu')}
                    className="text-xs font-black uppercase tracking-[0.3em] text-white/90 hover:text-white transition-all hover:scale-110"
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
                item === 'Menu' ? (
                  <button
                    key={item}
                    onClick={() => navigate('/menu')}
                    className="text-left text-slate-600 font-medium py-2 hover:text-orange-500"
                  >
                    {item}
                  </button>
                ) : (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-left text-slate-600 font-medium py-2 hover:text-orange-500">
                    {item}
                  </button>
                )
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
                className="text-left text-slate-600 font-medium py-2 hover:text-orange-500 text-left">
                Login
              </button>
            )}

            <button
              onClick={() => {
                setIsCartOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <ShoppingBasket className="w-5 h-5 text-teal-600" />
                <span className="text-slate-700 font-bold text-sm">
                  Cart Total
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-black">
                  {cartTotal.toFixed(2)} <span className="text-[10px] text-slate-400">TK</span>
                </span>
                {cart.length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => scrollToSection('reservations')}
              className="bg-orange-500 text-white py-3 rounded-lg font-medium text-center">

              Reserve a Table
            </button>
          </div>
        }
      </nav>

      {/* Hero Section - AI Ultra Premium Redesign */}
      <section
        id="home"
        className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-slate-950">

        {/* Advanced AI Mesh Background */}
        <div className="absolute inset-0 bg-mesh opacity-40 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 z-0"></div>

        {/* Animated Particle Field (Visualized as Orbs) */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-[100px] animate-pulse z-0"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? 'rgba(180, 255, 255, 0.1)' : 'rgba(255, 180, 200, 0.1)',
              animationDuration: `${Math.random() * 4 + 3}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}

        {/* Floating AI Sunflower Centerpiece */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full flex items-center justify-center pointer-events-none z-0">
          <div className="relative w-full h-full animate-float">
            <img
              src={logo}
              alt="AI Sunflower Art"
              className="w-full h-full object-contain opacity-40 mix-blend-screen mask-gradient"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto pt-20">
          {/* Futuristic Label */}
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mb-12 animate-shimmer overflow-hidden">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-kona-teal animate-pulse"></span>
              Redefining Organic Luxury
            </span>
            <span className="w-px h-3 bg-white/20"></span>
            <span>Est. 2024</span>
          </div>

          {/* Main Heading - AI Typography */}
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black text-white mb-10 leading-[0.85] tracking-tighter text-glow">
            <span className="block italic font-light opacity-50 text-3xl sm:text-5xl tracking-[0.2em] mb-6 drop-shadow-lg">THE GOLDEN</span>
            <span className="relative">
              SUNFLOWER
              <span className="absolute -inset-2 bg-kona-teal/20 blur-[60px] -z-10 rounded-full"></span>
            </span>
          </h1>

          {/* Description - AI Premium Minimalist */}
          <p className="text-xl sm:text-2xl text-white/50 mb-16 max-w-2xl mx-auto leading-relaxed font-light tracking-wide drop-shadow-md">
            Where artificial intelligence meets natural perfection.
            Experience a sanctuary of <span className="text-white font-medium">hyper-organic dining</span> and sensory excellence.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24">
            <button
              onClick={() => navigate('/menu')}
              className="group relative px-14 py-6 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_70px_rgba(255,255,255,0.5)] active:scale-95">
              Discovery Menu
              <div className="absolute inset-0 rounded-full border border-white/50 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            </button>
            <button
              onClick={() => scrollToSection('reservations')}
              className="relative px-14 py-6 text-white border border-white/20 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-white/5 backdrop-blur-md overflow-hidden group">
              <span className="relative z-10">Private Reservation</span>
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000"></div>
            </button>
          </div>

          {/* Dynamic Scroll UI */}
          <div className="flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Infinite Journey</p>
            <div className="w-px h-24 bg-gradient-to-b from-white to-transparent"></div>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent z-20 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  15+
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Years of Excellence
                </div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  200+
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Signature Dishes
                </div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  50K+
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Happy Guests
                </div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white shadow-xl shadow-kona-teal/5 group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-kona-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6 text-kona-teal fill-kona-teal" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-kona-maroon mb-1">
                  4.9
                </div>
                <div className="text-xs text-kona-teal uppercase tracking-widest font-black">
                  Guest Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - AI Premium Glass Design */}
      <section id="about" className="relative py-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kona-teal/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-panel p-10 rounded-[3rem] shadow-glow-teal relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-kona-teal/30 to-transparent"></div>
                <div className="text-kona-teal font-black tracking-[0.4em] uppercase text-[10px] mb-6">
                  Biological Intelligence
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-kona-maroon mb-8 tracking-tighter uppercase leading-[0.9]">
                  Wholesome <br /> <span className="opacity-40">Innovation</span>
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed font-medium text-lg">
                  Founded with a passion for organic vibrancy, SUNFLOWER is a
                  sanctuary for sensory exploration. We believe that great dining
                  is an algorithm of <span className="text-kona-teal font-black">nature + technology</span>,
                  sourced directly from local ecosystem partners.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Leaf,
                      title: 'Eco-System',
                    },
                    {
                      icon: Star,
                      title: 'Pure-Grade',
                    },
                    {
                      icon: Wine,
                      title: 'Sensory-IQ',
                    }].
                    map((feature, idx) =>
                      <div
                        key={idx}
                        className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group/item hover:bg-white transition-all">
                        <feature.icon className="w-6 h-6 text-kona-teal mb-3 group-hover/item:scale-125 transition-transform" />
                        <h3 className="font-black text-kona-maroon uppercase text-[8px] tracking-[0.2em]">
                          {feature.title}
                        </h3>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-mesh opacity-20 blur-3xl -z-10"></div>
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-8 border-white group">
                <div 
                  className="w-full h-full bg-kona-light flex items-center justify-center bg-cover bg-center group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] hover:grayscale-0"
                  style={{ backgroundImage: `url('https://i.ibb.co.com/nq1CgR1W/restaurant-decoration.jpg')` }}
                ></div>
              </div>
              <div className="absolute -bottom-10 -right-10 glass-panel p-8 rounded-[2rem] shadow-2xl max-w-xs hidden xl:block animate-float">
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-14 h-14 bg-kona-maroon rounded-full flex items-center justify-center text-white shadow-xl">
                    <Star className="w-7 h-7 fill-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-kona-maroon">4.9/5</div>
                    <div className="text-[10px] text-kona-teal font-black uppercase tracking-widest">
                      AI Verified Excellence
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                  "A masterpiece of organic luxury."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section - AI Optimized Filter */}
      <section id="menu" className="py-32 bg-slate-50 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-kona-pink/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <div className="text-kona-teal font-black tracking-[0.4em] uppercase text-[10px] mb-4">
                Curated Selection
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-kona-maroon tracking-tighter uppercase leading-[0.85]">
                Discovery <br /> <span className="text-kona-teal">Prototypes</span>
              </h2>
            </div>
            <p className="text-slate-500 font-medium max-w-sm text-right hidden md:block">
              Each dish is a masterpiece of seasonal engineering and flavor optimization.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-4 mb-16">
            {([
              'All',
              'Appetizers',
              'Main Course',
              'Desserts',
              'Beverages'] as
              const).
              map((category) =>
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                  px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
                  ${activeCategory === category ? 'bg-kona-maroon text-white shadow-[0_0_30px_rgba(0,0,0,0.2)] scale-110' : 'bg-white text-slate-400 hover:text-kona-maroon border border-slate-100 hover:bg-slate-50'}
                `}>
                  {category}
                </button>
              )}
          </div>

          {/* Menu Grid */}
          {isMenuLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="glass-card group overflow-hidden rounded-[2.5rem] hover:bg-white transition-all duration-700 border border-slate-100 shadow-xl hover:shadow-2xl">

                  <div className="h-64 relative overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-mesh opacity-20 flex items-center justify-center">
                        <UtensilsCrossed className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    {!item.isAvailable &&
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
                        <span className="px-6 py-2 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                          Depleted
                        </span>
                      </div>
                    }
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black text-kona-maroon tracking-tighter uppercase">
                        {item.name}
                      </h3>
                      <span className="text-xl font-bold text-kona-teal">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed font-light line-clamp-2 italic">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                        {item.category}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        className="w-12 h-12 rounded-full bg-kona-teal flex items-center justify-center text-white hover:bg-kona-maroon transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-lg shadow-kona-teal/20">
                        <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md glass-panel shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-500 border-l border-white/10">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-950/50 backdrop-blur-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <ShoppingBasket className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase text-glow">
                    {checkoutStep === 'CART' ? 'System Order' : 'Protocol'}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {checkoutStep === 'CART' ? (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                          <ShoppingBasket className="w-10 h-10 text-white/20" />
                        </div>
                        <p className="text-white/40 font-medium">System empty</p>
                        <button onClick={() => setIsCartOpen(false)} className="mt-4 text-kona-teal font-black uppercase text-[10px] tracking-widest hover:underline">
                          Explore Prototypes
                        </button>
                      </div>
                    ) : (
                      cart.map((i) => (
                        <div key={i.item._id} className="flex gap-4 p-4 glass-card rounded-2xl border border-white/5">
                          <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                            <UtensilsCrossed className="w-8 h-8 text-white/20" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <h4 className="font-black text-white uppercase text-xs tracking-wider">{i.item.name}</h4>
                              <button onClick={() => removeFromCart(i.item._id)} className="text-white/20 hover:text-rose-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center gap-3 bg-white/5 rounded-full p-1 border border-white/10">
                                <button onClick={() => updateQuantity(i.item._id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-slate-900 transition-all active:scale-90">
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-black text-white w-4 text-center">{i.quantity}</span>
                                <button onClick={() => updateQuantity(i.item._id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-slate-900 transition-all active:scale-90">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-black text-kona-teal text-sm">${(i.item.price * i.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-8 glass-card border-t border-white/10 space-y-6">
                      <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                        <span>Total Assets</span>
                        <span className="text-white">${cartTotal.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={handleCheckoutClick}
                        className="w-full bg-white text-slate-950 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-glow"
                      >
                        Initialize Checkout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 overflow-y-auto p-8">
                  <button
                    onClick={() => setCheckoutStep('CART')}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black text-[10px] uppercase tracking-[0.3em] mb-10"
                  >
                    <ArrowLeft className="w-4 h-4" /> Return to Assets
                  </button>

                  <form onSubmit={handlePlaceOrder} className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Identity</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium"
                            value={addressData.name}
                            onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Communication</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium"
                            value={addressData.phone}
                            onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Coordinates</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-5 w-4 h-4 text-white/20" />
                          <textarea
                            required
                            placeholder="Delivery Address"
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all resize-none font-medium"
                            value={addressData.deliveryAddress}
                            onChange={(e) => setAddressData({ ...addressData, deliveryAddress: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Payable Assets</span>
                        <span className="text-3xl font-black text-white tracking-tighter">${cartTotal.toFixed(2)}</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isOrdering}
                        className="w-full bg-kona-teal text-white py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-glow-teal disabled:opacity-50"
                      >
                        {isOrdering ? 'Processing...' : 'Confirm Order'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cart.length > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-10 right-10 z-[60] bg-slate-950 text-white px-8 py-5 rounded-full shadow-glow flex items-center gap-5 hover:scale-105 transition-all group border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative flex items-center gap-5">
            <div className="relative">
              <ShoppingBasket className="w-6 h-6 group-hover:text-slate-950 transition-colors" />
              <span className="absolute -top-3 -right-3 bg-kona-teal text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-950 group-hover:border-white transition-all">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <span className="font-black text-xs uppercase tracking-widest group-hover:text-slate-950 transition-colors">
              Assets Protocol • ${cartTotal.toFixed(2)}
            </span>
          </div>
        </button>
      )}

      {/* Reservation Section - AI Optimization */}
      <section id="reservations" className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="glass-panel p-16 rounded-[4rem] border border-white/10 shadow-glow-teal flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <div className="text-kona-teal font-black tracking-[0.4em] uppercase text-[10px] mb-6">
                Reservation Systems
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]">
                Secure Your <br /> <span className="text-kona-teal">Experience</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed font-light mb-12 italic">
                Our reservation algorithm ensures optimal environment and service
                orchestration for your party. Select your coordinates below.
              </p>

              <form onSubmit={handleReservationSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    placeholder="Guest Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs placeholder:text-white/20"
                    value={reservation.name}
                    onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="tel"
                    required
                    placeholder="Communication Port"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs placeholder:text-white/20"
                    value={reservation.phone}
                    onChange={(e) => setReservation({ ...reservation, phone: e.target.value })}
                  />
                </div>
                <div className="relative md:col-span-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    required
                    placeholder="Digital Signaling (Email)"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs placeholder:text-white/20"
                    value={reservation.email}
                    onChange={(e) => setReservation({ ...reservation, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="date"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs [color-scheme:dark]"
                    value={reservation.date}
                    onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="time"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs [color-scheme:dark]"
                    value={reservation.time}
                    onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                  />
                </div>
                <div className="relative md:col-span-2">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs appearance-none"
                    value={reservation.guests}
                    onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                      <option key={n} value={n} className="bg-slate-900">{n} Participants</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isReserving}
                  className="md:col-span-2 w-full bg-white text-slate-950 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-[1.02] transition-all shadow-glow disabled:opacity-50"
                >
                  {isReserving ? 'Processing Sequence...' : 'Initialize Booking'}
                </button>
              </form>
            </div>

            <div className="w-full lg:w-1/3 aspect-square rounded-[3rem] overflow-hidden border-8 border-white/5 relative group">
              <img
                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Table"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - AI Information Feed */}
      <section id="contact" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-kona-teal/5 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="text-kona-teal font-black tracking-[0.4em] uppercase text-[10px] mb-6">
              Contact Nodes
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-kona-maroon mb-4 tracking-tighter uppercase leading-[0.85]">
              System <span className="opacity-40">Locations</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Coordinates',
                lines: ['123 Gourmet Avenue', 'Culinary District, NY 10012']
              },
              {
                icon: Clock,
                title: 'Operation Hours',
                lines: [
                  'Daily: 11:00 — 22:00',
                  'Weekend: 10:00 — 23:00']

              },
              {
                icon: Phone,
                title: 'Emergency Feed',
                lines: ['(555) 123-4567', 'hello@sunflower.com']
              }].
              map((item, idx) =>
                <div
                  key={idx}
                  className="glass-panel p-10 rounded-[3rem] text-center hover:bg-slate-50 transition-all border border-slate-100 group shadow-lg hover:shadow-2xl">

                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:rotate-12 transition-transform">
                    <item.icon className="w-8 h-8 text-kona-teal" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-kona-maroon mb-6">
                    {item.title}
                  </h3>
                  {item.lines.map((line, i) =>
                    <p key={i} className="text-slate-500 font-medium tracking-wide">
                      {line}
                    </p>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Footer - AI Core Design */}
      <footer className="relative bg-slate-950 text-white overflow-hidden pt-32 pb-12">
        {/* Abstract Background Highlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-kona-teal/5 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-16 h-16 animate-float">
                  <img
                    src={logo}
                    alt="Sunflower Logo"
                    className="w-full h-full object-cover rounded-full border border-white/20 shadow-glow"
                  />
                </div>
                <span className="text-4xl font-black tracking-tighter uppercase text-glow">
                  SUNFLOWER
                </span>
              </div>
              <p className="text-white/40 text-lg max-w-md leading-relaxed font-light mb-10">
                A sanctuary where <span className="text-white">biological perfection</span> meets
                advanced culinary engineering. Redefining the future of wholesome dining.
              </p>

              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/5 group">
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Navigate</h4>
                <ul className="space-y-4">
                  {['Home', 'Menu', 'About', 'Reservation'].map(item => (
                    <li key={item}>
                      <a href="#" className="text-xs font-black uppercase tracking-[0.1em] text-white/60 hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Hours</h4>
                <div className="space-y-4 text-[10px] font-black uppercase tracking-[0.1em] text-white/60">
                  <p>Daily <span className="text-white ml-2 italic tracking-widest">11:00 — 22:00</span></p>
                  <p>Weekend <span className="text-white ml-2 italic tracking-widest">10:00 — 23:00</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-30 hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} SUNFLOWER — ARCHITECTED BY AI
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.4em]">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}