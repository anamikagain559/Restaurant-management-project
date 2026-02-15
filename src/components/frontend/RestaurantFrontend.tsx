import React, { useEffect, useState, memo } from 'react';
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
import ThreeScene from "../ThreeScene/ThreeScene";
import AnimatedBackground from "../AnimatedBackground";

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
  LogOut,
  ShoppingBag,
  Plus,
  Minus,
  Trash2
} from
  'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<{ item: MenuItem, quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to place an order.',
        icon: 'info',
        confirmButtonColor: '#f97316',
        showCancelButton: true,
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      await createOrder({
        email: user.email,
        items: cart.map(i => ({
          menuItem: i.item._id,
          quantity: i.quantity,
          price: i.item.price
        })),
        tableNumber: Math.floor(Math.random() * 20) + 1, // Simulated table for public site
        totalAmount: cartTotal
      }).unwrap();

      Toast.fire({
        icon: 'success',
        title: 'Order placed successfully!'
      });
      setCart([]);
      setIsCartOpen(false);
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Failed to place order.',
        icon: 'error',
        confirmButtonColor: '#f97316'
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
          navigate('/login');
        }
      });
      return;
    }

    try {
      await createReservation({
        ...reservation,
        email: user.email
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
      Swal.fire({
        title: 'Error!',
        text: err?.data?.message || 'Failed to submit reservation.',
        icon: 'error',
        confirmButtonColor: '#f97316'
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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-2xl font-bold ${isScrolled ? 'text-slate-900' : 'text-white'}`}>

              La Maison
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(
              (item) =>
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium hover:text-orange-500 transition-colors ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}>

                  {item}
                </button>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 text-sm font-medium hover:text-orange-500 transition-colors ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}>
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={`text-sm font-medium hover:text-orange-500 transition-colors ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}>
                Login
              </button>
            )}

            <button
              onClick={() => scrollToSection('reservations')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-orange-500/20">

              Reserve a Table
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-orange-500"
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
                  className="text-left text-slate-600 font-medium py-2 hover:text-orange-500">
                  {item}
                </button>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="text-left text-slate-600 font-medium py-2 hover:text-orange-500 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-left text-slate-600 font-medium py-2 hover:text-orange-500 text-left">
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

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        <ThreeScene />
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30 z-0"></div>

        {/* Decorative Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse z-0"></div>
        <div
          className="absolute bottom-40 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse z-0"
          style={{
            animationDelay: '1s'
          }}>
        </div>
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl animate-pulse z-0"
          style={{
            animationDelay: '2s'
          }}>
        </div>

        {/* Decorative Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5 z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}>
        </div>

        {/* Decorative Lines */}
        <div className="absolute top-0 left-1/4 w-px h-40 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent z-10"></div>
        <div className="absolute top-20 right-1/3 w-px h-32 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent z-10"></div>
        <div className="absolute bottom-40 left-1/3 w-24 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent z-10"></div>

        {/* Main Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-500"></div>
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-500"></div>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 text-sm font-medium mb-8 border border-orange-500/30 backdrop-blur-sm shadow-lg shadow-orange-500/10">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-orange-400" />
              <Star className="w-4 h-4 fill-orange-400" />
              <Star className="w-4 h-4 fill-orange-400" />
            </div>
            <span className="w-px h-4 bg-orange-500/30"></span>
            <span className="tracking-wider uppercase text-xs font-bold">
              Michelin Star Experience
            </span>
          </div>

          {/* Main Heading with Glow Effect */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
            <span className="block text-slate-300 text-2xl sm:text-3xl md:text-4xl font-light tracking-widest uppercase mb-4">
              Welcome to
            </span>
            <span className="relative inline-block">
              <span className="relative z-10">La Maison</span>
              <span className="absolute inset-0 blur-2xl bg-orange-500/30 z-0"></span>
            </span>
          </h1>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-slate-500"></div>
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-slate-500"></div>
          </div>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-orange-400 font-light italic mb-4">
            "Where Culinary Art Meets Elegance"
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Embark on an extraordinary gastronomic journey where every dish is a
            masterpiece, crafted with passion and served with perfection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => scrollToSection('menu')}
              className="group relative px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-orange-500/30 overflow-hidden">

              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Menu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onClick={() => scrollToSection('reservations')}
              className="group px-10 py-4 bg-transparent border-2 border-white/30 text-white hover:border-orange-500 hover:text-orange-400 rounded-full font-bold text-lg transition-all backdrop-blur-sm">

              <span className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Reserve Your Table
              </span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-slate-500 uppercase tracking-widest">
              Scroll to Discover
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
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
              <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  4.9
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Guest Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-2">
                Our Story
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Culinary Excellence Since 2009
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Founded with a passion for authentic flavors and locally sourced
                ingredients, La Maison has established itself as a cornerstone
                of the culinary district. We believe that great food starts with
                the finest ingredients, which is why we partner directly with
                local farmers and artisans.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Our executive chef brings over 20 years of international
                experience to your table, crafting dishes that are both
                innovative and deeply rooted in tradition. Every plate that
                leaves our kitchen is a testament to our commitment to
                excellence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: Leaf,
                    title: 'Farm to Table',
                    desc: 'Fresh local ingredients'
                  },
                  {
                    icon: ChefHat,
                    title: 'Expert Chefs',
                    desc: 'Masterful preparation'
                  },
                  {
                    icon: Wine,
                    title: 'Fine Wines',
                    desc: 'Curated selection'
                  }].
                  map((feature, idx) =>
                    <div
                      key={idx}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-100">

                      <feature.icon className="w-8 h-8 text-orange-500 mb-3" />
                      <h3 className="font-bold text-slate-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-slate-500">{feature.desc}</p>
                    </div>
                  )}
              </div>
            </div>
            <div className="relative">
              <AnimatedBackground />
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-slate-200 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"></div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Voted #1</div>
                    <div className="text-sm text-slate-500">
                      Best Fine Dining 2023
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "An absolute masterpiece of culinary art. The best dining
                  experience in the city."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Menu</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Crafted with passion, served with love. Explore our seasonal
              selection of exquisite dishes.
            </p>
          </div>

          {/* Categories */}
          <div className="flex justify-center gap-2 md:gap-4 mb-12 flex-wrap">
            {(
              [
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
                  px-6 py-2 rounded-full text-sm font-medium transition-all
                  ${activeCategory === category ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100">

                  <div className="h-48 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                        }}
                      />
                    ) : (
                      <UtensilsCrossed className="w-12 h-12 text-orange-200 group-hover:scale-110 transition-transform duration-500" />
                    )}
                    {!item.isAvailable &&
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-4 py-1 bg-white text-slate-900 text-sm font-bold rounded-full transform -rotate-3 shadow-lg">
                          Sold Out
                        </span>
                      </div>
                    }
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-orange-500">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add
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
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-bold text-slate-800">Your Order</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">Your cart is empty</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-orange-500 font-bold hover:underline">
                      Explore our menu
                    </button>
                  </div>
                ) : (
                  cart.map((i) => (
                    <div key={i.item._id} className="flex gap-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center">
                        <UtensilsCrossed className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-bold text-slate-800">{i.item.name}</h4>
                          <button onClick={() => removeFromCart(i.item._id)} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                            <button onClick={() => updateQuantity(i.item._id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-orange-500">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{i.quantity}</span>
                            <button onClick={() => updateQuantity(i.item._id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-orange-500">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-orange-500">${(i.item.price * i.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isOrdering}
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isOrdering ? 'Placing Order...' : 'Confirm Order'}
                  </button>
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
          className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-all group overflow-hidden"
        >
          <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 group-hover:bg-slate-900 transition-colors">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <span className="font-bold text-sm">View Order • ${cartTotal.toFixed(2)}</span>
          </div>
        </button>
      )}

      {/* Reservation Section */}
      <section id="reservations" className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16">
                <div className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-2">
                  Reservations
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Book Your Table
                </h2>
                <p className="text-slate-600 mb-8">
                  Join us for an unforgettable dining experience. For parties
                  larger than 12, please contact us directly.
                </p>

                <form
                  className="space-y-6"
                  onSubmit={handleReservationSubmit}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        placeholder="John Doe"
                        value={reservation.name}
                        onChange={(e) =>
                          setReservation({
                            ...reservation,
                            name: e.target.value
                          })
                        } />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        placeholder="(555) 123-4567"
                        value={reservation.phone}
                        onChange={(e) =>
                          setReservation({
                            ...reservation,
                            phone: e.target.value
                          })
                        } />

                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                          value={reservation.date}
                          onChange={(e) =>
                            setReservation({
                              ...reservation,
                              date: e.target.value
                            })
                          } />

                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none bg-white"
                          value={reservation.time}
                          onChange={(e) =>
                            setReservation({
                              ...reservation,
                              time: e.target.value
                            })
                          }>

                          <option value="">Select time</option>
                          <option value="17:00">5:00 PM</option>
                          <option value="17:30">5:30 PM</option>
                          <option value="18:00">6:00 PM</option>
                          <option value="18:30">6:30 PM</option>
                          <option value="19:00">7:00 PM</option>
                          <option value="19:30">7:30 PM</option>
                          <option value="20:00">8:00 PM</option>
                          <option value="20:30">8:30 PM</option>
                          <option value="21:00">9:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Guests
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none bg-white"
                          value={reservation.guests}
                          onChange={(e) =>
                            setReservation({
                              ...reservation,
                              guests: e.target.value
                            })
                          }>

                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                            (num) =>
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                              </option>

                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-32 resize-none"
                      placeholder="Allergies, special occasions, seating preferences..."
                      value={reservation.requests}
                      onChange={(e) =>
                        setReservation({
                          ...reservation,
                          requests: e.target.value
                        })
                      }>
                    </textarea>
                  </div>

                  <button
                    disabled={isReserving}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-orange-500/20 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isReserving ? 'Processing...' : 'Confirm Reservation'}
                  </button>
                </form>
              </div>
              <div className="bg-slate-900 p-8 md:p-12 lg:p-16 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 space-y-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Clock className="w-6 h-6 text-orange-500" /> Opening
                      Hours
                    </h3>
                    <div className="space-y-3 text-slate-300">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>Mon - Thu</span>
                        <span>11:00 AM - 10:00 PM</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>Fri - Sat</span>
                        <span>11:00 AM - 11:00 PM</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>Sunday</span>
                        <span>10:00 AM - 9:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-orange-500" /> Location
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      123 Gourmet Avenue
                      <br />
                      Culinary District, NY 10012
                      <br />
                      United States
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Phone className="w-6 h-6 text-orange-500" /> Contact
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      (555) 123-4567
                      <br />
                      reservations@lamaison.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Visit Us</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We look forward to welcoming you to La Maison.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Our Location',
                lines: ['123 Gourmet Avenue', 'Culinary District, NY 10012']
              },
              {
                icon: Clock,
                title: 'Opening Hours',
                lines: [
                  'Mon-Thu: 11am - 10pm',
                  'Fri-Sat: 11am - 11pm',
                  'Sun: 10am - 9pm']

              },
              {
                icon: Phone,
                title: 'Get in Touch',
                lines: ['(555) 123-4567', 'hello@lamaison.com']
              }].
              map((item, idx) =>
                <div
                  key={idx}
                  className="bg-slate-50 p-8 rounded-2xl text-center hover:shadow-lg transition-all border border-slate-100 group">

                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  {item.lines.map((line, i) =>
                    <p key={i} className="text-slate-600">
                      {line}
                    </p>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Footer */}
      < footer className="relative bg-slate-900 text-white overflow-hidden" >
        {/* Decorative Top Gradient */}
        < div className="h-1 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600" ></div >

        {/* Decorative Background Elements */}
        < div className="absolute top-20 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" ></div >
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>

        {/* Main Footer Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Top Section - Logo & Description */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl shadow-lg shadow-orange-500/20">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight">
                La Maison
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-500"></div>
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-500"></div>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Experience the finest culinary delights in a warm and inviting
              atmosphere. Where every meal is a celebration of flavor and
              artistry.
            </p>
          </div>

          {/* Middle Section - 4 Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 pb-16 border-b border-slate-800">
            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">
                Navigate
              </h4>
              <ul className="space-y-4">
                {[
                  {
                    label: 'Home',
                    id: 'home'
                  },
                  {
                    label: 'About Us',
                    id: 'about'
                  },
                  {
                    label: 'Our Menu',
                    id: 'menu'
                  },
                  {
                    label: 'Reservations',
                    id: 'reservations'
                  },
                  {
                    label: 'Contact',
                    id: 'contact'
                  }].
                  map((item) =>
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-2 group">

                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  )}
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">
                Hours
              </h4>
              <ul className="space-y-4">
                <li className="flex justify-between text-slate-400">
                  <span>Mon – Thu</span>
                  <span className="text-slate-300">11am – 10pm</span>
                </li>
                <li className="flex justify-between text-slate-400">
                  <span>Fri – Sat</span>
                  <span className="text-slate-300">11am – 11pm</span>
                </li>
                <li className="flex justify-between text-slate-400">
                  <span>Sunday</span>
                  <span className="text-slate-300">10am – 9pm</span>
                </li>
                <li className="pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Open Now
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-400">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>
                    123 Gourmet Avenue
                    <br />
                    Culinary District, NY 10012
                  </span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span>(555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span>reservations@lamaison.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">
                Newsletter
              </h4>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Subscribe for exclusive offers, seasonal menus, and special
                event invitations.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-white placeholder-slate-500 transition-all" />

                <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-3 rounded-xl font-medium transition-all text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <p className="text-slate-500 text-sm">Follow us on social media</p>
            <div className="flex gap-3">
              {[
                {
                  icon: Instagram,
                  label: 'Instagram',
                  color: 'hover:bg-pink-500'
                },
                {
                  icon: Facebook,
                  label: 'Facebook',
                  color: 'hover:bg-blue-600'
                },
                {
                  icon: Twitter,
                  label: 'Twitter',
                  color: 'hover:bg-sky-500'
                }].
                map((social, i) =>
                  <a
                    key={i}
                    href="#"
                    className={`group flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full ${social.color} transition-all duration-300`}>

                    <social.icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">
                      {social.label}
                    </span>
                  </a>
                )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} La Maison Restaurant. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Cookies'].map((item) =>
                <a
                  key={item}
                  href="#"
                  className="text-slate-500 hover:text-orange-400 text-sm transition-colors">

                  {item}
                </a>
              )}
              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })
                }
                className="ml-2 w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all group">

                <ArrowRight className="w-4 h-4 -rotate-90 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}